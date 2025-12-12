"use client";

import Link from "next/link";
import type { SanityDocument } from "next-sanity";
import PostFeed from "@/components/posts/PostFeed";
import { AdUnit } from "@/components/ui/Primitives";
import { formatDate, resolvePostPath } from "@/lib/utils";
import { AD_SIZES } from "@/lib/constants";

// --- Sidebar Component ---

interface SidebarProps {
    posts: SanityDocument[];
}

export default function Sidebar({ posts }: SidebarProps) {
    if (!posts || posts.length === 0) return null;

    const suggestionPosts = posts.slice(0, 4);
    const renderSuggestionFeed = () => (
        <PostFeed posts={suggestionPosts} columns={1} variant="list" showImage />
    );

    return (
        <aside className="w-full sticky top-2">
            <div className="w-full lg:px-6 py-2 border-t lg:border-0">
                {/* Ad Section */}
                <AdUnit className="mx-auto mt-5 z-10 mb-8" />

                {/* Related Articles */}
                <div className="mb-8">
                    <span className="text-lg   block mb-4 pb-2">Related Articles</span>
                    <div className="-mt-4 border-t-0">{renderSuggestionFeed()}</div>
                </div>

                {/* Trending Section */}
                <div>
                    <span className="text-lg   block mb-4 pb-2">Trending</span>
                    <div className="-mt-4 border-t-0">{renderSuggestionFeed()}</div>
                </div>
            </div>
        </aside>
    );
}

// --- Sidebar Widgets ---

export function SubscribeWidget() {
    return (
        <div className="w-full mb-10 border border-gray-200 p-6 rounded-sm bg-white">
            <h3 className="text-[20px]   font-prata text-gray-900 mb-4 text-center">
                Subscribe
            </h3>
            <p className="text-gray-600 text-sm text-center mb-6 font-graphiknormal">
                Get the latest news and updates directly in your inbox.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-500 bg-gray-50"
                />
                <button
                    type="submit"
                    className="w-full bg-theme-red text-white   text-sm uppercase py-3 rounded-sm hover:bg-[#a03b3c] transition-colors"
                >
                    I Want In
                </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <input type="checkbox" id="privacy" className="rounded-sm" />
                <label htmlFor="privacy">
                    I&apos;ve read and accept the <Link href="/privacy" className="text-theme-red hover:underline">Privacy Policy</Link>
                </label>
            </div>
        </div>
    );
}

export function PopularPostsWidget({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full mb-10">
            <div className="bg-theme-red text-white py-3 px-4 mb-6 rounded-t-sm">
                <h3 className="font-prata text-lg">Popular</h3>
            </div>
            <div className="flex flex-col gap-6">
                {posts.map((post, index) => {
                    // Only show top 4-5
                    if (index >= 5) return null;

                    return (
                        <div key={post._id} className="flex gap-4 group cursor-pointer">
                            <div className="shrink-0 w-[30px] pt-1">
                                <div className="w-[24px] h-[24px] bg-theme-red text-white flex items-center justify-center text-xs   rounded-sm">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="flex flex-col border-b border-gray-100 pb-4 w-full group-last:border-0">
                                <Link href={resolvePostPath(post)}>
                                    <h4 className="text-[15px]   font-prata text-gray-900 leading-snug mb-2 group-hover:text-theme-red transition-colors">
                                        {post.title}
                                    </h4>
                                </Link>
                                <span className="text-[11px] text-gray-500 font-graphiknormal">
                                    {formatDate(post.publishedAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function SidebarAdWidget() {
    return (
        <div className="mb-10">
            <AdUnit width={AD_SIZES.SIDEBAR.width} height={AD_SIZES.SIDEBAR.height} />
        </div>
    )
}
