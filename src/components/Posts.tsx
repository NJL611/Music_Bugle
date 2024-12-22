import { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";

import { dataset, projectId } from "../../sanity/env";

export const dynamic = 'force-static'

const builder = imageUrlBuilder({ projectId, dataset });

export default function Posts({ posts, amount = 4 }: { posts: SanityDocument[], amount?: number }): JSX.Element {
  return (
    <div className="xl:px-[103px] px-4 md:px-4 lg:px-6 py-12 ">
      <span className="w-full text-lg mb-4 text-left">LATEST</span>
      <div className="mx-auto flex flex-wrap gap-[14px] justify-center py-4">
        {posts?.length > 0 ? (
          posts.slice(0, amount).map((post) => {

            let imageUrl = post.mainImage?.asset?._ref || post.mainImage?.asset?._id;
            if (imageUrl) {
              imageUrl = builder
                .image(post.mainImage.asset)
                .width(1920)
                .fit("clip")
                .auto("format")
                .url();
            } else if (post.featured_image) {
              imageUrl = post.featured_image;
            } else {
              imageUrl = "/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg";
            }

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
                  href={`article/${post.slug}` || '/'}>
                  {post?.categories?.map((category: any) => (
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
      </div>
    </div>
  );
}
