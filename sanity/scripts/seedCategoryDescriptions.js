const { createClient } = require('@sanity/client');

// Canonical descriptions used by the enrich-post function to pick one category per article.
// Edit these in Sanity Studio later for tweaks; this script is the seed of record.
const DESCRIPTIONS = {
    'album-reviews': 'Critical review of a specific album where the writer evaluates the music and gives an opinion or rating.',
    'music-videos': 'Article whose primary focus is a music video, such as a premiere, visual analysis, or reaction.',
    'new-releases': 'An album or EP that just came out, where the article is a heads-up rather than a critical review.',
    'new-songs': 'A single or track that just came out, where the article is a heads-up rather than a deep analysis.',
    'news': 'Catch-all for music news that does not fit a more specific category. Examples include signings, lineup changes, label moves, lawsuits, awards, and controversies.',
    'notable-releases': 'A new release by a mainstream, widely-known artist. This applies to charting acts, major-label artists, and household names, but does not include genre-internal popularity.',
    'q-and-a': 'Article in interview or Q&A format with an artist or band.',
    'songs': 'Article focused on a song that is not a fresh release, such as throwbacks, lyrical analyses, and retrospectives.',
    'tours': 'Tour-related coverage including announcements, dates, on-the-road news, and tour reviews.',
    'upcoming-releases': 'An album or song that has been announced but is not yet released.',
};

const client = createClient({
    projectId: 'x2bpcfxa',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-02-19',
    perspective: 'raw',
    token: 'sk5T9bMoWzdyK6dsXRIOpmBYXmXmZxmcLbspeP7MJWnk4v03K9BxhQ3LtNz9aHoatIy5VeC85JtsE6PiGjKpJJAUCU95tN5PXmi0Vzwag03HVzkzUcfBc51fQRnTiQbVqLWMesVVV94p9HzIJsYOduyjLIG39uez7m6Vg5hCg7cqhirOa53k',
});

async function seedCategoryDescriptions() {
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
