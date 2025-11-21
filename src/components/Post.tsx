import React from "react";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";
import Sidebar from "../components/Sidebar";
import { SanityDocument } from "@sanity/client";
import AdUnit from "./AdUnit";
import { portableTextComponents } from "./PortableTextComponents";
import ShareButtons from "./ShareButtons"; // Import ShareButtons

import { formatDate } from "../../utils/formatDate";

const builder = imageUrlBuilder({ projectId, dataset });

interface Props {
  post: SanityDocument;
  posts: SanityDocument[];
}

export default function Post({ post, posts }: Props) {
  const { title, subtitle, mainImage, body, author, publishedAt, featured_image } = post;

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

      <AdUnit width="w-[320px] md:w-[728px] lg:w-[970px]" height="h-[50px] md:h-[90px] lg:h-[90px]" />

      <div className="lg:pl-24 px-6 lg:pr-6 mx-auto mt-5 grid grid-cols-1 lg:grid-cols-8 border-b border-t">
        <div className="lg:col-span-6 lg:border-r lg:pr-6">
          <span className="mt-4 block text-[11px] uppercase tracking-widest font-graphikregular">Home {'>'} News</span>
          {title ? (
            <h1 className="mx-auto text-[36px] md:w-[90%] text-center md:leading-[1.1] lg:leading-[1.1] tracking-tight pt-8 pb-4 font-abrilFatface text-gray-900">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="leading-[24px] font-light mb-4 text-center text-gray-600 text-lg font-gentiumBookPlusRegular max-w-[90%] mx-auto">
              {subtitle}
            </p>
          ) : null}

          {/* Metadata Row with Share Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 mx-auto">
            {author && publishedAt ? (
              <div className="flex items-center">
                <p className="text-left inline-block text-[11px] uppercase tracking-widest font-graphikmedium text-gray-500">
                  By <span className="text-black font-bold">{author.name}</span> | <span className="text-gray-500">{formatDate(publishedAt)}</span>
                </p>
              </div>
            ) : <></>}
            <span className="text-[11px] font-bold uppercase tracking-widest mr-3 inline-block align-middle">Share Post:</span>

            {/* Share Buttons aligned to the right */}
            <div className="mt-4 md:mt-0">
              <ShareButtons
                className="inline-flex align-middle gap-1"
                itemClassName="bg-[#E93F33] hover:bg-[#d63025] rounded-sm w-6 h-6 !important"
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
                  builder
                    .image(mainImage)
                    .width(1920)
                    .height(2000)
                    .fit("clip")
                    .auto("format")
                    .quality(80)
                    .url() ?? "/path/to/default/image.jpg"
                }
                alt={mainImage.alt || ""}
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
              />
            </div>
          ) : null}
          {body ? (
            <div className="w-full flex justify-center">
              <div className="body-text node-content-body mx-auto mb-8">
                <PortableText value={processedBody} components={portableTextComponents} />
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
