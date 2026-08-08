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

// The public site reads Sanity anonymously, so a dead token breaks nothing users can see — it only
// silently kills draft preview, which is how the last pair expired unnoticed for weeks. Sanity
// rejects expired tokens permanently (401, no reactivation), so fail the build loudly instead.
const readToken = process.env.SANITY_API_READ_TOKEN;

if (readToken) {
  const url = `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=true`;
  let status;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${readToken}` },
      signal: AbortSignal.timeout(10_000),
    });
    status = response.status;
  } catch (error) {
    // Network trouble is not a bad token — never block a deploy on Sanity being unreachable.
    console.warn(`\nWarning: could not verify SANITY_API_READ_TOKEN (${error.message}). Skipping.`);
  }

  if (status === 401 || status === 403) {
    console.error(
      `\nBuild aborted: SANITY_API_READ_TOKEN is set but rejected by Sanity (HTTP ${status}).` +
        "\nIt has been revoked or has expired — expired tokens are never reactivated." +
        "\n\nMint a replacement with the Viewer role at:" +
        `\n  https://www.sanity.io/manage/project/${projectId}/api` +
        "\nthen update it in Vercel → Project Settings → Environment Variables." +
        "\n\nTo ship without preview in the meantime, unset SANITY_API_READ_TOKEN."
    );
    process.exit(1);
  }
}

// Nothing deployed uses the write token; if it reached the build env it is sitting there earning
// no keep and widening the blast radius of a leak.
if (process.env.SANITY_WRITE_TOKEN && process.env.VERCEL) {
  console.warn(
    "\nWarning: SANITY_WRITE_TOKEN is set in the deploy environment but no deployed code uses it." +
      "\nIt is only needed locally when running sanity/scripts/*. Consider removing it from Vercel."
  );
}
