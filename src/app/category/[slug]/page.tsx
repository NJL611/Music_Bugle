import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCategoryData, fetchCategoryPosts, fetchPopularSidebarPosts } from "@/lib/fetchers";
import FeedLayout from "@/components/layout/FeedLayout";
import { METADATA, SITE_URL } from "@/lib/constants";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryData(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = category.title;
  const description =
    category.description ||
    `Browse ${title} articles on ${METADATA.title} — music news, reviews, and coverage.`;
  const url = `${SITE_URL}/category/${slug}`;

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

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const [category, posts, popularPosts] = await Promise.all([
    fetchCategoryData(slug),
    fetchCategoryPosts(slug),
    fetchPopularSidebarPosts(),
  ]);

  // empty categories 404 so they aren't indexed as thin pages (AdSense "low value content")
  if (!category || !posts?.length) {
    notFound();
  }

  return (
    <FeedLayout
      title={category.title}
      description={category.description}
      mainPosts={posts || []}
      popularPosts={popularPosts}
    />
  );
}
