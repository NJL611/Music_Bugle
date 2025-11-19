"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { SectionHeader, PostMeta } from "./HomeSections";
import { getPostImage } from "../utils/sanityHelpers";

interface PostGridProps {
    posts: SanityDocument[];
    title?: string;
    viewAllLink?: string;
    columns?: 3 | 4 | 5; // Restrict to common grid sizes for simplicity
}

export default function PostGrid({
    posts,
    title,
    viewAllLink,
    columns = 4
}: PostGridProps) {
    if (!posts || posts.length === 0) return null;

    const gridColsClass = {
        3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    }[columns];

    return (
        <div className="w-full mt-12">
            {title && (
                <SectionHeader title={title} viewAllLink={viewAllLink} />
            )}

            <div className={`grid ${gridColsClass} gap-6`}>
                {posts.map((post) => {
                    const imageUrl = getPostImage(post, 400, 250);

                    return (
                        <div key={post._id} className="flex flex-col group cursor-pointer">
                            <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-sm">
                                <Image
                                    src={imageUrl}
                                    alt={post.title || "Post Image"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="flex flex-col">
                                <Link href={`/article/${post.slug?.current || post.slug}`}>
                                    <h3 className="text-[18px] leading-[22px] font-bold text-black mb-2 font-prata line-clamp-3 hover:text-[#B94445] transition-colors">
                                        {post.title}
                                    </h3>
                                </Link>

                                <PostMeta
                                    author={post.author}
                                    publishedAt={post.publishedAt}
                                    className="text-gray-500"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

