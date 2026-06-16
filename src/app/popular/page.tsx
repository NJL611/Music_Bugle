import type { Metadata } from "next";
import FeedLayout from "@/components/layout/FeedLayout";
import { fetchPopularPage, fetchPopularPosts, fetchPopularSidebarPosts } from "@/lib/fetchers";
import { METADATA, SITE_URL } from "@/lib/constants";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPopularPage();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: `${page.title} - ${METADATA.title}`,
      description: page.description,
      url: `${SITE_URL}/popular`,
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/popular`,
    },
  };
}

export default async function PopularPage() {
  const [page, posts, sidebarPosts] = await Promise.all([
    fetchPopularPage(),
    fetchPopularPosts(),
    fetchPopularSidebarPosts(),
  ]);

  return (
    <FeedLayout
      title={page.title}
      description={page.description}
      mainPosts={posts}
      popularPosts={sidebarPosts}
      categoryLabel="Popular"
    />
  );
}
