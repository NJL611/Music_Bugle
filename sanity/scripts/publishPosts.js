const { createClient } = require('@sanity/client');
const readline = require('node:readline/promises');

const client = createClient({
    projectId: 'x2bpcfxa',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-02-19',
    perspective: 'raw',
    token: 'sk5T9bMoWzdyK6dsXRIOpmBYXmXmZxmcLbspeP7MJWnk4v03K9BxhQ3LtNz9aHoatIy5VeC85JtsE6PiGjKpJJAUCU95tN5PXmi0Vzwag03HVzkzUcfBc51fQRnTiQbVqLWMesVVV94p9HzIJsYOduyjLIG39uez7m6Vg5hCg7cqhirOa53k'
});

const DEFAULT_CONCURRENCY = 1;
// After fast publishing, give enrich-post time to settle before checking for missing enrichment.
const SWEEP_GRACE_MS = 30000;

function parseArgs(argv) {
    const args = { limit: null, verify: false, concurrency: DEFAULT_CONCURRENCY };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];

        if (arg === '--verify') {
            args.verify = true;
        } else if (arg === '--concurrency') {
            const value = Number(argv[++i]);
            if (!Number.isInteger(value) || value < 1) {
                throw new Error('--concurrency must be a positive integer.');
            }
            args.concurrency = value;
        } else if (args.limit === null) {
            const limit = Number(arg);
            if (!Number.isInteger(limit) || limit <= 0) {
                throw new Error('Limit must be a positive whole number.');
            }
            args.limit = limit;
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return args;
}

async function confirmPublishAll(count) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(`Found ${count} drafts. Publish all ${count}? (y/N) `);
    rl.close();
    return ['y', 'yes'].includes(answer.trim().toLowerCase());
}

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

// Poll a published doc until enrich-post writes subtitle, tags, and one category, or we hit the timeout.
async function waitForEnrichment(publishedId, timeoutMs = 110000, intervalMs = 3000) {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const doc = await client.fetch(
            '*[_id == $id][0]{ "tagCount": count(coalesce(tags, [])), "hasSubtitle": defined(subtitle), "categoryCount": count(coalesce(categories, [])) }',
            { id: publishedId }
        );

        if (doc?.hasSubtitle && doc?.tagCount > 0 && doc?.categoryCount > 0) return true;
        await new Promise((r) => setTimeout(r, intervalMs));
    }

    return false;
}

async function publishAndVerify(draftId, publishedId) {
    await client.action({ actionType: 'sanity.action.document.publish', draftId, publishedId });
    return waitForEnrichment(publishedId);
}

// Unpublish + republish to retrigger enrich-post, then wait for tags.
async function retryEnrichment(publishedId) {
    const draftId = `drafts.${publishedId}`;
    await client.action({ actionType: 'sanity.action.document.unpublish', draftId, publishedId });
    await new Promise((r) => setTimeout(r, 1500));
    return publishAndVerify(draftId, publishedId);
}

// Default mode: publish in parallel without waiting, then sweep for any that didn't get fully enriched.
async function runFastMode(drafts, concurrency) {
    console.log(`Publishing ${drafts.length} drafts (concurrency: ${concurrency})...`);

    const publishedIds = [];
    let publishFailures = 0;

    await withConcurrency(drafts, concurrency, async (draft) => {
        const draftId = draft._id;
        const publishedId = draftId.replace(/^drafts\./, '');
        try {
            await client.action({ actionType: 'sanity.action.document.publish', draftId, publishedId });
            publishedIds.push(publishedId);
        } catch (e) {
            publishFailures++;
            console.error(`Failed to publish ${publishedId}:`, e.message);
        }
    });

    console.log(`Published: ${publishedIds.length}. Publish failures: ${publishFailures}.`);
    if (publishedIds.length === 0) return;

    console.log(`Waiting ${SWEEP_GRACE_MS / 1000}s for enrich-post to settle...`);
    await new Promise((r) => setTimeout(r, SWEEP_GRACE_MS));

    const missing = await client.fetch(
        '*[_id in $ids && (!defined(tags) || count(tags) == 0 || !defined(categories) || count(categories) == 0)]._id',
        { ids: publishedIds }
    );

    if (missing.length === 0) {
        console.log(`Done. Enriched: ${publishedIds.length}. Still missing enrichment: 0.`);
        return;
    }

    console.log(`\n${missing.length} post(s) still missing enrichment. Retrying (concurrency: ${concurrency})...`);

    let stillMissing = 0;
    await withConcurrency(missing, concurrency, async (publishedId) => {
        try {
            const enriched = await retryEnrichment(publishedId);
            if (!enriched) {
                stillMissing++;
                console.warn(`Still missing after retry: ${publishedId}`);
            }
        } catch (e) {
            stillMissing++;
            console.error(`Retry failed for ${publishedId}:`, e.message);
        }
    });

    console.log(`\nDone. Enriched: ${publishedIds.length - stillMissing}. Still missing enrichment: ${stillMissing}.`);
}

// Verify mode: per-post wait + retry. Slower, ideal for small test batches.
async function runVerifyMode(drafts, concurrency) {
    console.log(`Publishing ${drafts.length} drafts with strict verify (concurrency: ${concurrency})...`);

    let enrichedCount = 0;
    let publishFailures = 0;
    const needsRetry = [];

    await withConcurrency(drafts, concurrency, async (draft, i) => {
        const draftId = draft._id;
        const publishedId = draftId.replace(/^drafts\./, '');
        try {
            const enriched = await publishAndVerify(draftId, publishedId);
            if (enriched) {
                enrichedCount++;
                console.log(`[${i + 1}] Enriched OK: ${publishedId}`);
            } else {
                needsRetry.push(publishedId);
                console.warn(`[${i + 1}] Will retry: ${publishedId}`);
            }
        } catch (e) {
            publishFailures++;
            console.error(`[${i + 1}] Failed to publish ${publishedId}:`, e.message);
        }
    });

    if (needsRetry.length > 0) {
        console.log(`\nRetrying ${needsRetry.length} post(s)...`);
        await withConcurrency(needsRetry, concurrency, async (publishedId) => {
            try {
                if (await retryEnrichment(publishedId)) {
                    enrichedCount++;
                    console.log(`Enriched OK on retry: ${publishedId}`);
                } else {
                    console.warn(`Still missing after retry: ${publishedId}`);
                }
            } catch (e) {
                console.error(`Retry failed for ${publishedId}:`, e.message);
            }
        });
    }

    const stillMissing = drafts.length - enrichedCount - publishFailures;
    console.log(`\nDone. Enriched: ${enrichedCount}. Publish failures: ${publishFailures}. Still missing enrichment: ${stillMissing}.`);
}

async function publishAllPosts() {
    try {
        const args = parseArgs(process.argv.slice(2));

        console.log('Fetching drafts...');
        const drafts = await client.fetch('*[_type == "post" && (_id in path("drafts.**"))] | order(_createdAt asc)');

        if (drafts.length === 0) {
            console.log('No drafts to publish.');
            return;
        }

        console.log(`Found ${drafts.length} drafts.`);

        if (args.limit === null) {
            const confirmed = await confirmPublishAll(drafts.length);
            if (!confirmed) {
                console.log('Publish cancelled.');
                return;
            }
        }

        const draftsToPublish = args.limit === null ? drafts : drafts.slice(0, args.limit);

        if (args.verify) {
            await runVerifyMode(draftsToPublish, args.concurrency);
        } else {
            await runFastMode(draftsToPublish, args.concurrency);
        }
    } catch (err) {
        console.error('Error publishing posts:', err.message);
        process.exitCode = 1;
    }
}

publishAllPosts();
