// AdSense remediation: the WordPress archive is 81% verbatim press-release reprints, which is
// what triggered the "Low value content" rejection. Keeps the ~777 original articles (Q&As,
// artist profiles, premieres) and prunes the rest.
// Drafts count against the 10k free-tier doc cap too, so pruning FREES capacity rather than
// needing a plan upgrade. Classification is driven by the local WordPress export, not by GROQ
// text matching, so it stays deterministic and reviewable before anything is written.
//
//   node sanity/scripts/pruneAndPublish.js                        # dry run: classify + doc budget
//   node sanity/scripts/pruneAndPublish.js --unpublish-pr --yes   # 1: de-index live PR posts (reversible)
//   node sanity/scripts/pruneAndPublish.js --publish-originals --yes
//   node sanity/scripts/pruneAndPublish.js --delete-pr --yes      # 3: reclaim doc cap (destructive)

const { createClient } = require('@sanity/client');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');

const DEFAULT_NDJSON = path.join(os.homedir(), 'Desktop/Projects/music_bugle_content/final/all_content.ndjson');
const MIN_ORIGINAL_WORDS = 350;
const DOC_CAP = 9500;
const SWEEP_GRACE_MS = 45000;

function resolveToken() {
    if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
    try {
        return JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config', 'sanity', 'config.json'), 'utf8')).authToken;
    } catch {
        return undefined;
    }
}

function parseArgs(argv) {
    const a = { mode: 'plan', ndjson: DEFAULT_NDJSON, concurrency: 3, limit: null, yes: false, imagedOnly: false };
    for (let i = 0; i < argv.length; i++) {
        const k = argv[i];
        if (k === '--unpublish-pr') a.mode = 'unpublish-pr';
        else if (k === '--publish-originals') a.mode = 'publish-originals';
        else if (k === '--delete-pr') a.mode = 'delete-pr';
        else if (k === '--yes') a.yes = true;
        else if (k === '--imaged-only') a.imagedOnly = true;
        else if (k === '--ndjson') a.ndjson = argv[++i];
        else if (k === '--concurrency') a.concurrency = Number(argv[++i]);
        else if (k === '--limit') a.limit = Number(argv[++i]);
        else throw new Error(`Unknown argument: ${k}`);
    }
    return a;
}

const args = parseArgs(process.argv.slice(2));

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'x2bpcfxa',
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-02-19',
    token: resolveToken(),
    useCdn: false,
    perspective: 'raw', // drafts are invisible without this
});

// ---------------------------------------------------------------- classification

const PR_MARKER = /following press release was issued by|press release (was )?issued by|press release courtesy of/i;

// Wire copy that omits the disclaimer sentence, so PR_MARKER can't catch it. Found by screening
// the keep-set for all-caps header blocks / "premiered by" / "watch-share" phrasing with no byline.
const PR_UNMARKED = new Set([
    'bad-wolves-announce-their-highly-anticipated-sophomore-album-nation-out-october-25th-on-eleven-seven-music-pre-order-new-track-killing-me-slowly-available-now',
    'zoe-wees-unveils-new-single-thats-how-it-goes-feat-6lack',
    'art-pop-chameleon-valerie-lighthart-explores-intrinsic-femme-nature-in-new-singlemusic-video-love-andamp-money',
    'kitt-wakeley-releases-new-single-featuring-joe-satriani',
    'dan-horne-releases-video-from-debut-ep',
    'swiss-alternative-rockers-charles-in-the-kitchen-premiere-new-music-video-you-never-talk-new-ep-the-fifth-mechanism-out-on-division-records',
]);

function bodyText(doc) {
    const out = [];
    for (const b of doc.body || []) {
        if (b._type === 'block') out.push((b.children || []).map((c) => c.text || '').join(''));
    }
    return out.join('\n');
}

// Two conditions, both load-bearing: the PR marker catches syndicated wire copy, and the word
// floor catches unmarked 30-word promo stubs that are equally thin.
function classify(doc) {
    const title = doc.title || '';
    const full = bodyText(doc);
    if (PR_UNMARKED.has(doc.slug && doc.slug.current)) return 'press-release';
    if (PR_MARKER.test(full.slice(0, 1500))) return 'press-release';
    if (/song of the day/i.test(title)) return 'junk';
    if (full.split(/\s+/).filter(Boolean).length < MIN_ORIGINAL_WORDS) return 'junk';
    if (/q ?& ?a/i.test(title)) return 'qa';
    if (/\b(interview|sits down|talks|chats with)\b/i.test(title)) return 'interview';
    if (/\b(premiere|exclusive)\b/i.test(title)) return 'premiere';
    if (/\breview\b/i.test(title)) return 'review';
    return 'feature';
}

async function classifyArchive() {
    if (!fs.existsSync(args.ndjson)) throw new Error(`Missing archive: ${args.ndjson} (pass --ndjson <path>)`);
    const originals = new Map();
    const press = new Map();
    const counts = {};
    const rl = readline.createInterface({ input: fs.createReadStream(args.ndjson), crlfDelay: Infinity });
    for await (const line of rl) {
        if (!line.trim()) continue;
        const doc = JSON.parse(line);
        const slug = doc.slug && doc.slug.current;
        if (!slug) continue;
        const kind = classify(doc);
        counts[kind] = (counts[kind] || 0) + 1;
        (kind === 'press-release' || kind === 'junk' ? press : originals).set(slug, doc.title || '');
    }
    return { originals, press, counts };
}

// ---------------------------------------------------------------- sanity helpers

const liveDocs = () => client.fetch('count(*[!(_id in path("_.**"))])');
const tagCount = () => client.fetch('count(*[_type=="tag"])');

async function withConcurrency(items, limit, worker) {
    let cursor = 0;
    async function next() {
        const i = cursor++;
        if (i >= items.length) return;
        await worker(items[i], i);
        return next();
    }
    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
}

// Slug is the only stable join key: the original import minted fresh random _ids, so Sanity
// docs cannot be matched back to their WordPress post IDs.
async function idsBySlug(slugs, { drafts, imagedOnly }) {
    const filter = drafts ? '_id in path("drafts.**")' : '!(_id in path("drafts.**"))';
    // The old WordPress origin is gone, so a post without mainImage has no recoverable image:
    // featured_image still holds an i0.wp.com URL, but that host isn't in next.config remotePatterns,
    // so next/image 400s and the article renders a broken hero rather than none.
    const imaged = imagedOnly ? ' && defined(mainImage)' : '';
    const found = [];
    for (let i = 0; i < slugs.length; i += 500) {
        found.push(
            ...(await client.fetch(
                `*[_type=="post" && ${filter}${imaged} && slug.current in $batch]{_id, "slug": slug.current, "date": coalesce(publishedAt,_createdAt)}`,
                { batch: slugs.slice(i, i + 500) }
            ))
        );
    }
    return found;
}

async function missingEnrichment(ids) {
    const out = [];
    for (let i = 0; i < ids.length; i += 500) {
        out.push(
            ...(await client.fetch(
                '*[_id in $ids && (!defined(subtitle) || !defined(tags) || count(tags)==0 || !defined(categories) || count(categories)==0)]._id',
                { ids: ids.slice(i, i + 500) }
            ))
        );
    }
    return out;
}

function confirm(what) {
    if (!args.yes) throw new Error(`${what} — re-run with --yes to actually do it.`);
}

// ---------------------------------------------------------------- modes

async function plan({ originals, press, counts }) {
    console.log(`Archive: ${args.ndjson}`);
    for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${k.padEnd(16)} ${String(v).padStart(5)}`);
    }
    console.log(`\n  KEEP  ${originals.size}   PRUNE ${press.size}`);

    let docs, tags;
    try {
        [docs, tags] = await Promise.all([liveDocs(), tagCount()]);
    } catch (e) {
        console.log(`\n(could not read Sanity: ${e.message})`);
        return;
    }
    const livePr = await idsBySlug([...press.keys()], { drafts: false });
    const draftOriginals = await idsBySlug([...originals.keys()], { drafts: true });
    console.log(`\nSanity now: ${docs} docs (${tags} tags), headroom to 10k: ${10000 - docs}`);
    console.log(`  live press-release posts to unpublish : ${livePr.length}`);
    console.log(`  original drafts to publish            : ${draftOriginals.length}`);
    console.log(`  docs reclaimed by --delete-pr         : ~${press.size}`);
    console.log(`  projected after prune: ~${docs - press.size} docs, before new tags`);
}

async function unpublishPr({ press }) {
    const live = await idsBySlug([...press.keys()], { drafts: false });
    console.log(`Live press-release posts: ${live.length}`);
    if (!live.length) return;
    confirm(`Would unpublish ${live.length} posts (reversible — content returns to drafts)`);

    let done = 0;
    let failed = 0;
    await withConcurrency(live, args.concurrency, async (p) => {
        try {
            await client.action({
                actionType: 'sanity.action.document.unpublish',
                draftId: `drafts.${p._id}`,
                publishedId: p._id,
            });
            if (++done % 100 === 0) console.log(`  unpublished ${done}/${live.length}`);
        } catch (e) {
            failed++;
            console.error(`  failed ${p.slug}: ${e.message}`);
        }
    });
    console.log(`Unpublished ${done}, failed ${failed}. Redeploy so the sitemap drops them.`);
}

async function publishOriginals({ originals }) {
    let drafts = await idsBySlug([...originals.keys()], { drafts: true, imagedOnly: args.imagedOnly });
    drafts.sort((a, b) => String(b.date).localeCompare(String(a.date))); // newest first
    if (args.limit) drafts = drafts.slice(0, args.limit);
    console.log(`Original drafts to publish: ${drafts.length}`);
    if (!drafts.length) return;

    const startDocs = await liveDocs();
    const startTags = await tagCount();
    if (startDocs >= DOC_CAP) throw new Error(`Already at ${startDocs} docs (cap ${DOC_CAP}). Run --delete-pr first.`);
    confirm(`Would publish ${drafts.length} originals`);

    const publishedIds = [];
    let failures = 0;
    let stopped = false;
    await withConcurrency(drafts, args.concurrency, async (d, i) => {
        if (stopped) return;
        const publishedId = d._id.replace(/^drafts\./, '');
        try {
            await client.action({ actionType: 'sanity.action.document.publish', draftId: d._id, publishedId });
            publishedIds.push(publishedId);
        } catch (e) {
            failures++;
            console.error(`  publish failed ${d.slug}: ${e.message}`);
        }
        if (i % 50 === 0 && i > 0) {
            const docs = await liveDocs();
            console.log(`  published ${publishedIds.length} | docs ~${docs}`);
            if (docs >= DOC_CAP) {
                stopped = true;
                console.warn(`  doc cap ${DOC_CAP} reached — stopping.`);
            }
        }
    });
    console.log(`Published ${publishedIds.length}, failures ${failures}.${stopped ? ' (hit doc cap)' : ''}`);
    if (!publishedIds.length) return;

    console.log(`Waiting ${SWEEP_GRACE_MS / 1000}s for enrich-post...`);
    await new Promise((r) => setTimeout(r, SWEEP_GRACE_MS));
    const missing = await missingEnrichment(publishedIds);
    const endDocs = await liveDocs();
    const endTags = await tagCount();
    console.log(`Enriched ${publishedIds.length - missing.length}, missing ${missing.length}.`);
    console.log(`Docs ${startDocs} -> ${endDocs} (headroom ${10000 - endDocs}). Tags ${startTags} -> ${endTags}.`);
}

async function deletePr({ press }) {
    const slugs = [...press.keys()];
    const [live, drafts] = await Promise.all([
        idsBySlug(slugs, { drafts: false }),
        idsBySlug(slugs, { drafts: true }),
    ]);
    const ids = [...live, ...drafts].map((d) => d._id);
    console.log(`Press-release docs to delete: ${ids.length} (${live.length} published, ${drafts.length} drafts)`);
    if (!ids.length) return;
    confirm(`Would PERMANENTLY DELETE ${ids.length} documents`);

    // Sanity refuses to delete a referenced doc, and the curated singletons pin press releases.
    // Cleared wholesale, not filtered: seedFeaturedPages.js refills both from surviving posts after.
    const curated = ['popularPage', 'trendingPage', 'drafts.popularPage', 'drafts.trendingPage'];
    const pinned = await client.fetch('*[_id in $ids]._id', { ids: curated });
    if (pinned.length) {
        const tx = client.transaction();
        pinned.forEach((id) => tx.patch(id, (p) => p.unset(['featuredPosts'])));
        await tx.commit();
        console.log(`Cleared featuredPosts on: ${pinned.join(', ')} — re-run seedFeaturedPages.js after publishing.`);
    }

    let deleted = 0;
    for (let i = 0; i < ids.length; i += 100) {
        const tx = client.transaction();
        ids.slice(i, i + 100).forEach((id) => tx.delete(id));
        await tx.commit();
        deleted += Math.min(100, ids.length - i);
        console.log(`  deleted ${deleted}/${ids.length}`);
    }
    console.log(`Deleted ${deleted}. Docs now: ${await liveDocs()}.`);
}

// ---------------------------------------------------------------- main

async function main() {
    if (args.mode !== 'plan' && !resolveToken()) {
        throw new Error('No Sanity token (set SANITY_API_WRITE_TOKEN or run npx sanity login).');
    }
    const archive = await classifyArchive();
    const run = {
        plan,
        'unpublish-pr': unpublishPr,
        'publish-originals': publishOriginals,
        'delete-pr': deletePr,
    }[args.mode];
    await run(archive);
}

main().catch((e) => {
    console.error('Error:', e.message || e);
    process.exitCode = 1;
});
