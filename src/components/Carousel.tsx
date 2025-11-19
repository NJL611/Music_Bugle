"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ChevronLeft from "../../public/svgs/ChevronLeft.js";
import ChevronRight from "../../public/svgs/ChevronRight.js";
import CircleIcon from "../../public/svgs/CircleIcon.js";

import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityDocument } from "next-sanity";

import { dataset, projectId } from "../../sanity/env";
import Link from "next/link";
export const dynamic = "force-dynamic";

const builder = imageUrlBuilder({ projectId, dataset });

export default function Carousel({ posts }: { posts: SanityDocument[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // console.log(posts);
  interface ImageData {
    image: string;
  }

  console.log('posts', posts);

  const sanityImagesUrl = posts.map((post) => {
    const hasMainImage = post.mainImage?.asset?._ref || post.mainImage?.asset?._id;
    if (hasMainImage) {
      return builder
        .image(post.mainImage.asset)
        .width(1920)
        .fit("clip")
        .auto("format")
        .url();
    } else if (post.featured_image) {
      return post.featured_image;
    } else {
      return "/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg";
    }
  });

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sanityImagesUrl.length);
    }, 3000);
  }, [sanityImagesUrl.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensures the code runs only in the browser
      resetTimer();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [resetTimer]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      currentIndex === 0 ? sanityImagesUrl.length - 1 : currentIndex - 1
    );
    resetTimer()
  }, [currentIndex, sanityImagesUrl.length, resetTimer]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(
      currentIndex === sanityImagesUrl.length - 1 ? 0 : currentIndex + 1
    );
    resetTimer()
  }, [currentIndex, sanityImagesUrl.length, resetTimer]);

  const goToSlide = useCallback(
    (index: number) => {
      resetTimer();
      setCurrentIndex(index);
    },
    [resetTimer]
  );

  const indicators = sanityImagesUrl.map((item: any, index: any) => (
    <CircleIcon
      key={index}
      className={`mx-1 cursor-pointer ${index === currentIndex ? "text-blue-500" : "text-gray-400"
        }`}
      onClick={() => goToSlide(index)}
    />
  ));

  return (
    <div className="mt-0 w-full h-[549px] bg-[#444444]">
      <div className="max-w-[1920px] h-[549px] w-full m-auto relative group">
        <Link className="block w-full h-full" href={`article/` + posts[currentIndex]?.slug || "/"}>
          <div className="w-full h-full bg-gradient-to-b from-[#3636344d]  to-[#36363454] absolute z-[1]" />
          <Image
            className="w-full h-full object-cover duration-500 my-auto absolute"
            width={1920}
            height={1080}
            src={sanityImagesUrl[currentIndex]}
            alt={"Post Image"}
          />

          <h2 className="absolute text-white translate-x-1/2 right-1/2 bottom-[164px] text-[34px] text-center leading-[44px] z-[2] w-[96%] md:w-auto">
            {posts[currentIndex]?.title}
          </h2>
          <span className="absolute text-white translate-x-1/2 right-1/2 bottom-[72px] text-[18px] text-center z-[2] w-[80%] line-clamp-3">
            {posts[currentIndex]?.body[0]?.children[0].text}
          </span>
        </Link>

        <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-4 z-[2]">
          <div className="p-2 text-white cursor-pointer">
            <ChevronLeft
              className="text-blue-500 hover:text-blue-700"
              width={50}
              height={50}
              onClick={prevSlide}
            />
          </div>
          {indicators}
          <div className="p-2 text-white cursor-pointer">
            <ChevronRight
              className="text-blue-500 hover:text-blue-700"
              width={50}
              height={50}
              onClick={nextSlide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
