import React from "react";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";
import Suggestions from "../components/Suggestions";
import { SanityDocument } from "@sanity/client";
import AdUnit from "./AdUnit";
import { portableTextComponents } from "./PortableTextComponents";

import InstagramLogo from "public/svgs/InstagramLogo";
import TwitterLogo from "public/svgs/TwitterLogo";
import FacebookLogo from "public/svgs/FacebookLogo";
import PinterestLogo from "public/svgs/PinterestLogo";
import MailIcon from "public/svgs/MailIcon";

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
          <span className="mt-4 block text-[13px]">Home {'>'} News</span>
          {title ? (
            <h1 className="mx-auto text-3xl md:text-[28px] md:w-[90%] lg:text-[42px] text-center md:leading-[38px] lg:leading-[52px] tracking-[0.1px] pt-8 pb-4">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="leading-[20px] font-light mb-2">
              {subtitle}
            </p>
          ) : null}
          {author && publishedAt ? (
            <div className="flex items-center justify-between mb-5">
              <p className="text-left inline-block text-[12px]">
                <span className="text-[12px]">By </span>
                {author.name} <span className="text-[12px]">| {formatDate(publishedAt)}</span>
              </p>
              <div className="flex gap-2">
                <a href="#" aria-label="Twitter" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
                  <div className="transform scale-[0.75]">
                    <TwitterLogo />
                  </div>
                </a>
                <a href="#" aria-label="Facebook" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
                  <div className="transform scale-[0.75]">
                    <FacebookLogo />
                  </div>
                </a>
                <a href="#" aria-label="Pinterest" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
                  <div className="transform scale-[0.75]">
                    <PinterestLogo />
                  </div>
                </a>
                <a href="#" aria-label="Mail" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
                  <div className="transform scale-[0.75]">
                    <MailIcon />
                  </div>
                </a>
                <a href="#" aria-label="Instagram" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
                  <div className="transform scale-[0.8]">
                    <InstagramLogo />
                  </div>
                </a>
              </div>
            </div>
          ) : null}
          {mainImage ? (
            <div className="h-[300px] md:h-[549px] w-full m-auto relative group">
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
            <div className="h-[300px] md:h-[549px] w-full m-auto relative group">
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
              <div className="body-text node-content-body mx-auto">
                <PortableText value={processedBody} components={portableTextComponents} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="md:col-span-2 relative">
          <Suggestions posts={posts} />
        </div>
      </div>
    </main>
  );
}

