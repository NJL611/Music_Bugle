"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { PostMeta } from "./HomeSections";
import { getPostImage } from "../utils/sanityHelpers";

interface PostListProps {
  posts: SanityDocument[];
  columns?: 1 | 2 | 3;
  showImage?: boolean;
}

export default function PostList({ posts, columns = 3, showImage = false }: PostListProps) {
  if (!posts || posts.length === 0) return null;

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-x-6 gap-y-6 border-t border-gray-200 pt-8`}>
      {posts.map((post) => {
        const imageUrl = showImage ? getPostImage(post, 300, 200) : null;

        return (
          <div key={post._id} className="flex flex-col border-gray-100 last:border-0">
            <Link href={`/article/${post.slug?.current || post.slug}`} className="group">
              {showImage && imageUrl && (
                <div className="relative w-full aspect-[16/10] mb-3 overflow-hidden rounded-sm">
                  <Image
                    src={imageUrl}
                    alt={post.title || "Post Image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <h4 className="text-[16px] leading-[20px] font-bold text-black font-serif group-hover:text-[#B94445] transition-colors line-clamp-2 mb-2">
                {post.title}
              </h4>
            </Link>
            <PostMeta
              publishedAt={post.publishedAt}
              className="text-gray-400"
              showAuthor={false}
            />
          </div>
        );
      })}
    </div>
  );
}
