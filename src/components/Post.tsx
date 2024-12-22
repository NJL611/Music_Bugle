import React from "react";
import Image from "next/image";
import { PortableText, PortableTextComponents, PortableTextComponentProps, PortableTextBlock } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";
import Suggestions from "../components/Suggestions";
import { SanityDocument } from "@sanity/client";

import InstagramLogo from "public/svgs/InstagramLogo";
import TwitterLogo from "public/svgs/TwitterLogo";
import FacebookLogo from "public/svgs/FacebookLogo";
import PinterestLogo from "public/svgs/PinterestLogo";
import MailIcon from "public/svgs/MailIcon";

import { formatDate } from "../../utils/formatDate";

const builder = imageUrlBuilder({ projectId, dataset });

const Advertisement = () => (
  <div className="mx-auto my-5 bg-[#D9D9D9] w-[300px] md:w-[336px]">
    <div className="h-[20px]">
      <span className="px-2 text-left text-[10px] text-gray-500">Advertisement</span>
    </div>
    <div className="bg-[#D9D9D9] h-[250px] md:h-[280px]" />
  </div>
);

const components: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => {
      const text = value.children.map(child => child.text).join('').trim();

      const youTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

      if (youTubeRegex.test(text)) {
        const getYouTubeId = (url) => {
          const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
          const match = url.match(regex);
          return match ? match[1] : null;
        };

        const videoId = getYouTubeId(text);

        if (videoId) {
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;

          return (
            <div className="youtube-container my-4 relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          );
        } else {
          return (
            <p className="text-[16px] leading-[34px] text-gray-700 mb-4 max-w-[750px] mx-auto">
              {children}
            </p>
          );
        }
      }

      return (
        <p className="text-[16px] leading-[34px] text-gray-700 mb-4 max-w-[750px] mx-auto">
          {children}
        </p>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold my-3">{children}</h2>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <>
          <div className="mt-6 w-[95%] h-[225px] md:h-[500px] md:w-full m-auto relative group">
            <Image
              className="w-full h-full object-cover duration-500 my-auto absolute"
              alt={value.alt || ''}
              loading="lazy"
              src={
                builder
                  .image(value)
                  .width(500)
                  .height(300)
                  .fit('max')
                  .auto('format')
                  .url()
              }
              width={800}
              height={450}
            />
          </div>
          {value?.alt && (
            <span className="block mb-6 text-center md:text-left text-[10px] text-gray-500 mt-1">{value.alt}</span>
          )}
        </>
      );
    },
    imageUrl: ({ value }) => {
      return (
        <div className="mt-6 w-[95%] h-[225px] md:h-[500px] md:w-full m-auto relative group">
          <Image src={value.url} alt={value.alt || ''} layout="fill" objectFit="cover" />
          {value.alt && <figcaption>{value.alt}</figcaption>}
        </div>
      )
    },
    ad: () => <Advertisement />,
  },
};

interface Props {
  post: SanityDocument;
  posts: SanityDocument[];
}

export default function Post({ post, posts }: Props) {
  const { title, subtitle, mainImage, body, author, publishedAt, featured_image } = post;

  console.log('post', post);

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

      <div className="mx-auto mt-5 bg-[#D9D9D9] w-[320px] md:w-[728px] lg:w-[970px] ">
        <div className="h-[20px]">
          <span className="px-2 text-left text-[10px] text-gray-500">Advertisement</span>
        </div>
        <div className="bg-[#D9D9D9] h-[50px] md:h-[90px] lg:h-[90px]" />
      </div>

      <div className="lg:pl-24 px-6 lg:pr-6 mx-auto mt-5 grid grid-cols-1 lg:grid-cols-8 border-b border-t">
        <div className="lg:col-span-6 lg:border-r lg:pr-6">
          <span className="mt-4 block text-[13px]">Home {'>'} News</span>
          {title ? (
            <h1 className="mx-auto text-3xl md:text-[36px] md:w-[90%] lg:text-[42px] text-center md:leading-[38px] lg:leading-[52px] tracking-[0.1px] pt-8 pb-4">
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
                <PortableText value={processedBody} components={components} />
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

