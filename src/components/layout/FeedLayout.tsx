"use client";

import dynamic from "next/dynamic";
import type { SanityDocument } from "next-sanity";
import { FeedPostRow } from "@/components/posts/PostFeed";
import { PopularPostsWidget, SidebarAdWidget } from "@/components/layout/Sidebar";
import Nav from "@/components/layout/Nav";
import { CategoryFeatureGrid } from "@/components/sections/PostSections";

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

    const featuredGridPosts = mainPosts.slice(0, 4);
    const feedPosts = mainPosts.slice(4);
    const footerPosts = allPostsForFooter && allPostsForFooter.length > 0 ? allPostsForFooter : popularPosts;

    return (
        <main className="bg-white min-h-screen">
            <Nav />

            <div className="w-full mx-auto px-8 py-6 2xl:px-64">

                <div className="mb-12 border-b border-gray-200 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>

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

                <CategoryFeatureGrid posts={featuredGridPosts} />

                <div className="flex flex-col lg:flex-row gap-8">

                    <div className="w-full lg:w-2/3">

                        {/* Feed List */}
                        <div className="flex flex-col gap-10">
                            {feedPosts.map((post) => (
                                <FeedPostRow key={post._id} post={post} />
                            ))}

                            {feedPosts.length === 0 && featuredGridPosts.length === 0 && (
                                <div className="py-12 text-center text-gray-500">
                                    No articles found in this section.
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar Column (Right, ~1/3) */}
                    <div className="w-full lg:w-[31%] flex flex-col gap-8">

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

