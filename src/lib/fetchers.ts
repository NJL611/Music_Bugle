import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import {
    AUTHOR_QUERY,
    CATEGORY_QUERY,
    POSTS_BY_AUTHOR_QUERY,
    POSTS_BY_CATEGORY_QUERY,
    POSTS_BY_TAG_QUERY,
    POSTS_PREVIEW_QUERY,
    POPULAR_PAGE_QUERY,
    TAG_QUERY,
    TRENDING_AUTO_POSTS_QUERY,
    TRENDING_PAGE_QUERY,
    TRENDING_PRIORITY_POSTS_QUERY,
} from "@sanity/lib/queries";
import { HOMEPAGE_COUNTS, LISTING_PAGE_SIZE } from "@/lib/constants";
import { mergeTrendingPosts, resolveTrendingPageMeta, type TrendingPageConfig } from "@/lib/trending";
import { resolvePopularPageMeta, type PopularPageConfig } from "@/lib/popular";

// Sanity fetches for listing pages: archives (paged by LISTING_PAGE_SIZE), trending and popular.
// Archive posts come one page at a time; the counts that size the pagination live on the *_QUERY data docs.

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

function pageRange(page: number) {
    const start = (page - 1) * LISTING_PAGE_SIZE;
    return { start, end: start + LISTING_PAGE_SIZE };
}

export function fetchCategoryPosts(slug: string, page = 1) {
    return client.fetch<SanityDocument[]>(POSTS_BY_CATEGORY_QUERY, { slug, ...pageRange(page) });
}

export function fetchAuthorData(slug: string) {
    return client.fetch<SanityDocument | null>(AUTHOR_QUERY, { slug });
}

export function fetchAuthorPosts(slug: string, page = 1) {
    return client.fetch<SanityDocument[]>(POSTS_BY_AUTHOR_QUERY, { slug, ...pageRange(page) });
}

export function fetchTagData(slug: string) {
    return client.fetch<SanityDocument | null>(TAG_QUERY, { slug });
}

export function fetchTagPosts(slug: string, page = 1) {
    return client.fetch<SanityDocument[]>(POSTS_BY_TAG_QUERY, { slug, ...pageRange(page) });
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

