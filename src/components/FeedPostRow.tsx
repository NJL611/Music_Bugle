"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { getPostImage } from "../utils/sanityHelpers";
import { formatDate } from "../../utils/formatDate";

interface FeedPostRowProps {
    post: SanityDocument;
}

export default function FeedPostRow({ post }: FeedPostRowProps) {
    if (!post) return null;

    // Format: Image on left (mobile: top), Content on right (mobile: bottom)
    // Image size: roughly 260x175 px on desktop
    const imageUrl = getPostImage(post, 400, 270);
    const category = post.categories?.[0];
    const author = post.author;

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8 group">
            {/* Image */}
            <div className="w-full md:w-[260px] flex-shrink-0">
                <Link href={`/article/${post.slug?.current || post.slug}`}>
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm">
                        <Image
                            src={imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </Link>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center flex-grow">
                {/* Category Label */}
                {category && (
                    <Link
                        href={`/category/${category.slug}`}
                        className="text-[#B94445] text-[11px] font-bold uppercase tracking-wider mb-2 hover:underline"
                    >
                        {category.title}
                    </Link>
                )}

                {/* Title */}
                <Link href={`/article/${post.slug?.current || post.slug}`}>
                    <h2 className="text-[22px] md:text-[24px] font-bold font-prata text-gray-900 leading-tight mb-3 group-hover:text-[#B94445] transition-colors">
                        {post.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                <p className="text-gray-600 text-[15px] leading-relaxed mb-3 font-graphiknormal line-clamp-2 md:line-clamp-3">
                    {post.subtitle || post.body?.[0]?.children?.[0]?.text || "No description available."}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-[12px] font-medium text-gray-500 font-graphiknormal">
                    {author && (
                        <div className="flex items-center gap-2">
                            {/* Optional: Author Image could go here */}
                            <span className="text-black">{author.name}</span>
                            <span>—</span>
                        </div>
                    )}
                    <span>{formatDate(post.publishedAt)}</span>
                </div>
            </div>
        </div>
    );
}

