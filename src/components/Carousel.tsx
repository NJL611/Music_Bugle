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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // console.log(posts);

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

  const changeSlide = useCallback((newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 200);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sanityImagesUrl.length);
    }, 3000);
  }, [sanityImagesUrl.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      intervalRef.current = setInterval(() => {
        const newIndex = (currentIndex + 1) % sanityImagesUrl.length;
        changeSlide(newIndex);
      }, 3000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [changeSlide, currentIndex, sanityImagesUrl.length]);

  const prevSlide = useCallback(() => {
    const newIndex = currentIndex === 0 ? sanityImagesUrl.length - 1 : currentIndex - 1;
    changeSlide(newIndex);
  }, [currentIndex, sanityImagesUrl.length, changeSlide]);

  const nextSlide = useCallback(() => {
    const newIndex = currentIndex === sanityImagesUrl.length - 1 ? 0 : currentIndex + 1;
    changeSlide(newIndex);
  }, [currentIndex, sanityImagesUrl.length, changeSlide]);

  const goToSlide = useCallback(
    (index: number) => {
      if (index !== currentIndex) {
        changeSlide(index);
      }
    },
    [currentIndex, changeSlide]
  );

  const indicators = sanityImagesUrl.map((item: any, index: any) => (
    <CircleIcon
      key={index}
      className={`cursor-pointer transition-all hover:text-gray-400 ${index === currentIndex ? "text-gray-400" : "text-white"
        }`}
      onClick={() => goToSlide(index)}
    />
  ));

  return (
    <div className="w-full aspect-[16/9] max-h-[550px] bg-[#444444]">
      <div className="w-full h-full m-auto relative group">
        <Link className="block w-full h-full" href={`article/${posts[currentIndex]?.slug}` || "/"}>
          <div className="w-full h-full bg-gradient-to-b from-[#3636344d] to-[#1b1b1a54] absolute z-[1]" />
          <Image
            className={`w-full h-full object-cover transition-opacity ease-in-out duration-300 my-auto absolute ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
            width={1920}
            height={1280}
            src={sanityImagesUrl[currentIndex]}
            alt={"Post Image"}
          />

          <h2 className={`absolute text-white translate-x-1/2 right-1/2 bottom-[100px] text-[32px] text-center leading-[36px] z-[2] w-[96%] md:w-auto transition-opacity ease-in-out duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {posts[currentIndex]?.title}
          </h2>
          <span className={`absolute text-white translate-x-1/2 right-1/2 bottom-[60px] text-[16px] text-center z-[2] w-[80%] line-clamp-2 transition-opacity ease-in-out duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {posts[currentIndex]?.body[0]?.children[0].text}
          </span>
        </Link>

        <div className="absolute left-1/2 bottom-5 transform -translate-x-1/2 flex items-center sm:space-x-4 z-[2]">
          <div className="px-4 text-white cursor-pointer">
            <ChevronLeft
              className="text-white hover:text-gray-400 transition-all"
              width={28}
              height={28}
              onClick={prevSlide}
            />
          </div>
          {indicators}
          <div className="px-4 text-white cursor-pointer">
            <ChevronRight
              className="text-white hover:text-gray-400 transition-all"
              width={28}
              height={28}
              onClick={nextSlide}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
