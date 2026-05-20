const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: 'x2bpcfxa',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-02-19',
    token: 'sk5T9bMoWzdyK6dsXRIOpmBYXmXmZxmcLbspeP7MJWnk4v03K9BxhQ3LtNz9aHoatIy5VeC85JtsE6PiGjKpJJAUCU95tN5PXmi0Vzwag03HVzkzUcfBc51fQRnTiQbVqLWMesVVV94p9HzIJsYOduyjLIG39uez7m6Vg5hCg7cqhirOa53k'
});

async function deletePosts() {
    const query = '*[_type == "post" && !(_id in path("drafts.**"))]';
    const count = await client.fetch(`count(${query})`);

    if (count === 0) {
        console.log('No published posts to delete');
        return;
    }

    console.log(`Deleting ${count} published posts`);

    await client.delete({ query });

    const remaining = await client.fetch(`count(${query})`);
    console.log(`Finished deleting posts. Remaining published posts: ${remaining}`);
}

deletePosts().catch((err) => {
    console.error(err.message || err);
    process.exitCode = 1;
});
