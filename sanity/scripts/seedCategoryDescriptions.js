const path = require('path');
const { createClient } = require('@sanity/client');

// Shared with functions/enrich-post/category-descriptions.json
const DESCRIPTIONS = require(path.join(__dirname, '../../functions/enrich-post/category-descriptions.json'));

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2025-02-19',
    perspective: 'raw',
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

async function seedCategoryDescriptions() {
    if (!client.config().projectId) {
        throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID (and SANITY_API_WRITE_TOKEN for patches).');
    }

    const slugs = Object.keys(DESCRIPTIONS);
    const categories = await client.fetch(
        '*[_type == "category" && slug.current in $slugs]{_id, "slug": slug.current, description}',
        { slugs },
    );

    console.log(`Found ${categories.length} of ${slugs.length} expected categories.`);

    const tx = client.transaction();
    let updated = 0;

    for (const cat of categories) {
        const desired = DESCRIPTIONS[cat.slug];
        if (cat.description === desired) {
            console.log(`  Unchanged: ${cat.slug}`);
            continue;
        }
        tx.patch(cat._id, (p) => p.set({ description: desired }));
        updated++;
        console.log(`  Updating:  ${cat.slug}`);
    }

    if (updated > 0) {
        await tx.commit();
    }

    const missing = slugs.filter((s) => !categories.find((c) => c.slug === s));
    if (missing.length > 0) {
        console.warn(`\nMissing categories in Sanity (create them in Studio first): ${missing.join(', ')}`);
    }

    console.log(`\nDone. Updated: ${updated}. Unchanged: ${categories.length - updated}.`);
}

seedCategoryDescriptions().catch((err) => {
    console.error('Failed to seed:', err.message);
    process.exitCode = 1;
});
