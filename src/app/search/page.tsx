import type { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import { loadQuery } from "../../../sanity/lib/store";
import { POSTS_QUERY, SEARCH_QUERY } from "../../../sanity/lib/queries";
import { client } from "../../../sanity/lib/client";
import Nav from "@/components/Nav";
import PostGrid from "@/components/PostGrid";

export async function generateStaticParams() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY)

  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

export default async function Page({ params, searchParams }: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const searchValue = searchParams.search || '';

  const initial = await loadQuery<SanityDocument[]>(SEARCH_QUERY, { ...params, search: searchValue }, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });

  const posts = initial.data || [];

  return (
    <>
      <Nav />
      <div className='p-8 min-h-screen'>
        <h1 className="text-2xl font-bold mb-6">Search Results for &quot;{searchValue}&quot;</h1>
        {posts.length > 0 ? (
          <PostGrid posts={posts} columns={4} />
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </>
  );
}
