import React from "react";
import type { SanityDocument } from "next-sanity";
import { loadQuery } from "../../../../sanity/lib/store";
import { POSTS_BY_TAG_QUERY, TAG_QUERY, POSTS_QUERY } from "../../../../sanity/lib/queries";
import FeedLayout from "@/components/FeedLayout";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

// Helper to fetch tag data
async function getTagData(slug: string) {
    const { data: tag } = await loadQuery<SanityDocument>(
        TAG_QUERY,
        { slug },
        { perspective: draftMode().isEnabled ? "previewDrafts" : "published" }
    );
    return tag;
}

// Helper to fetch posts for tag
async function getTagPosts(slug: string) {
    const { data: posts } = await loadQuery<SanityDocument[]>(
        POSTS_BY_TAG_QUERY,
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
    return posts;
}

export default async function TagPage({ params }: { params: { slug: string } }) {
    console.log(`Fetching tag for slug: ${params.slug}`);

    const [tag, posts, allPosts] = await Promise.all([
        getTagData(params.slug),
        getTagPosts(params.slug),
        getPopularPosts()
    ]);

    if (!tag) {
        console.error(`Tag not found for slug: ${params.slug}`);
        notFound();
    }

    return (
        <FeedLayout
            title={tag.title}
            description={tag.description}
            mainPosts={posts || []}
            popularPosts={allPosts || []}
            allPostsForFooter={allPosts || []}
        />
    );
}
