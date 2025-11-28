"use client";

import dynamic from "next/dynamic";
import type { SanityDocument } from "next-sanity";
import { FeedPostRow } from "@/components/posts/PostFeed";
import { PopularPostsWidget, SidebarAdWidget } from "@/components/layout/Sidebar";
import Nav from "@/components/layout/Nav";

const Footer = dynamic(() => import("@/components/layout/Footer"), {
    ssr: false,
    loading: () => (
        <div className="w-full py-12 text-center text-xs text-gray-400" />
    ),
});

interface FeedLayoutProps {
    title: string;
    description?: string;
    mainPosts: SanityDocument[];
    popularPosts: SanityDocument[];
    allPostsForFooter?: SanityDocument[];
    categoryLabel?: string; // Added to customize the small label above title
}

export default function FeedLayout({
    title,
    description,
    mainPosts,
    popularPosts,
    allPostsForFooter,
    categoryLabel = "Category"
}: FeedLayoutProps) {

    const featuredPost = mainPosts.length > 0 ? mainPosts[0] : null;
    const feedPosts = mainPosts.length > 0 ? mainPosts.slice(1) : [];
    const footerPosts = allPostsForFooter && allPostsForFooter.length > 0 ? allPostsForFooter : popularPosts;

    return (
        <main className="bg-white min-h-screen">
            <Nav />

            <div className="w-full mx-auto px-6 py-8 xl:px-32 2xl:px-64 max-w-[1600px]">

                <div className="mb-12 border-b border-gray-200 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-theme-red text-xs uppercase tracking-widest mb-2 block">
                                {categoryLabel}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-abril text-gray-900">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-gray-600 mt-3 max-w-2xl font-graphiknormal text-lg">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    <div className="w-full lg:w-[65%]">

                        {/* Featured Post (Top) */}
                        {featuredPost && (
                            <div className="mb-12 pb-12 border-b border-gray-200">
                                <FeedPostRow post={featuredPost} />
                            </div>
                        )}

                        {/* Feed List */}
                        <div className="flex flex-col gap-10">
                            {feedPosts.map((post) => (
                                <FeedPostRow key={post._id} post={post} />
                            ))}

                            {feedPosts.length === 0 && !featuredPost && (
                                <div className="py-12 text-center text-gray-500">
                                    No articles found in this section.
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar Column (Right, ~1/3) */}
                    <div className="w-full lg:w-[35%] pl-0 lg:pl-8 flex flex-col gap-10 border-l-0 lg:border-l border-transparent lg:border-gray-100">

                        {/* Advertisement */}
                        <SidebarAdWidget />

                        {/* Popular Posts */}
                        <PopularPostsWidget posts={popularPosts} />


                    </div>

                </div>
            </div>

            <Footer posts={footerPosts} />
        </main>
    );
}

