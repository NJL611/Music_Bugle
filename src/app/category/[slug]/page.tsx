import React from "react";
import type { SanityDocument } from "next-sanity";
import { loadQuery } from "../../../../sanity/lib/store";
import { POSTS_BY_CATEGORY_QUERY, CATEGORY_QUERY, POSTS_QUERY } from "../../../../sanity/lib/queries";
import FeedLayout from "@/components/FeedLayout";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

// Helper to fetch category data
async function getCategoryData(slug: string) {
    const { data: category } = await loadQuery<SanityDocument>(
        CATEGORY_QUERY,
        { slug },
        { perspective: draftMode().isEnabled ? "previewDrafts" : "published" }
    );
    return category;
}

// Helper to fetch posts for category
async function getCategoryPosts(slug: string) {
    const { data: posts } = await loadQuery<SanityDocument[]>(
        POSTS_BY_CATEGORY_QUERY,
        { slug },
        { perspective: draftMode().isEnabled ? "previewDrafts" : "published" }
    );
    return posts;
}

// Helper to fetch "popular" (latest) posts for sidebar
async function getPopularPosts() {
    const { data: posts } = await loadQuery<SanityDocument[]>(
        POSTS_QUERY,
        {},
        { perspective: draftMode().isEnabled ? "previewDrafts" : "published" }
    );
    return posts; // We'll slice in the component
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    console.log(`Fetching category for slug: ${params.slug}`);

    const [category, posts, allPosts] = await Promise.all([
        getCategoryData(params.slug),
        getCategoryPosts(params.slug),
        getPopularPosts()
    ]);

    if (!category) {
        console.error(`Category not found for slug: ${params.slug}`);
        notFound();
    }

    return (
        <FeedLayout
            title={category.title}
            description={category.description}
            mainPosts={posts || []}
            popularPosts={allPosts || []}
            allPostsForFooter={allPosts || []}
        />
    );
}
