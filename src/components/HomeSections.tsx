import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { formatDate } from "../../utils/formatDate";
import ChevronRight from "public/svgs/ChevronRight";
import { getPostImage } from "../utils/sanityHelpers";
import AdUnit from "./AdUnit";

export function PostMeta({
    author,
    publishedAt,
    className = "text-gray-800",
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
                    By <span className="text-gray-900 text-[14px]">{author.name}</span> |{" "}
                </>
            ) : null}
            {formatDate(publishedAt)}
        </div>
    );
}

export function TopStory({ post }: { post: SanityDocument }) {
    if (!post) return null;

    const imageUrl = getPostImage(post, 800, 500);

    return (
        <div className="w-full bg-white border-gray-200 rounded-sm overflow-hidden flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 relative h-[250px] md:h-auto">
                <Image
                    src={imageUrl}
                    alt={post.title || "Featured Story"}
                    fill
                    className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {post.categories?.[0]?.title || "Featured"}
                </div>
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                <Link href={`/article/${post.slug?.current || post.slug}`} className="hover:text-[#B94445] transition-colors">
                    <h3 className="text-2xl md:text-[28px] font-bold font-prata text-gray-900 mb-3 leading-tight hover:text-[#B94445] transition-colors">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {post.body?.[0]?.children?.[0]?.text || post.subtitle}
                </p>
                <div className="mt-auto">
                    <PostMeta author={post.author} publishedAt={post.publishedAt} />
                </div>
            </div>
        </div>
    );
}

export function SidebarAd() {
    return (
        <AdUnit width="w-full" height="h-[250px]" className="mb-6 rounded-sm" />
    );
}

export function StickyAd() {
    return (
        <div className="sticky top-4">
            <AdUnit width="w-full" height="h-[600px]" />
        </div>
    );
}

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
                            <Link href={`/article/${post.slug?.current || post.slug}`} className="font-prata text-sm font-bold text-gray-900 leading-snug hover:text-[#B94445] transition-colors line-clamp-3">
                                {post.title}
                            </Link>
                            {post.categories && post.categories.length > 0 && (
                                <span className="text-[10px] text-gray-500 mt-1">{post.categories[0].title}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface SectionHeaderProps {
    title: string;
    viewAllLink?: string;
    className?: string;
}

export function SectionHeader({ title, viewAllLink, className = "" }: SectionHeaderProps) {
    return (
        <div className={`flex justify-between items-center mb-6 ${className}`}>
            <h2 className="text-[26px] font-medium font-prata text-black">{title}</h2>
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

export function SupportBanner() {
    return (
        <div className="w-full bg-[#BB4242] py-16 px-6 text-center text-white my-12">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-[26px] font-[800] mb-6 font-prata">
                    Support Independent Music Journalism
                </h2>
                <p className="text-[18px] leading-relaxed mb-10 font-graphiknormal max-w-2xl">
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

export function LatestPosts({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    const topPosts = posts.slice(0, 4);
    const bottomPosts = posts.slice(4);

    return (
        <div className="w-full mt-12">
            {/* Header with Red Top Border */}
            <div className="border-t-[3px] border-[#EC3535] pt-4 mb-6 flex justify-between items-center">
                <h3 className="text-[24px] font-bold font-prata text-black leading-none">
                    Latest News
                </h3>
                <Link href="/latest" className="flex items-center gap-2 group">
                    <span className="text-[13px] font-semibold font-graphikmedium text-[#EC3535]">
                        View All
                    </span>
                    <div className="w-4 h-4">
                        <ChevronRight className="w-full h-full" stroke="#EC3535" />
                    </div>
                </Link>
            </div>

            {/* Top Grid (Vertical Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-10">
                {topPosts.map((post, index) => {
                    const imageUrl = getPostImage(post, 400, 260);
                    const isExclusive = post.tags?.some((t: any) => t.title?.toLowerCase() === 'exclusive');

                    return (
                        <div key={post._id} className="flex flex-col group cursor-pointer">
                            <div className="relative w-full aspect-[3/2] mb-4 overflow-hidden rounded-sm">
                                <Image
                                    src={imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading={index === 0 ? "eager" : undefined}
                                />
                                {isExclusive && (
                                    <div className="absolute bottom-0 left-0 bg-[#EC3535] text-white text-[10px] font-bold px-2 py-1">
                                        Exclusive
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Link href={`/article/${post.slug?.current || post.slug}`}>
                                    <h3 className="text-[16px] leading-[1.4] font-bold font-prata text-black mb-2 group-hover:text-[#EC3535] transition-colors">
                                        {post.title}
                                    </h3>
                                </Link>

                                <div className="flex items-center gap-2 text-[13px] font-medium font-graphiknormal text-black">
                                    {post.author?.name && (
                                        <>
                                            <span>{post.author.name}</span>
                                            <span>-</span>
                                        </>
                                    )}
                                    <span className="text-gray-500">{formatDate(post.publishedAt)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Grid (Horizontal Cards) */}
            {bottomPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                    {bottomPosts.map((post) => {
                        const imageUrl = getPostImage(post, 124, 80);

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
                                    <Link href={`/article/${post.slug?.current || post.slug}`} className="font-prata text-sm font-bold text-gray-900 leading-snug hover:text-[#B94445] transition-colors line-clamp-3">
                                        {post.title}
                                    </Link>
                                    {post.categories && post.categories.length > 0 && (
                                        <span className="text-[10px] text-gray-500 mt-1">{post.categories[0].title}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function BottomSection({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    const mainPost = posts[0];
    const sidePosts = posts.slice(1, 6);

    const mainImageUrl = getPostImage(mainPost, 800, 500);

    return (
        <div className="w-full mt-12 mb-12">
            {/* Ad Unit - Full Width Row */}
            <div className="w-full flex justify-center bg-[#F2F2F2] py-4 mb-8">
                <AdUnit width="w-[728px]" height="h-[90px]" className="mx-auto" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Main Story */}
                <div className="w-full lg:w-2/3">
                    <div className="w-full">
                        <div className="relative w-full aspect-[16/9] mb-4 overflow-hidden rounded-sm">
                            <Image
                                src={mainImageUrl}
                                alt={mainPost.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                {mainPost.categories?.[0]?.title || "Featured"}
                            </div>
                        </div>
                        <Link href={`/article/${mainPost.slug?.current || mainPost.slug}`} className="">
                            <h3 className="text-2xl md:text-[28px] font-bold font-prata text-gray-900 mb-3 leading-tight hover:text-[#B94445] transition-colors">
                                {mainPost.title}
                            </h3>
                        </Link>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                            {mainPost.body?.[0]?.children?.[0]?.text || mainPost.subtitle}
                        </p>
                        <PostMeta author={mainPost.author} publishedAt={mainPost.publishedAt} />
                    </div>
                </div>

                {/* Right Column: List of 5 Articles */}
                <div className="w-full lg:w-1/3 flex flex-col gap-[2.2rem]">
                    {sidePosts.map((post) => {
                        const imageUrl = getPostImage(post, 124, 80);
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
                                    <Link href={`/article/${post.slug?.current || post.slug}`} className="font-prata text-sm font-bold text-gray-900 leading-snug hover:text-[#B94445] transition-colors line-clamp-3">
                                        {post.title}
                                    </Link>
                                    <div className="mt-1">
                                        <PostMeta publishedAt={post.publishedAt} showAuthor={false} className="text-gray-400 text-[11px]" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function VideoSection({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    const leftPosts = posts.slice(0, 2);
    const rightPosts = posts.slice(2, 4);

    return (
        <div className="w-full py-12 mb-12">
            <div className=" mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <h2 className="text-[24px] font-bold font-prata text-black">Must Watch</h2>
                    <Link href="/videos" className="flex items-center gap-2 group">
                        <span className="text-[13px] font-semibold font-graphikmedium text-[#EC3535]">
                            View All
                        </span>
                        <div className="w-4 h-4">
                            <ChevronRight className="w-full h-full" stroke="#EC3535" />
                        </div>
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: 2 Articles Side-by-Side */}
                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {leftPosts.map((post) => {
                            const imageUrl = getPostImage(post, 400, 260);
                            return (
                                <div key={post._id} className="flex flex-col group cursor-pointer">
                                    <div className="relative w-full aspect-[3/2] mb-4 overflow-hidden rounded-sm">
                                        <Image
                                            src={imageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                    </div>
                                    <Link href={`/article/${post.slug?.current || post.slug}`}>
                                        <h3 className="text-xl font-bold font-prata text-black mb-2 hover:text-[#EC3535] transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <div className="text-gray-500 text-xs">
                                        <PostMeta author={post.author} publishedAt={post.publishedAt} className="text-gray-500" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: 2 Articles Stacked (Text Heavy) */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-8">
                        {rightPosts.map((post) => (
                            <div key={post._id} className="flex flex-col group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <Link href={`/article/${post.slug?.current || post.slug}`}>
                                    <h3 className="text-xl font-bold font-prata text-black mb-3 hover:text-[#EC3535] transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-6 mb-3">
                                    {post.body?.[6]?.children?.[0]?.text || post.subtitle}
                                </p>
                                <div className="mt-auto">
                                    <PostMeta author={post.author} publishedAt={post.publishedAt} className="text-gray-400 text-xs" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
