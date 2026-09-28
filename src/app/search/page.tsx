// Site search results, rendered through FeedLayout.
// Always noindex and ad-free: indexed internal search pages violate Google/AdSense policy.

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

// Nav submits ?search=; ?q= is the convention people and crawlers guess, so both work.
async function readSearch(searchParams: PageProps["searchParams"]): Promise<string> {
  const { search, q } = await searchParams;
  const value = search ?? q;
  return typeof value === "string" ? value.trim() : "";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const searchValue = await readSearch(searchParams);
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
    // Indexed internal search results are an AdSense/Google policy violation.
    robots: { index: false, follow: true },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const searchValue = await readSearch(searchParams);

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
      showAds={false}
      mainPosts={searchResults}
      popularPosts={popularPosts}
    />
  );
}
