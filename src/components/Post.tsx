'use client'
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { SanityDocument } from "next-sanity";
import useWindowUtils from '@/hooks/useWindowUtils';
import { dataset, projectId } from "../../sanity/env";
import React, { useEffect } from 'react';
import Disqus from "../components/Disqus";

// Example advertisement component
const Advertisement = () => (
  <div className="my-4 p-4 h-36 bg-gray-300 text-center" />
);

const builder = imageUrlBuilder({ projectId, dataset });


export default function Post({ post }: { post: SanityDocument }) {
  const { title, mainImage, body } = post;
  const { size, windowWidth } = useWindowUtils();

  useEffect(() => {
    console.log('size: ', size);
    windowWidth && console.log('windowWidth: ', windowWidth);
  }, [size, windowWidth]);

  const imageUrl = builder.image(post.mainImage?.asset)
    .image(post.mainImage?.asset)
    .width(windowWidth - 400)
    .fit("crop")
    .auto("format")
    .url() ?? "/path/to/default/image.jpg";

  let paragraphCount = 0;

  const myPortableTextComponents: PortableTextComponents = {
    types: {
      image: ({ value }) => (
        <div className="image-container">
          <Image
            className="m-0 w-1/3 mr-4 rounded-lg"
            src={builder.image(value).width(300).height(300).quality(80).url()}
            width={300}
            height={300}
            alt={value.alt || ''}
          />
          {value.alt ? <p className="image-caption">{value.alt}</p> : null}
        </div>
      ),
    },
    block: {
      normal: ({ children }) => {
        paragraphCount += 1;

        const isAdTime = paragraphCount % 3 === 0;

        return (
          <React.Fragment>
            <p>{children}</p>
            {isAdTime && <Advertisement />}
          </React.Fragment>
        );
      }
    },
    marks: {
    }
  };

  return (
    <main className="container mx-auto prose prose-lg p-4">
      {title ? <h1>{title}</h1> : null}
      {mainImage ? (
        <div className={`flex justify-center items-center w-[${size === 'small' ? 320 : 'medium' ? 640 : 'large' ? 1980 : 1980}] bg-orange-500`}>
          <Image
            className={`h-full duration-500 my-auto`}
            width={windowWidth - 200}
            height={windowWidth / 24}
            src={imageUrl}
            alt={mainImage.alt || ''}
          />
        </div>
      ) : null}
      {body ? <PortableText value={body} components={myPortableTextComponents} /> : null}
      <Disqus post={post} />
    </main>
  );
}
