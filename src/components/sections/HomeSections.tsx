'use client';
import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { getPostExcerpt, resolvePostPath, getPostImage, formatDate } from "@/lib/utils";
import { ChevronRight, ChevronLeft, CircleIcon } from "@/components/ui/Icons";
import { AdUnit } from "@/components/ui/Primitives";
import { useState, useEffect, useRef } from "react";
import { GRID_IMAGE_SIZES, HERO_IMAGE_SIZES, FEATURE_IMAGE_SIZES, AD_SIZES } from "@/lib/constants";
import PostFeed from "@/components/posts/PostFeed";
import { PostMeta } from "@/components/posts/PostMeta";
import { SectionHeader } from "@/components/sections/SectionHeader";

export function TopStory({ post }: { post: SanityDocument }) {
    if (!post) return null;
    const previewText = getPostExcerpt(post);

    return (
        <Link href={resolvePostPath(post)} className="w-full bg-white border-gray-200 rounded-sm overflow-hidden flex flex-col md:flex-row group cursor-pointer">
            <div className="w-full md:w-1/2 relative h-[250px] md:h-auto overflow-hidden block">
                <Image
                    src={getPostImage(post, 800, 500)}
                    alt={post.title || "Featured Story"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                    quality={65}
                    sizes={HERO_IMAGE_SIZES}
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs   px-2 py-1 rounded">
                    {post.categories?.[0]?.title || "Featured"}
                </div>
            </div>
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-2xl md:text-[28px]   font-prata text-gray-900 mb-3 leading-tight group-hover:text-theme-red transition-colors">
                    {post.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-graphiklight">
                    {previewText}
                </p>
                <div className="mt-auto">
                    <PostMeta author={post.author} publishedAt={post.publishedAt} />
                </div>
            </div>
        </Link>
    );
}

export function SidebarArticles({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="flex flex-col gap-6">
            <PostFeed
                posts={posts}
                variant="list"
                layout="horizontal"
                columns={1}
                showCategory
                imageWidth={100}
                imageHeight={100}
            />
        </div>
    );
}

export function SupportBanner() {
    return (
        <div className="w-full bg-theme-banner py-16 px-6 text-center text-white my-12">
            <div className="max-w-3xl mx-auto flex flex-col items-center">
                <h2 className="text-[26px] font-extrabold mb-6 font-prata">
                    Support Independent Music Journalism
                </h2>
                <p className="text-[18px] leading-relaxed mb-10 font-graphiknormal max-w-2xl">
                    The Music Bugle is committed to delivering quality music coverage without paywalls. Your support helps us remain independent and ad-light.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/support" className="bg-white text-[#111827] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors min-w-[250px]">
                        Support Independent Journalism
                    </Link>
                    <Link href="/support" className="bg-transparent border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors min-w-[250px]">
                        Support Monthly
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
            <div className="border-t-[3px] border-theme-border pt-4 mb-6 flex justify-between items-center">
                <h3 className="text-[24px]   font-prata text-black leading-none">
                    Latest News
                </h3>
                <Link href="/latest" className="flex items-center gap-2 group">
                    <span className="text-[13px] font-semibold font-graphiknormal text-theme-red group-hover:text-[#8f3536] transition-colors">
                        View All
                    </span>
                    <div className="w-4 h-4">
                        <ChevronRight className="w-full h-full" color="currentColor" />
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-10">
                {topPosts.map((post, index) => (
                    <Link key={post._id} href={resolvePostPath(post)} className="flex flex-col group cursor-pointer">
                        <div className="relative w-full aspect-3/2 mb-4 overflow-hidden rounded-sm block">
                            <Image
                                src={getPostImage(post, 400, 260)}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                loading={index === 0 ? "eager" : "lazy"}
                                quality={65}
                                sizes={GRID_IMAGE_SIZES}
                            />
                            {post.tags?.some((t: any) => t.title?.toLowerCase() === "exclusive") && (
                                <div className="absolute bottom-0 left-0 bg-theme-red text-white text-[10px]   px-2 py-1">
                                    Exclusive
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-[16px] leading-[1.4]   font-prata text-black mb-2 group-hover:text-theme-red transition-colors">
                                {post.title}
                            </h3>

                            <div className="flex items-center gap-2 text-[12px] font-medium font-graphiknormal text-black">
                                {post.author?.name && (
                                    <>
                                        <span className="text-gray-600 text-[12px] font-graphiklight">{post.author.name}</span>
                                        <span>-</span>
                                    </>
                                )}
                                <span className="text-gray-600 text-[12px] font-graphiklight">{formatDate(post.publishedAt)}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {bottomPosts.length > 0 && (
                <div className="mt-6">
                    <PostFeed
                        posts={bottomPosts}
                        variant="list"
                        layout="horizontal"
                        columns={4}
                        showCategory
                    />
                </div>
            )}
        </div>
    );
}

export function BottomSection({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    const mainPost = posts[0];
    const mainPostPreview = getPostExcerpt(mainPost);

    return (
        <div className="w-full mt-12 mb-12">
            <div className="w-full flex justify-center bg-theme-bg-light py-4 mb-8">
                <AdUnit width={AD_SIZES.LEADERBOARD.width} height={AD_SIZES.LEADERBOARD.height} className="mx-auto" />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <Link href={resolvePostPath(mainPost)} className="w-full block group">
                        <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-sm block">
                            <Image
                                src={getPostImage(mainPost, 800, 500)}
                                alt={mainPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                quality={65}
                                sizes={FEATURE_IMAGE_SIZES}
                            />
                            <div className="absolute top-4 left-4 bg-red-600 text-white text-xs   px-2 py-1 rounded">
                                {mainPost.categories?.[0]?.title || "Featured"}
                            </div>
                        </div>
                        <h3 className="text-2xl md:text-[28px]   font-prata text-gray-900 mb-3 leading-tight group-hover:text-theme-red transition-colors">
                            {mainPost.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-graphiklight">
                            {mainPostPreview}
                        </p>
                        <PostMeta author={mainPost.author} publishedAt={mainPost.publishedAt} />
                    </Link>
                </div>

                <div className="w-full lg:w-1/3 flex flex-col">
                    <PostFeed
                        posts={posts.slice(1, 6)}
                        variant="list"
                        layout="horizontal"
                        columns={1}
                        showAuthor={false}
                    />
                </div>
            </div>
        </div>
    );
}

export function MustReadSection({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full py-12 mb-12">
            <div className=" mx-auto">
                <SectionHeader title="Must Read" viewAllLink="/videos" className="border-b border-gray-200 pb-4" />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.slice(0, 2).map((post) => {
                            const imageUrl = getPostImage(post, 400, 260);
                            return (
                                <Link key={post._id} href={resolvePostPath(post)} className="flex flex-col group cursor-pointer">
                                    <div className="relative w-full aspect-3/2 mb-4 overflow-hidden rounded-sm block">
                                        <Image
                                            src={imageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            quality={65}
                                            sizes={GRID_IMAGE_SIZES}
                                        />
                                    </div>
                                    <h3 className="text-xl   font-prata text-black mb-2 group-hover:text-theme-red transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <div className="text-gray-600 text-xs">
                                        <PostMeta author={post.author} publishedAt={post.publishedAt} className="text-gray-600" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="w-full lg:w-1/3 flex flex-col gap-8">
                        {posts.slice(2, 4).map((post) => {
                            const previewText = getPostExcerpt(post);
                            return (
                                <Link key={post._id} href={resolvePostPath(post)} className="flex flex-col group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    <h3 className="text-xl   font-prata text-black mb-3 group-hover:text-theme-red transition-colors leading-tight">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-6 mb-3 font-graphiklight">
                                        {previewText}
                                    </p>
                                    <div className="mt-auto">
                                        <PostMeta author={post.author} publishedAt={post.publishedAt} className="text-gray-600 text-xs" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Carousel({ posts }: { posts: SanityDocument[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startTimer = () => {
        if (!posts.length) return;
        clearTimer();
        intervalRef.current = setInterval(() => setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length), 5000);
    };

    useEffect(() => {
        startTimer();
        return clearTimer;
    }, [posts.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        startTimer();
    };

    const prevSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
        startTimer();
    };

    const nextSlide = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
        startTimer();
    };

    if (!posts.length) return null;

    const currentPost = posts[currentIndex];
    const currentPreview = currentPost ? getPostExcerpt(currentPost) : "";

    return (
        <div className="w-full h-[300px] md:h-[450px] relative bg-theme-bg-dark group">
            <div className="w-full h-full relative overflow-hidden">
                <Link className="block w-full h-full" href={currentPost ? resolvePostPath(currentPost) : "/"}>
                    <div className="w-full h-full bg-linear-to-b from-transparent via-transparent to-black/80 absolute z-1" />
                    <Image
                        className="w-full h-full object-cover duration-500 absolute"
                        width={1200}
                        height={675}
                        quality={65}
                        src={getPostImage(currentPost, 1200)}
                        alt={currentPost?.title || "Post Image"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                        priority
                        fetchPriority="high"
                    />

                    <div className="absolute bottom-[30px] left-0 w-full z-2 px-6 md:px-10 flex justify-center">
                        <div className="max-w-full md:max-w-[90%] text-center">
                            <h2 className="text-white text-[24px] md:text-[28px]   leading-tight mb-2 drop-shadow-lg">
                                {currentPost?.title}
                            </h2>
                            <p className="text-white text-[14px] md:text-[16px] leading-relaxed opacity-90 line-clamp-2 drop-shadow-md hidden md:block mx-auto">
                                {currentPreview}
                            </p>
                        </div>
                    </div>
                </Link>

                <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10">
                    <button
                        onClick={prevSlide}
                        className="text-white hover:text-theme-red transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] hidden md:block"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-12 h-12" />
                    </button>
                </div>

                <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10">
                    <button
                        onClick={nextSlide}
                        className="text-white hover:text-theme-red transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] hidden md:block"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-12 h-12" />
                    </button>
                </div>

                <div className="absolute bottom-6 right-6 md:right-10 z-10 flex items-center gap-2">
                    {posts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className="p-1 focus:outline-none"
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <div
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "bg-white w-4"
                                        : "bg-white/40 hover:bg-white/70"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
