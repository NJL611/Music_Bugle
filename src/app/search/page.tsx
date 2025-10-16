import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import { loadQuery } from "../../../sanity/lib/store";
import { POSTS_QUERY, SEARCH_QUERY } from "../../../sanity/lib/queries";
import { client } from "../../../sanity/lib/client";
import Nav from "@/components/Nav";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../../sanity/env";
import Image from "next/image"
import Link from "next/link";
const builder = imageUrlBuilder({ projectId, dataset });

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

  const initial = await loadQuery<SanityDocument>(SEARCH_QUERY, { ...params, search: searchValue }, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });

  return (
    <>
      <Nav />
      <div className='p-6'>
        <h1>Search Results for {searchParams.search}</h1>
        {initial ? (
          initial.data.map((post: any) => {
            const imageUrl = builder.image(post.mainImage?.asset)
              .width(298)
              .height(192)
              .fit('crop')
              .auto('format')
              .url() ?? "/path/to/default/image.jpg";

            const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: '2-digit'
            });

            return (
              <div key={post.slug} className="py-4 w-full md:w-[48%] lg:w-[48%] xl:w-[24%]">
                <Image
                  className="w-full h-auto object-cover"
                  width={298}
                  height={192}
                  src={imageUrl}
                  alt={post.title || 'Post Image'}
                />
                <div className="inline-block">
                  <div className="mb-2">
                    {post.categories.map((category: any) => (
                      <Link
                        key={category._id}
                        href={`/category/${category.slug}`}
                        className="inline-block text-sm text-[#808080] hover:text-[#606060] py-2 mr-2 transition-colors duration-200"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/article/${post.slug}` || '/'}>
                    <div>
                      <h2 className="text-[22px] font-bold inline-block hover:text-gray-700 transition-colors duration-200">{post.title}</h2>
                      {post.author && <p className="text-sm">By <span className="bold">{post.author.name}</span> | {formattedDate}</p>}
                    </div>
                  </Link>
                </div>
              </div>
            )
          })
        ) : <p>No results found.</p>}
      </div>
    </>
  );
}
