import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: 'x2bpcfxa',
    dataset: 'production',
    useCdn: false,
    token: 'sk5T9bMoWzdyK6dsXRIOpmBYXmXmZxmcLbspeP7MJWnk4v03K9BxhQ3LtNz9aHoatIy5VeC85JtsE6PiGjKpJJAUCU95tN5PXmi0Vzwag03HVzkzUcfBc51fQRnTiQbVqLWMesVVV94p9HzIJsYOduyjLIG39uez7m6Vg5hCg7cqhirOa53k'
});

async function publishAllPosts() {
    try {
        // Fetch all unpublished posts
        const drafts = await client.fetch('*[_type == "post" && !(_id in path("drafts.**"))]');

        if (drafts.length === 0) {
            console.log('No drafts to publish.');
            return;
        }

        for (const draft of drafts) {
            const draftId = `drafts.${draft._id}`;
            const publishedDoc = { ...draft, _id: draft._id.replace(/^drafts\./, '') };

            // Publish the draft
            await client.transaction()
                .delete(draftId) // Delete the draft
                .createOrReplace(publishedDoc) // Create the published document
                .commit();

            console.log(`Published: ${publishedDoc._id}`);
        }

        console.log('All posts have been published.');
    } catch (err) {
        console.error('Error publishing posts:', err);
    }
}

publishAllPosts();