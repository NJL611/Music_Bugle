import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPopularSidebarPosts, fetchTagData, fetchTagPosts } from "@/lib/fetchers";
import FeedLayout from "@/components/layout/FeedLayout";
import { METADATA, SITE_URL } from "@/lib/constants";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await fetchTagData(slug);

  if (!tag) {
    return { title: "Tag Not Found" };
  }

  const title = tag.title;
  const description =
    tag.description ||
    `Articles tagged "${title}" on ${METADATA.title}.`;
  const url = `${SITE_URL}/tag/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} - ${METADATA.title}`,
      description,
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export const revalidate = 600;

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;

  const [tag, posts, popularPosts] = await Promise.all([
    fetchTagData(slug),
    fetchTagPosts(slug),
    fetchPopularSidebarPosts(),
  ]);

  if (!tag) {
    notFound();
  }

  return (
    <FeedLayout
      title={tag.title}
      description={tag.description}
      mainPosts={posts || []}
      popularPosts={popularPosts}
      categoryLabel="Tag"
    />
  );
}
