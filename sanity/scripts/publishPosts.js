const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'x2bpcfxa',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-05-03', // use a current date
    token: 'sk5T9bMoWzdyK6dsXRIOpmBYXmXmZxmcLbspeP7MJWnk4v03K9BxhQ3LtNz9aHoatIy5VeC85JtsE6PiGjKpJJAUCU95tN5PXmi0Vzwag03HVzkzUcfBc51fQRnTiQbVqLWMesVVV94p9HzIJsYOduyjLIG39uez7m6Vg5hCg7cqhirOa53k'
});

async function publishAllPosts() {
    try {
        console.log('Fetching drafts...');
        // Fetch all drafts (documents starting with drafts.)
        const drafts = await client.fetch('*[_type == "post" && (_id in path("drafts.**"))]');

        if (drafts.length === 0) {
            console.log('No drafts to publish.');
            return;
        }

        console.log(`Found ${drafts.length} drafts.`);

        // Process in batches to avoid transaction limits if necessary, 
        // but for simplicity, we'll do one transaction per doc or small batches.
        // Sanity transactions have a limit. It's safer to loop and do one transaction per draft to ensure progress or manageable batches.

        for (const draft of drafts) {
            const draftId = draft._id;
            const publishedId = draft._id.replace(/^drafts\./, '');

            // Remove _rev from the object because we want to overwrite whatever is there (or create new)
            // and we don't want a revision mismatch error from the draft rev being applied to the published doc.
            const { _rev, ...draftContent } = draft;

            const publishedDoc = { ...draftContent, _id: publishedId };

            // Publish the draft
            try {
                await client.transaction()
                    .createOrReplace(publishedDoc) // Create or update the published document
                    .delete(draftId) // Delete the draft
                    .commit();
                console.log(`Published: ${publishedId}`);
            } catch (txErr) {
                console.error(`Failed to publish ${publishedId}:`, txErr.message);
            }
        }

        console.log('Finished processing posts.');
    } catch (err) {
        console.error('Error publishing posts:', err);
    }
}

publishAllPosts();