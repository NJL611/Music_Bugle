const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { createClient } = require('@sanity/client');

const projectRoot = path.join(__dirname, '../..');
const sanityBin = path.join(projectRoot, 'node_modules/.bin/sanity');

function getCliAuthToken() {
    const output = execFileSync(sanityBin, ['debug', '--secrets'], {
        cwd: projectRoot,
        encoding: 'utf8',
    });
    const plain = output.replace(/\u001b\[[0-9;]*m/g, '');
    const match = plain.match(/Auth token:\s*'([^']+)'/);
    return match?.[1];
}

function createWriteClient() {
    const token =
        process.env.SANITY_API_WRITE_TOKEN ||
        process.env.SANITY_WRITE_TOKEN ||
        getCliAuthToken();

    if (!token) {
        throw new Error('No Sanity write token found. Log in with `npx sanity login` or set SANITY_WRITE_TOKEN.');
    }

    return createClient({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        useCdn: false,
        apiVersion: '2025-02-19',
        perspective: 'raw',
        token,
    });
}

async function fetchPosts() {
    const readClient = createClient({
        projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        useCdn: false,
        apiVersion: '2025-02-19',
        perspective: 'raw',
    });

    return readClient.fetch(
        '*[_type == "post" && defined(slug.current)]{_id, title} | order(publishedAt desc)',
    );
}

function pickRandom(items, count) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

function toFeaturedRefs(postIds) {
    return postIds.map((id) => ({
        _type: 'reference',
        _ref: id,
        _key: randomUUID(),
    }));
}

async function saveDocument(doc) {
    const writeClient = createWriteClient();
    await writeClient.createOrReplace(doc);
    // Studio reads drafts; keep draft in sync so featured posts appear in the editor.
    await writeClient.createOrReplace({
        ...doc,
        _id: `drafts.${doc._id}`,
    });
}

const PAGE_DEFAULTS = {
    trendingPage: {
        _id: 'trendingPage',
        _type: 'trendingPage',
        title: 'Trending',
        description:
            'The stories getting the most attention right now — curated by our editors and updated automatically.',
        autoFillDays: 14,
        autoFillLimit: 24,
    },
    popularPage: {
        _id: 'popularPage',
        _type: 'popularPage',
        title: 'Popular',
        description:
            'The stories readers are engaging with most — curated by our editors until analytics is connected.',
        autoFillDays: 14,
        autoFillLimit: 12,
    },
};

async function seedFeaturedPosts() {
    const posts = await fetchPosts();

    if (posts.length < 5) {
        throw new Error(`Need at least 5 posts, found ${posts.length}.`);
    }

    const trendingIds = pickRandom(posts, 5).map((post) => post._id);
    const popularIds = pickRandom(posts, 5).map((post) => post._id);

    for (const [pageKey, defaults] of Object.entries(PAGE_DEFAULTS)) {
        const featuredIds = pageKey === 'trendingPage' ? trendingIds : popularIds;
        const doc = {
            ...defaults,
            featuredPosts: toFeaturedRefs(featuredIds),
        };

        await saveDocument(doc);

        const titles = posts
            .filter((post) => featuredIds.includes(post._id))
            .map((post) => post.title);

        console.log(`\n${defaults.title} (${pageKey}):`);
        titles.forEach((title, index) => console.log(`  ${index + 1}. ${title}`));
    }

    console.log('\nDone. Featured posts saved to Trending Page and Popular Page.');
}

seedFeaturedPosts().catch((err) => {
    console.error('Failed to seed featured posts:', err.message);
    process.exitCode = 1;
});
