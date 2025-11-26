"use client";

import React from "react";
import type { SanityDocument } from "next-sanity";
import FeedPostRow from "./FeedPostRow";
import { PopularPostsWidget, SidebarAdWidget } from "./SidebarWidgets";
import Nav from "./Nav";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer"), {
    ssr: false,
    loading: () => (
        <div className="w-full py-12 text-center text-xs text-gray-400">
            Loading footer…
        </div>
    ),
});

interface FeedLayoutProps {
    title: string;
    description?: string;
    mainPosts: SanityDocument[];
    popularPosts: SanityDocument[];
    allPostsForFooter?: SanityDocument[]; // Optional pass-through for footer
}

export default function FeedLayout({
    title,
    description,
    mainPosts,
    popularPosts,
    allPostsForFooter = []
}: FeedLayoutProps) {

    // Split mainPosts: First one is "Featured/Exclusive" (Big), rest are standard rows
    const featuredPost = mainPosts.length > 0 ? mainPosts[0] : null;
    const feedPosts = mainPosts.length > 0 ? mainPosts.slice(1) : [];

    return (
        <main className="bg-white min-h-screen">
            <Nav />

            <div className="w-full mx-auto px-6 py-8 xl:px-32 2xl:px-64 max-w-[1600px]">

                {/* Page Header */}
                <div className="mb-12 border-b border-gray-200 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-[#B94445] text-xs font-bold uppercase tracking-widest mb-2 block">
                                Category
                            </span>
                            <h1 className="text-4xl md:text-5xl font-abrilFatface text-gray-900">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-gray-600 mt-3 max-w-2xl font-graphiknormal text-lg">
                                    {description}
                                </p>
                            )}
                        </div>
                        {/* Optional: Sub-navigation could go here */}
                        {/* <div className="flex gap-4 text-sm font-medium text-gray-500">
                <span>Subcategory 1</span>
                <span>Subcategory 2</span>
            </div> */}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Main Content Column (Left, ~2/3) */}
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

                        {/* Pagination placeholder */}
                        {/* <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center">
                <button className="text-gray-400 cursor-not-allowed">Previous</button>
                <span className="font-medium">Page 1 of 1</span>
                <button className="text-gray-900 hover:text-[#B94445]">Next</button>
             </div> */}
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

            <Footer posts={allPostsForFooter} />
        </main>
    );
}

