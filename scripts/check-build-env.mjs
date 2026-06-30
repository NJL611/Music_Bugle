const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET;

const missing = [];
if (!projectId) {
  missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID)");
}
if (!dataset) {
  missing.push("NEXT_PUBLIC_SANITY_DATASET (or SANITY_STUDIO_DATASET)");
}

if (missing.length > 0) {
  console.error("\nBuild aborted: required Sanity env vars are not set:");
  for (const name of missing) {
    console.error(`  - ${name}`);
  }
  console.error(
    "\nAdd them in Vercel → Project Settings → Environment Variables, scoped to Production."
  );
  process.exit(1);
}
