"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { formatDate } from "../../utils/formatDate";
import ChevronRight from "public/svgs/ChevronRight";
import { getPostImage } from "../utils/sanityHelpers";
import AdUnit from "./AdUnit";

// --- Shared Helpers ---
export function PostMeta({
    author,
    publishedAt,
    className = "text-gray-500",
    showAuthor = true
}: {
    author?: { name: string },
    publishedAt: string,
    className?: string,
    showAuthor?: boolean
}) {
    return (
        <div className={`text-[12px] font-medium ${className}`}>
            {showAuthor && author?.name ? (
                <>
                    By <span className="text-gray-900">{author.name}</span> |{" "}
                </>
            ) : null}
            {formatDate(publishedAt)}
        </div>
    );
}

// --- 1. Top Story ---
export function TopStory({ post }: { post: SanityDocument }) {
    if (!post) return null;

    const imageUrl = getPostImage(post, 800, 500);

    return (
        <div className="w-full bg-white border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 relative h-[250px] md:h-auto">
                <Image
                    src={imageUrl}
                    alt={post.title || "Featured Story"}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase rounded">
                    Music Release
                </div>
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                <Link href={`/article/${post.slug?.current || post.slug}`} className="hover:underline">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-gray-600 mb-4 text-sm md:text-base line-clamp-3">
                    {post.body?.[0]?.children?.[0]?.text || post.subtitle}
                </p>
                <div className="mt-auto">
                    <PostMeta author={post.author} publishedAt={post.publishedAt} />
                </div>
            </div>
        </div>
    );
}

// --- 2. Sidebar Ad ---
export function SidebarAd() {
    return (
        <AdUnit width="w-full" height="h-[250px]" className="mb-6 rounded-sm" />
    );
}

// --- 3. Sticky Ad ---
export function StickyAd() {
    return (
        <div className="sticky top-4">
            <AdUnit width="w-full" height="h-[460px]" />
        </div>
    );
}

// --- 4. Sidebar Articles ---
export function SidebarArticles({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            {posts.map((post) => {
                const imageUrl = getPostImage(post, 100, 100);

                return (
                    <div key={post._id} className="flex gap-4 items-start group cursor-pointer">
                        <div className="relative w-[124px] h-[80px] flex-shrink-0 overflow-hidden rounded-sm">
                            <Image
                                src={imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="flex flex-col">
                            <Link href={`/article/${post.slug?.current || post.slug}`} className="text-sm font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors line-clamp-3">
                                {post.title}
                            </Link>
                            {post.categories && post.categories.length > 0 && (
                                <span className="text-[10px] text-gray-500 mt-1 uppercase">{post.categories[0].title}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// --- 5. Section Header ---
interface SectionHeaderProps {
    title: string;
    viewAllLink?: string;
    className?: string;
}

export function SectionHeader({ title, viewAllLink, className = "" }: SectionHeaderProps) {
    return (
        <div className={`flex justify-between items-center mb-6 ${className}`}>
            <h2 className="text-[26px] font-medium text-black uppercase">{title}</h2>
            {viewAllLink && (
                <Link href={viewAllLink} className="flex items-center gap-2 text-[#B94445] hover:text-[#a03b3c] transition-colors">
                    <span className="text-[16px] font-medium">View All</span>
                    <div className="w-4 h-4">
                        <ChevronRight className="w-full h-full" stroke="#B94445" />
                    </div>
                </Link>
            )}
        </div>
    );
}

// --- 6. Support Banner ---
export function SupportBanner() {
    return (
        <div className="w-full bg-[#BB4242] py-16 px-6 text-center text-white my-12">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-[30px] font-bold mb-6 font-sans">
                    Support Independent Music Journalism
                </h2>
                <p className="text-[20px] leading-relaxed mb-10 font-normal font-sans max-w-2xl">
                    The Music Bugle is committed to delivering quality music coverage without paywalls. Your support helps us remain independent and ad-light.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/donate" className="bg-white text-[#111827] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors min-w-[250px]">
                        Make a One-time Donation
                    </Link>
                    <Link href="/support" className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors min-w-[250px]">
                        Become a Monthly Supporter
                    </Link>
                </div>
            </div>
        </div>
    );
}

