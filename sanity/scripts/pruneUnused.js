// Deletes tags and image assets that no document (published, draft or release) references.
// Pruned posts left ~1.9k orphaned images and tags behind, and each one counts against the plan's document quota.
//
//   node --env-file=.env.local sanity/scripts/pruneUnused.js         # dry run
//   node --env-file=.env.local sanity/scripts/pruneUnused.js --yes   # delete (destructive — export first)

const { createClient } = require('@sanity/client');

// Anything created or edited since this date may be mid-authoring, so it is never touched.
const CUTOFF = '2026-09-01T00:00:00Z';
const BATCH = 100;

const yes = process.argv.includes('--yes');

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2025-02-19',
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    perspective: 'raw', // references() must see drafts and release versions too
});

const unreferenced = (type) =>
    client.fetch(
        `*[_type == $type && !(_id in path("drafts.**")) && _createdAt < $cut && _updatedAt < $cut
            && count(*[references(^._id)]) == 0]{_id, "label": coalesce(title, originalFilename, _id)}`,
        { type, cut: CUTOFF }
    );

async function remove(docs) {
    let deleted = 0;
    let failed = 0;
    for (let i = 0; i < docs.length; i += BATCH) {
        const batch = docs.slice(i, i + BATCH);
        try {
            const tx = client.transaction();
            for (const d of batch) tx.delete(d._id);
            await tx.commit({ visibility: 'async' });
            deleted += batch.length;
        } catch {
            // One doc gaining a reference since the query aborts the whole transaction; isolate it.
            for (const d of batch) {
                try {
                    await client.delete(d._id);
                    deleted++;
                } catch (e) {
                    failed++;
                    console.log(`  kept ${d._id}: ${e.message}`);
                }
            }
        }
        process.stdout.write(`\r  ${deleted}/${docs.length} deleted, ${failed} failed`);
    }
    console.log();
}

(async () => {
    const before = await client.fetch('count(*[!(_id in path("_.**"))])');
    const [tags, images] = await Promise.all([unreferenced('tag'), unreferenced('sanity.imageAsset')]);
    console.log(`Docs now: ${before}  (keeping anything created/edited since ${CUTOFF})`);
    console.log(`  unused tags   : ${tags.length}  e.g. ${tags.slice(0, 5).map((d) => d.label).join(', ')}`);
    console.log(`  unused images : ${images.length}  e.g. ${images.slice(0, 3).map((d) => d.label).join(', ')}`);
    console.log(`  after prune   : ~${before - tags.length - images.length}`);
    if (!yes) return console.log('\nDry run — re-run with --yes to delete.');

    console.log('\nTags:');
    await remove(tags);
    console.log('Images:');
    await remove(images);
    console.log(`Docs now: ${await client.fetch('count(*[!(_id in path("_.**"))])')}`);
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
