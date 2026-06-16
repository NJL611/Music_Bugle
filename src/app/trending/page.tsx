import type { Metadata } from "next";
import FeedLayout from "@/components/layout/FeedLayout";
import { fetchPopularPosts, fetchTrendingPage, fetchTrendingPosts } from "@/lib/fetchers";
import { METADATA, SITE_URL } from "@/lib/constants";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchTrendingPage();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: `${page.title} - ${METADATA.title}`,
      description: page.description,
      url: `${SITE_URL}/trending`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/trending`,
    },
  };
}

export default async function TrendingPage() {
  const [{ page, posts }, popularPosts] = await Promise.all([
    fetchTrendingPosts(),
    fetchPopularPosts(),
  ]);

  return (
    <FeedLayout
      title={page.title}
      description={page.description}
      mainPosts={posts}
      popularPosts={popularPosts}
      categoryLabel="Trending"
    />
  );
}
