import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import {
    CATEGORY_QUERY,
    POSTS_BY_CATEGORY_QUERY,
    POSTS_BY_TAG_QUERY,
    POSTS_PREVIEW_QUERY,
    TAG_QUERY,
    TRENDING_AUTO_POSTS_QUERY,
    TRENDING_PAGE_QUERY,
    TRENDING_PRIORITY_POSTS_QUERY,
} from "@sanity/lib/queries";
import { mergeTrendingPosts, resolveTrendingPageMeta, type TrendingPageConfig } from "@/lib/trending";

export function fetchPopularPosts() {
    return client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY);
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

