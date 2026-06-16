const readline = require('node:readline/promises');
const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2025-02-19',
    perspective: 'raw',
    token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

function parseArgs(argv) {
    const args = { limit: null, dryRun: false, yes: false };

    for (const arg of argv) {
        if (arg === '--dry-run') {
            args.dryRun = true;
        } else if (arg === '--yes') {
            args.yes = true;
        } else if (args.limit === null) {
            const limit = Number(arg);
            if (!Number.isInteger(limit) || limit <= 0) {
                throw new Error('Limit must be a positive whole number, or use --dry-run / --yes.');
            }
            args.limit = limit;
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    return args;
}

async function confirmReset(count) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await rl.question(`Clear enrichment on ${count} draft(s)? (y/N) `);
    rl.close();
    return ['y', 'yes'].includes(answer.trim().toLowerCase());
}

async function resetEnrichment() {
    if (!client.config().projectId) {
        throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID (and SANITY_API_WRITE_TOKEN for patches).');
    }
    if (!client.config().token) {
        throw new Error('Set SANITY_API_WRITE_TOKEN for draft patches.');
    }

    const args = parseArgs(process.argv.slice(2));

    console.log('Fetching post drafts...');
    const drafts = await client.fetch(
        '*[_type == "post" && _id in path("drafts.**")] | order(_createdAt asc) { _id, title }',
    );

    if (drafts.length === 0) {
        console.log('No post drafts found.');
        return;
    }

    const targets = args.limit === null ? drafts : drafts.slice(0, args.limit);
    console.log(`Found ${drafts.length} draft(s). Will reset ${targets.length}.`);

    if (!args.yes && !args.dryRun) {
        const confirmed = await confirmReset(targets.length);
        if (!confirmed) {
            console.log('Reset cancelled.');
            return;
        }
    }

    if (args.dryRun) {
        console.log('\nDry run — would unset subtitle, tags, categories on:');
        for (const draft of targets) {
            console.log(`  ${draft._id}  ${draft.title?.slice(0, 60) ?? '(no title)'}`);
        }
        console.log(`\nThen run: node sanity/scripts/publishPosts.js ${args.limit ?? ''} --verify`.trim());
        return;
    }

    let reset = 0;
    let failed = 0;

    for (const draft of targets) {
        try {
            await client
                .patch(draft._id)
                .unset(['subtitle', 'tags', 'categories'])
                .commit();
            reset++;
            console.log(`Reset: ${draft._id}`);
        } catch (err) {
            failed++;
            console.error(`Failed ${draft._id}:`, err.message);
        }
    }

    console.log(`\nDone. Reset: ${reset}. Failed: ${failed}.`);
    console.log(
        `Next: node sanity/scripts/publishPosts.js${args.limit ? ` ${args.limit}` : ''} --verify --concurrency 1`,
    );
}

resetEnrichment().catch((err) => {
    console.error('Failed to reset enrichment:', err.message);
    process.exitCode = 1;
});
