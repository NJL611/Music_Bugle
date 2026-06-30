import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchAuthorData, fetchAuthorPosts, fetchPopularSidebarPosts } from "@/lib/fetchers";
import FeedLayout from "@/components/layout/FeedLayout";
import { METADATA, SITE_URL } from "@/lib/constants";

type PageProps = { params: Promise<{ slug: string }> };

// Bios are short Portable Text; flatten to a string for the header + meta description.
function bioToText(bio?: Array<{ children?: Array<{ text?: string }> }>): string {
  if (!Array.isArray(bio)) return "";
  return bio
    .map((block) => (Array.isArray(block?.children) ? block.children.map((c) => c?.text ?? "").join("") : ""))
    .join("\n\n")
    .trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await fetchAuthorData(slug);

  if (!author) {
    return { title: "Author Not Found" };
  }

  const description = bioToText(author.bio) || `Articles by ${author.name} on ${METADATA.title}.`;
  const url = `${SITE_URL}/author/${slug}`;

  return {
    title: author.name,
    description,
    openGraph: {
      title: `${author.name} - ${METADATA.title}`,
      description,
      url,
      type: "profile",
    },
    alternates: { canonical: url },
  };
}

export const revalidate = 600;

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;

  const [author, posts, popularPosts] = await Promise.all([
    fetchAuthorData(slug),
    fetchAuthorPosts(slug),
    fetchPopularSidebarPosts(),
  ]);

  if (!author) {
    notFound();
  }

  return (
    <FeedLayout
      title={author.name}
      description={bioToText(author.bio)}
      mainPosts={posts || []}
      popularPosts={popularPosts}
    />
  );
}
