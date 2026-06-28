import type { Metadata } from "next";
import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import { SEARCH_QUERY } from "@sanity/lib/queries";
import FeedLayout from "@/components/layout/FeedLayout";
import { fetchPopularSidebarPosts } from "@/lib/fetchers";
import { METADATA, SITE_URL } from "@/lib/constants";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { search } = await searchParams;
  const searchValue = typeof search === "string" ? search.trim() : "";
  const title = searchValue ? `Search: ${searchValue}` : "Search";
  const description = searchValue
    ? `Search results for "${searchValue}" on ${METADATA.title}.`
    : `Search music news, reviews, and articles on ${METADATA.title}.`;
  const url = searchValue
    ? `${SITE_URL}/search?search=${encodeURIComponent(searchValue)}`
    : `${SITE_URL}/search`;

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
    robots: searchValue ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { search } = await searchParams;
  const searchValue = typeof search === "string" ? search : "";

  const [searchResults, popularPosts] = await Promise.all([
    client.fetch<SanityDocument[]>(SEARCH_QUERY, { search: searchValue }),
    fetchPopularSidebarPosts(),
  ]);

  return (
    <FeedLayout
      title={searchValue ? `"${searchValue}"` : "Search"}
      description={
        searchResults.length > 0
          ? `Found ${searchResults.length} articles matching your search.`
          : searchValue
            ? "No articles found matching your search."
            : "Enter a search term using the navigation bar."
      }
      categoryLabel="Search Results"
      mainPosts={searchResults}
      popularPosts={popularPosts}
    />
  );
}
