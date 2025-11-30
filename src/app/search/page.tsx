import type { SanityDocument } from "next-sanity";
import { POSTS_PREVIEW_QUERY, SEARCH_QUERY } from "@sanity/lib/queries";
import { client } from "@sanity/lib/client";
import FeedLayout from "@/components/layout/FeedLayout";

export default async function Page({ searchParams }: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { search } = await searchParams;
  const searchValue = typeof search === 'string' ? search : '';

  const [searchResults, allPosts] = await Promise.all([
    client.fetch<SanityDocument[]>(SEARCH_QUERY, { search: searchValue }),
    client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY)
  ]);

  return (
    <FeedLayout
      title={`"${searchValue}"`}
      description={searchResults.length > 0 ? `Found ${searchResults.length} articles matching your search.` : "No articles found matching your search."}
      categoryLabel="Search Results"
      mainPosts={searchResults}
      popularPosts={allPosts}
    />
  );
}
