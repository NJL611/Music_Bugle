// Seeds the reader-facing category descriptions shown on /category/* pages and in their meta description.
// Deliberately separate from enrich-post's category-descriptions.json — those are classifier prompts and once leaked onto the live pages.
// node --env-file=.env.local sanity/scripts/seedCategoryDescriptions.js [--yes]

const { createClient } = require('@sanity/client');

const DESCRIPTIONS = {
    'q-and-a': 'Conversations with artists, bands, and the people behind the music, in their own words.',
    'album-reviews': 'Our take on new albums: what works, what doesn’t, and whether it deserves a spot in your rotation.',
    news: 'Music news from around the scene: signings, lineup changes, label moves, and more.',
    'upcoming-releases': 'Albums, EPs, and singles on the way, with release dates and first listens.',
    'new-releases': 'Albums and EPs that just came out from independent and emerging artists.',
    'notable-releases': 'New albums, EPs, and singles from the biggest names in music.',
    'new-songs': 'New singles and tracks from independent and emerging artists.',
    songs: 'A closer look at songs worth revisiting: the lyrics, the history, and the stories behind them.',
    'music-videos': 'Music video premieres and the stories behind them.',
    tours: 'Tour announcements, dates, and coverage from the road.',
    books: 'Music books, from memoirs and biographies to histories of the scenes that shaped them.',
};

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2025-02-19',
    perspective: 'raw',
    token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

async function seedCategoryDescriptions() {
    if (!client.config().projectId) {
        throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID (and SANITY_WRITE_TOKEN for patches).');
    }
    const write = process.argv.includes('--yes');

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
        console.log(`  Updating:  ${cat.slug}\n    - ${cat.description || '(empty)'}\n    + ${desired}`);
    }

    if (updated > 0 && write) {
        await tx.commit();
    }

    const missing = slugs.filter((s) => !categories.find((c) => c.slug === s));
    if (missing.length > 0) {
        console.warn(`\nMissing categories in Sanity (create them in Studio first): ${missing.join(', ')}`);
    }

    console.log(`\n${write ? 'Done' : 'Dry run (pass --yes to write)'}. Updated: ${updated}. Unchanged: ${categories.length - updated}.`);
}

seedCategoryDescriptions().catch((err) => {
    console.error('Failed to seed:', err.message);
    process.exitCode = 1;
});
