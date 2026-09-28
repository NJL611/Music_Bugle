// Homepage section components, composed by src/app/page.tsx (both the full and showcase layouts).
// LeadStories + SidebarArticles render above the fold; page.tsx lazy-loads the rest via next/dynamic.
'use client';
import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { getPostExcerpt, resolvePostPath, getPostImage, getPostImageOrFallback, formatDate } from "@/lib/utils";
import { AdUnit } from "@/components/ui/AdUnit";
import { GRID_IMAGE_SIZES, HERO_IMAGE_SIZES, FEATURE_IMAGE_SIZES } from "@/lib/constants";
import PostFeed from "@/components/posts/PostFeed";
import { PostMeta } from "@/components/posts/PostMeta";
import { SectionHeader } from "@/components/sections/SectionHeader";

function Eyebrow({ post }: { post: SanityDocument }) {
    const title = post.categories?.[0]?.title;
    if (!title) return null;
    return <span className="text-theme-red text-[11px] uppercase tracking-widest font-graphiknormal mb-2">{title}</span>;
}

// One committed lead + two secondaries (Ghost-style); replaced an auto-rotating carousel that failed WCAG 2.2.2.
export function LeadStories({ lead, secondary, headlines = [] }: { lead: SanityDocument | null; secondary: SanityDocument[]; headlines?: SanityDocument[] }) {
    if (!lead) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
            {/* Fixed secondary column so narrowing the window shrinks the lead, not the stacked stories. */}
            <div className="md:col-span-2 lg:col-span-1 flex flex-col">
            <Link href={resolvePostPath(lead)} className="flex flex-col group">
                {/* 21:9 on desktop keeps the lead + the headline row below it above the fold at ~870px-tall viewports. */}
                <div className="relative w-full aspect-video lg:aspect-[21/9] mb-3 overflow-hidden rounded-sm">
                    <Image
                        src={getPostImageOrFallback(lead, 1200, 675)}
                        alt={lead.title || "Lead story"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority
                        fetchPriority="high"
                        quality={70}
                        sizes={HERO_IMAGE_SIZES}
                    />
                </div>
                <Eyebrow post={lead} />
                <h2 className="text-[26px] md:text-[32px] font-prata text-gray-900 leading-[1.15] mb-2 group-hover:text-theme-red transition-colors">
                    {lead.title}
                </h2>
                <p className="text-gray-600 mb-3 text-[15px] leading-relaxed line-clamp-2 font-graphiknormal">
                    {getPostExcerpt(lead)}
                </p>
                <PostMeta author={lead.author} publishedAt={lead.publishedAt} />
            </Link>
            {/* Fills the gap left by the taller secondary column. */}
            {headlines.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {headlines.map((post) => (
                        <Link key={post._id} href={resolvePostPath(post)} className="flex flex-col group">
                            <div className="relative w-full aspect-video lg:aspect-[2/1] mb-2 overflow-hidden rounded-sm">
                                <Image
                                    src={getPostImageOrFallback(post, 600, 338)}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    quality={65}
                                    sizes={GRID_IMAGE_SIZES}
                                />
                            </div>
                            <h3 className="text-[15px] leading-snug font-prata text-gray-900 mb-1 line-clamp-2 group-hover:text-theme-red transition-colors">
                                {post.title}
                            </h3>
                            <PostMeta author={post.author} publishedAt={post.publishedAt} showAuthor={false} />
                        </Link>
                    ))}
                </div>
            )}
            </div>

            <div className="flex flex-col gap-4 md:border-l md:border-gray-200 md:pl-8">
                {secondary.map((post) => (
                    <Link key={post._id} href={resolvePostPath(post)} className="flex flex-col group border-t border-gray-200 pt-4 md:border-0 md:pt-0">
                        {/* Wide crop so all three stacked stories fit above the fold beside the lead. */}
                        <div className="relative w-full aspect-video lg:aspect-[2/1] mb-2 overflow-hidden rounded-sm">
                            <Image
                                src={getPostImageOrFallback(post, 600, 338)}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                quality={65}
                                sizes={GRID_IMAGE_SIZES}
                            />
                        </div>
                        <Eyebrow post={post} />
                        <h3 className="text-[16px] leading-snug font-prata text-gray-900 mb-1 line-clamp-2 group-hover:text-theme-red transition-colors">
                            {post.title}
                        </h3>
                        <PostMeta author={post.author} publishedAt={post.publishedAt} showAuthor={false} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export function SidebarArticles({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <ol className="flex flex-col divide-y divide-gray-200">
            {posts.map((post) => {
                const imageUrl = getPostImage(post, 144, 144);
                return (
                    <li key={post._id}>
                        <Link href={resolvePostPath(post)} className="flex gap-4 py-4 group">
                            <div className="flex flex-col grow">
                                <span className="font-prata text-[15px] text-gray-900 leading-snug line-clamp-3 group-hover:text-theme-red transition-colors">
                                    {post.title}
                                </span>
                                {post.publishedAt ? (
                                    <time dateTime={post.publishedAt} className="text-gray-600 text-[12px] mt-1 font-graphiknormal">
                                        {formatDate(post.publishedAt)}
                                    </time>
                                ) : null}
                            </div>
                            {imageUrl && (
                                <div className="relative w-[72px] h-[72px] shrink-0 overflow-hidden rounded-sm">
                                    <Image src={imageUrl} alt="" fill className="object-cover" quality={65} sizes="72px" />
                                </div>
                            )}
                        </Link>
                    </li>
                );
            })}
        </ol>
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
                    The Music Bugle is committed to delivering quality music coverage without paywalls. Your support keeps us independent.
                </p>

                <Link href="/support" className="bg-white text-[#111827] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
                    Support The Music Bugle
                </Link>
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
            <SectionHeader title="Latest News" viewAllLink="/category/news" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-10">
                {topPosts.map((post, index) => (
                    <Link key={post._id} href={resolvePostPath(post)} className="flex flex-col group cursor-pointer">
                        <div className="relative w-full aspect-3/2 mb-4 overflow-hidden rounded-sm block">
                            <Image
                                src={getPostImageOrFallback(post, 400, 260)}
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
                                {post.publishedAt ? (
                                    <time dateTime={post.publishedAt} className="text-gray-600 text-[12px] font-graphiklight">
                                        {formatDate(post.publishedAt)}
                                    </time>
                                ) : null}
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

export function BottomSection({
    posts,
    title,
    viewAllLink,
}: {
    posts: SanityDocument[];
    title: string;
    viewAllLink: string;
}) {
    if (!posts || posts.length === 0) return null;

    const mainPost = posts[0];
    const mainPostPreview = getPostExcerpt(mainPost);

    return (
        <div className="w-full mt-12 mb-12">
            <AdUnit width="w-[320px] md:w-[728px]" height="h-[50px] md:h-[90px]" className="mx-auto" />
            <SectionHeader
                title={title}
                viewAllLink={viewAllLink}
                className="mt-8"
            />

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                <div className="w-full lg:w-2/3">
                    <Link href={resolvePostPath(mainPost)} className="w-full block group">
                        <div className="relative w-full aspect-video mb-4 overflow-hidden rounded-sm block">
                            <Image
                                src={getPostImageOrFallback(mainPost, 800, 500)}
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

export function MustReadSection({ posts, viewAllLink }: { posts: SanityDocument[]; viewAllLink: string }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full py-12 mb-12">
            <div className=" mx-auto">
                <SectionHeader title="Must Read" viewAllLink={viewAllLink} />

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.slice(0, 2).map((post) => {
                            const imageUrl = getPostImageOrFallback(post, 400, 260);
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
                                <Link key={post._id} href={resolvePostPath(post)} className="flex gap-4 group cursor-pointer border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                    {/* Thumbnail beside the text, not above it, so this column stays level with the two cards on the left. */}
                                    <div className="relative w-[120px] aspect-3/2 shrink-0 overflow-hidden rounded-sm">
                                        <Image
                                            src={getPostImageOrFallback(post, 240, 160)}
                                            alt=""
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                            quality={65}
                                            sizes="120px"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h3 className="text-xl   font-prata text-black mb-3 group-hover:text-theme-red transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3 font-graphiklight">
                                            {previewText}
                                        </p>
                                        <div className="mt-auto">
                                            <PostMeta author={post.author} publishedAt={post.publishedAt} className="text-gray-600 text-xs" />
                                        </div>
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
