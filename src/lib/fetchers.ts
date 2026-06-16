import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import {
    CATEGORY_QUERY,
    POSTS_BY_CATEGORY_QUERY,
    POSTS_BY_TAG_QUERY,
    POSTS_PREVIEW_QUERY,
    POPULAR_PAGE_QUERY,
    TAG_QUERY,
    TRENDING_AUTO_POSTS_QUERY,
    TRENDING_PAGE_QUERY,
    TRENDING_PRIORITY_POSTS_QUERY,
} from "@sanity/lib/queries";
import { HOMEPAGE_COUNTS } from "@/lib/constants";
import { mergeTrendingPosts, resolveTrendingPageMeta, type TrendingPageConfig } from "@/lib/trending";
import { resolvePopularPageMeta, type PopularPageConfig } from "@/lib/popular";

export function fetchPopularPostsFromQuery() {
    return client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY);
}

export async function fetchPopularPage() {
    const config = await client.fetch<PopularPageConfig | null>(POPULAR_PAGE_QUERY);
    return resolvePopularPageMeta(config);
}

export async function fetchPopularPosts() {
    const page = await fetchPopularPage();
    const cutoff = new Date(Date.now() - page.autoFillDays * 86_400_000).toISOString();
    const featuredPosts = page.featuredPosts.filter((post): post is SanityDocument => Boolean(post?._id));
    const excludeIds = featuredPosts.map((post) => post._id);
    const remaining = Math.max(page.autoFillLimit - featuredPosts.length, 0);
    const autoPosts =
        remaining > 0
            ? await client.fetch<SanityDocument[]>(TRENDING_AUTO_POSTS_QUERY, {
                  cutoff,
                  excludeIds,
                  limit: remaining,
              })
            : [];

    return mergeTrendingPosts([], featuredPosts, autoPosts, page.autoFillLimit);
}

/** Curated Popular list for the sidebar widget (featured first, then auto-fill). */
export async function fetchPopularSidebarPosts(
    limit = HOMEPAGE_COUNTS.POPULAR_SIDEBAR,
): Promise<SanityDocument[]> {
    const posts = await fetchPopularPosts();
    return posts.slice(0, limit);
}

export function fetchCategoryData(slug: string) {
    return client.fetch<SanityDocument | null>(CATEGORY_QUERY, { slug });
}

export function fetchCategoryPosts(slug: string) {
    return client.fetch<SanityDocument[]>(POSTS_BY_CATEGORY_QUERY, { slug });
}

export function fetchTagData(slug: string) {
    return client.fetch<SanityDocument | null>(TAG_QUERY, { slug });
}

export function fetchTagPosts(slug: string) {
    return client.fetch<SanityDocument[]>(POSTS_BY_TAG_QUERY, { slug });
}

export async function fetchTrendingPage() {
    const config = await client.fetch<TrendingPageConfig | null>(TRENDING_PAGE_QUERY);
    return resolveTrendingPageMeta(config);
}

export async function fetchTrendingPosts() {
    const page = await fetchTrendingPage();
    const cutoff = new Date(Date.now() - page.autoFillDays * 86_400_000).toISOString();

    const priorityPosts = await client.fetch<SanityDocument[]>(TRENDING_PRIORITY_POSTS_QUERY);
    const featuredPosts = page.featuredPosts;

    const excludeIds = [
        ...priorityPosts.map((post) => post._id),
        ...featuredPosts.map((post) => post._id),
    ];

    const remaining = Math.max(page.autoFillLimit - priorityPosts.length - featuredPosts.length, 0);
    const autoPosts =
        remaining > 0
            ? await client.fetch<SanityDocument[]>(TRENDING_AUTO_POSTS_QUERY, {
                  cutoff,
                  excludeIds,
                  limit: remaining,
              })
            : [];

    const posts = mergeTrendingPosts(
        priorityPosts,
        featuredPosts,
        autoPosts,
        page.autoFillLimit,
    );

    return { page, posts };
}

