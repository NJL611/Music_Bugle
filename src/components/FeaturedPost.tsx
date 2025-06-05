import { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";

import { dataset, projectId } from "../../sanity/env";

export const dynamic = "force-static";

const builder = imageUrlBuilder({ projectId, dataset });

export default function FeaturedPost({ posts }: { posts: SanityDocument[] }): JSX.Element {
  const featuredPost = posts && posts.length > 0 ? posts[3] : null;

  if (!featuredPost) {
    return <div className="text-red-500">No posts found</div>;
  }

  let imageUrl = featuredPost.mainImage?.asset?._ref || featuredPost.mainImage?.asset?._id;
  if (imageUrl) {
    imageUrl = builder
      .image(featuredPost.mainImage.asset)
      .width(145)
      .height(145)
      .fit("clip")
      .auto("format")
      .url();
  } else if (featuredPost.featured_image) {
    imageUrl = featuredPost.featured_image;
  } else {
    imageUrl = "/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg";
  }

  console.log('featuredPost', featuredPost);


  return (
    <div className="w-[400px] relative group flex flex-row items-start justify-between">
      <Link className="flex flex-row items-start gap-4 w-full" href={featuredPost.slug ?? "/"}>
        <div className="flex-1">
          <h2 className="text-[16px] font-medium mb-2 line-clamp-3 overflow-hidden">
            {featuredPost.title || ''}
          </h2>
          <p className="text-sm text-gray-600 mb-1">By {featuredPost.author.name}</p>
          <p className="text-xs text-gray-500">2 hours ago</p>
        </div>
        <div className="relative h-[118px] w-[146px] flex-shrink-0">
          <Image
            className="w-full h-full object-cover"
            width={146}
            height={118}
            src={imageUrl}
            alt={featuredPost.title || "Post Image"}
          />
        </div>
      </Link>
    </div>
  );
}
