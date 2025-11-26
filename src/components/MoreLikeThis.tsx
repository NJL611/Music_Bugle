import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { getPostImage } from "../utils/sanityHelpers";
import { formatDate } from "../../utils/formatDate";

interface MoreLikeThisProps {
    posts: SanityDocument[];
    currentPostId: string;
    limit?: number;
}

export default function MoreLikeThis({ posts, currentPostId, limit = 4 }: MoreLikeThisProps) {
    // Filter out the current post and limit the number of suggestions
    const relatedPosts = posts
        .filter((p) => p._id !== currentPostId)
        .slice(0, limit);

    if (relatedPosts.length === 0) return null;

    return (
        <section className="w-full mt-12 pt-8">
            <div className="flex items-center justify-center mb-8">
                <h2 className="text-2xl font-bold font-prata">More like this</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((post) => {
                    const imageUrl = getPostImage(post, 400, 300);

                    return (
                        <div key={post._id} className="flex flex-col group">
                            <Link href={`/article/${post.slug?.current || post.slug}`} className="block">
                                {imageUrl ? (
                                    <div className="relative w-full aspect-[4/3] mb-3 overflow-hidden bg-gray-100">
                                        <Image
                                            src={imageUrl}
                                            alt={post.title || "Article Image"}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full aspect-[4/3] mb-3 bg-gray-200 flex items-center justify-center text-gray-400">
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}

                                <div className="mt-2">

                                    <h3 className="text-lg leading-tight font-bold text-gray-900 mb-2 font-prata group-hover:underline decoration-2 decoration-gray-300 underline-offset-4">
                                        {post.title}
                                    </h3>

                                    <div className="flex items-center text-[10px] text-gray-500 font-graphiklight uppercase tracking-wide">
                                        <span className="text-[13px]">{post.author?.name || "The Music Bugle"}</span>
                                        {post.publishedAt && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span className="text-[10px]">{formatDate(post.publishedAt)}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

