"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import CircleIcon from "../../public/svgs/CircleIcon.js";

import Image from "next/image";
import { SanityDocument } from "next-sanity";

import Link from "next/link";
import { getPostImage } from "../utils/sanityHelpers";
export const dynamic = "force-dynamic";

export default function Carousel({ posts }: { posts: SanityDocument[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sanityImagesUrl = posts.map((post) => getPostImage(post, 1200));

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sanityImagesUrl.length);
    }, 5000);
  }, [sanityImagesUrl.length]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      resetTimer();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [resetTimer]);

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
      className={`mx-1 cursor-pointer w-[8px] h-[8px] ${index === currentIndex ? "text-white" : "text-white/50"}`}
      onClick={() => goToSlide(index)}
    />
  ));

  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full h-[300px] md:h-[450px] relative bg-[#444444]">
      <div className="w-full h-full relative group overflow-hidden">
        <Link className="block w-full h-full" href={posts[currentIndex]?.slug ? `/article/${posts[currentIndex].slug}` : "/"}>
          <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/80 absolute z-[1]" />
          <Image
            className="w-full h-full object-cover duration-500 absolute"
            width={1200}
            height={675}
            src={sanityImagesUrl[currentIndex]}
            alt={posts[currentIndex]?.title || "Post Image"}
            priority
          />

          <div className="absolute bottom-[30px] left-0 w-full z-[2] px-6 md:px-10">
            <div className="max-w-full md:max-w-[90%]">
              <h2 className="text-white text-[24px] md:text-[36px] font-bold leading-tight mb-2 drop-shadow-lg">
                {posts[currentIndex]?.title}
              </h2>
              <p className="text-white text-[14px] md:text-[16px] leading-relaxed opacity-90 line-clamp-2 drop-shadow-md hidden md:block">
                {posts[currentIndex]?.body?.[0]?.children?.[0]?.text || posts[currentIndex]?.subtitle}
              </p>
            </div>
          </div>
        </Link>

        <div className="absolute bottom-6 right-6 md:right-10 z-[2] flex items-center gap-2">
          {indicators}
        </div>
      </div>
    </div>
  );
}
