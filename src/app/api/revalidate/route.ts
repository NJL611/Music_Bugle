// Sanity publish webhook: drops the cached pages so edits go live on the next visit.
// Articles are force-static with a 24h revalidate, so without this a post edited after publishing stays stale for a day.
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set.");
    return new Response("SANITY_REVALIDATE_SECRET is not set.", { status: 500 });
  }

  // Waiting for eventual consistency stops the regeneration from reading the pre-edit post off Sanity's CDN.
  const { isValidSignature } = await parseBody(req, secret, true);
  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Whole site, not just the article: the post also appears on the homepage, listings, sidebars and feed.
  // Pages regenerate lazily on their next visit, so this costs nothing up front.
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true });
}
