import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: 'x2bpcfxa',
    dataset: 'production',
    useCdn: false,
    token: 'sk5T9bMoWzdyK6dsXRIOpmBYXmXmZxmcLbspeP7MJWnk4v03K9BxhQ3LtNz9aHoatIy5VeC85JtsE6PiGjKpJJAUCU95tN5PXmi0Vzwag03HVzkzUcfBc51fQRnTiQbVqLWMesVVV94p9HzIJsYOduyjLIG39uez7m6Vg5hCg7cqhirOa53k'
});

async function deletePosts() {
    const posts = await client.fetch('*[_type == "post"]._id');
    console.log(`Found ${posts.length} posts to delete`);

    for (const postId of posts) {
        await client.delete(postId);
        console.log(`Deleted post: ${postId}`);
    }

    console.log('Finished deleting posts');
}

deletePosts().catch((err) => {
    console.error(err);
});
