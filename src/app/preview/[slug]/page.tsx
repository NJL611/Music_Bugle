// Draft preview of an article, rendered with the same components as the live page.
// Lives on its own route so /article/[slug] can stay force-static for the 800+ published posts.
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { createClient } from "next-sanity";
import type { SanityDocument } from "next-sanity";
import { POSTS_PREVIEW_LIMITED_QUERY, POST_QUERY } from "@sanity/lib/queries";
import { client } from "@sanity/lib/client";
import { dataset, projectId } from "@sanity/env";
import Nav from "@/components/layout/Nav";
import Post from "@/components/posts/Post";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const SPACING_PRESETS = ["tight", "standard", "airy"] as const;
type Spacing = (typeof SPACING_PRESETS)[number];

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ spacing?: string }>;
}) {
  if (!(await draftMode()).isEnabled) {
    notFound();
  }

  const token = process.env.SANITY_API_READ_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_READ_TOKEN — preview cannot read drafts");
  }

  const draftClient = createClient({
    dataset,
    projectId,
    token,
    useCdn: false,
    // Pinned ahead of the site-wide 2024-02-05: the "drafts" perspective only exists from
    // 2025-02-19 on (it was "previewDrafts" before). Scoped here so live queries are untouched.
    apiVersion: "2025-02-19",
    perspective: "drafts",
  });

  const { slug } = await params;
  const post = await draftClient.fetch<SanityDocument>(POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  const posts = await client.fetch<SanityDocument[]>(POSTS_PREVIEW_LIMITED_QUERY, { limit: 13 });

  const requested = (await searchParams).spacing;
  const spacing: Spacing = SPACING_PRESETS.includes(requested as Spacing)
    ? (requested as Spacing)
    : "standard";

  return (
    <>
      <div className="bg-theme-red text-white text-center text-sm py-2 font-graphiknormal">
        Draft preview — not visible to readers.{" "}
        <a href="/api/draft-mode/disable" className="underline">
          Exit preview
        </a>
      </div>
      <div className="bg-gray-100 border-b border-gray-200 text-center py-2 font-graphiknormal text-sm">
        <span className="text-gray-600 mr-3">Body spacing:</span>
        {SPACING_PRESETS.map((preset) => (
          <a
            key={preset}
            href={`?spacing=${preset}`}
            className={
              preset === spacing
                ? "mx-1 px-3 py-1 rounded-full bg-theme-red text-white capitalize"
                : "mx-1 px-3 py-1 rounded-full bg-white border border-gray-300 hover:border-theme-red capitalize"
            }
          >
            {preset}
          </a>
        ))}
      </div>
      <Nav />
      {/* VisualEditing mounts once in the root layout, gated on draft mode. */}
      <Post post={post} posts={posts} spacing={spacing} />
    </>
  );
}
