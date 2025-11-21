"use client";

import React from "react";
import { SanityDocument } from "next-sanity";
import PostList from "./PostList";
import AdUnit from "./AdUnit";

export default function Suggestions({ posts }: { posts: SanityDocument[] }) {
    if (!posts || posts.length === 0) return null;

    const suggestionPosts = posts.slice(0, 4);

    return (
        <div className="w-full lg:px-6 py-2 border-t lg:border-0">
            {/* Ad Section */}
            <AdUnit className="mx-auto mt-5 z-10 mb-8" />

            {/* Related Articles */}
            <div className="mb-8">
                <span className="text-lg font-bold block mb-4 pb-2">Related Articles</span>
                <div className="mt-[-1rem] border-t-0">
                    <PostList posts={suggestionPosts} columns={1} showImage={true} />
                </div>
            </div>

            {/* Trending Section */}
            <div>
                <span className="text-lg font-bold block mb-4 pb-2">Trending</span>
                <div className="mt-[-1rem] border-t-0">
                    <PostList posts={suggestionPosts} columns={1} showImage={true} />
                </div>
            </div>
        </div>
    );
}
