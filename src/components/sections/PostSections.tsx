'use client';
import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { DiscussionEmbed } from 'disqus-react';
import { getPostImage, formatDate, resolvePostPath } from "@/lib/utils";

export function CategoryFeatureGrid({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 w-[85%] mx-auto">
            {posts.map((post) => {
                const imageUrl = getPostImage(post, 400, 500);
                const category = post.categories?.[0];
                const isExclusive = post.tags?.some((t: any) => t.title?.toLowerCase() === "exclusive");

                return (
                    <Link key={post._id} href={resolvePostPath(post)} className="group block relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                        <Image
                            src={imageUrl}
                            alt={post.title || "Article Image"}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="eager"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 w-full p-5 flex flex-col items-start">
                            <div className="flex gap-2 mb-3">
                                {category && (
                                    <span className="bg-theme-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
                                        {category.title}
                                    </span>
                                )}
                                {isExclusive && (
                                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wide">
                                        Exclusive
                                    </span>
                                )}
                            </div>

                            <h3 className="text-white font-prata text-xl leading-tight group-hover:text-gray-200 transition-colors line-clamp-3">
                                {post.title}
                            </h3>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

interface MoreLikeThisProps {
    posts: SanityDocument[];
    currentPostId: string;
    limit?: number;
}

export function MoreLikeThis({ posts, currentPostId, limit = 4 }: MoreLikeThisProps) {
    const relatedPosts = posts
        .filter((p) => p._id !== currentPostId)
        .slice(0, limit);

    if (relatedPosts.length === 0) return null;

    return (
        <section className="w-full mt-12 pt-8">
            <div className="flex items-center justify-center mb-8">
                <h2 className="text-2xl   font-prata">More like this</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPosts.map((post) => {
                    const imageUrl = getPostImage(post, 400, 300);

                    return (
                        <div key={post._id} className="flex flex-col group">
                            <Link href={resolvePostPath(post)} className="block">
                                {imageUrl ? (
                                    <div className="relative w-full aspect-4/3 mb-3 overflow-hidden bg-gray-100">
                                        <Image
                                            src={imageUrl}
                                            alt={post.title || "Article Image"}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full aspect-4/3 mb-3 bg-gray-200 flex items-center justify-center text-gray-400">
                                        <span className="text-xs">No Image</span>
                                    </div>
                                )}

                                <div className="mt-2">
                                    <h3 className="text-lg leading-tight text-gray-900 mb-2 font-prata group-hover:text-theme-red decoration-2 decoration-gray-300 underline-offset-4">
                                        {post.title}
                                    </h3>

                                    <div className="flex items-center text-[10px] text-gray-600 font-graphiklight uppercase tracking-wide">
                                        <span className="text-[11px] font-graphiklight">{post.author?.name || "The Music Bugle"}</span>
                                        {post.publishedAt && (
                                            <>
                                                <span className="mx-1 text-[8px]">•</span>
                                                <span className="text-[11px]">{formatDate(post.publishedAt)}</span>
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

// --- Disqus Section ---
export function Disqus({ post }: { post: any }) {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <DiscussionEmbed
            shortname='music-bugle'
            config={{
                url: pageUrl,
                identifier: post.slug,
                title: post.title,
                language: 'en'
            }}
        />
    );
}

