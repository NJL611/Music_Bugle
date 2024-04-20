import { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";

import { dataset, projectId } from "../../sanity/env";

const builder = imageUrlBuilder({ projectId, dataset });

export default function Posts({ posts }: { posts: SanityDocument[] }) {
  return (
    <div className="xl:px-[103px] px-4 md:px-4 lg:px-6 py-12 ">
      <span className="w-full text-lg mb-4 text-left">LATEST</span>
      <main className="mx-auto flex flex-wrap gap-[14px] justify-center py-4">
        {posts?.length > 0 ? (
          posts.map((post) => {
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
              <div key={post._id} className="py-4 w-full md:w-[48%] lg:w-[48%] xl:w-[24%]">
                <Image
                  className="w-full h-auto object-cover"
                  width={298}
                  height={192}
                  src={imageUrl}
                  alt={post.title || 'Post Image'}
                />
                <Link
                  className="inline-block"
                  href={post.slug || '/'}>
                  {post.categories.map((category: any) => (
                    <span key={category._id} className="inline-block text-sm text-[#808080] py-2">{category.title}</span>
                  ))}
                  <div>
                    <h2 className="text-[22px] font-bold inline-block">{post.title}</h2>
                    {post.author && <p className="text-sm">By <span className="bold">{post.author.name}</span> | {formattedDate}</p>}
                  </div>
                </Link>
              </div>
            );
          })
        ) : (
          <div className="text-red-500">No posts found</div>
        )}
      </main>
    </div>
  );
}
