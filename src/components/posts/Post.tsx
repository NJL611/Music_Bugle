import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import type { SanityDocument } from "next-sanity";
import Sidebar from "@/components/layout/Sidebar";
import { AdUnit, ShareButtons } from "@/components/ui/Primitives";
import { portableText } from "@/components/posts/PortableText";
import { sanityImageBuilder } from "@/lib/utils";
import { AD_SIZES } from "@/lib/constants";

interface Props {
  post: SanityDocument;
  posts: SanityDocument[];
}

export default function Post({ post, posts }: Props) {
  const { title, subtitle, mainImage, body, featured_image } = post;

  const processedBody: PortableTextBlock[] = [];
  let paragraphCounter = 0;

  if (body && Array.isArray(body)) {
    body.forEach((block, index) => {
      processedBody.push(block);

      if (block._type === 'block' && block.style === 'normal') {
        paragraphCounter++;

        if (paragraphCounter % 4 === 0) {
          processedBody.push({ _type: 'ad', _key: `ad-${index}`, children: [] });
        }
      }
    });
  }

  return (
    <main className="mx-auto">

      <AdUnit width={AD_SIZES.RESPONSIVE_LEADERBOARD.width} height={AD_SIZES.RESPONSIVE_LEADERBOARD.height} />

      <div className="lg:pl-24 px-6 lg:pr-6 mx-auto mt-5 grid grid-cols-1 lg:grid-cols-8 border-b border-t border-gray-200">
        <div className="lg:col-span-6 lg:border-r border-gray-200 lg:pr-6">
          <span className="mt-4 block text-[11px] uppercase tracking-widest font-graphiknormal">Home {'>'} News</span>
          {title ? (
            <h1 className="mx-auto text-[36px] md:w-[90%] text-center md:leading-[1.1] lg:leading-[1.1] tracking-tight pt-8 pb-4 font-abril text-gray-900">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="leading-[24px] font-light mb-4 text-center text-gray-600 text-lg font-graphiklight max-w-[90%] mx-auto">
              {subtitle}
            </p>
          ) : null}

          {/* Metadata Row with Share Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 mx-auto">

            <span className="text-[11px] uppercase tracking-widest mr-3 inline-block align-middle">Share Post:</span>

            {/* Share Buttons aligned to the right */}
            <div className="mt-4 md:mt-0">
              <ShareButtons
                className="inline-flex align-middle gap-1"
                itemClassName="bg-theme-red hover:bg-theme-red/90 rounded-sm w-6 h-6 text-white !important"
              />
            </div>
          </div>

          {mainImage ? (
            <div className="h-[300px] md:h-[549px] w-full m-auto relative group mb-10">
              <Image
                className="w-full h-full object-cover duration-500 my-auto absolute"
                width={1920}
                height={2000}
                src={
                  sanityImageBuilder
                    .image(mainImage)
                    .width(1920)
                    .height(2000)
                    .fit("clip")
                    .auto("format")
                    .quality(80)
                    .url() ?? "/path/to/default/image.jpg"
                }
                alt={mainImage.alt || ""}
                priority
              />
            </div>
          ) : featured_image ? (
            <div className="h-[300px] md:h-[549px] w-full m-auto relative group mb-10">
              <Image
                className="w-full h-full object-cover duration-500 my-auto absolute"
                width={1920}
                height={2000}
                src={featured_image}
                alt={""}
                priority
              />
            </div>
          ) : null}
          {body ? (
            <div className="w-full flex justify-center">
              <div className="body-text node-content-body mx-auto mb-8">
                <PortableText value={processedBody} components={portableText} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="md:col-span-2 relative">
          <Sidebar posts={posts} />
        </div>
      </div>
    </main>
  );
}
