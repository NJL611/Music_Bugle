import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import {
    ARTICLE_SUGGESTIONS_QUERY,
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

type SuggestionLists = Record<"related" | "pinned" | "featured" | "latest", (SanityDocument | null)[] | null>;

/** Related + Trending for the article sidebar and "More like this" below it; no post appears twice on the page. */
export async function fetchArticleSuggestions(post: SanityDocument) {
    // Previews pass a draft; match its published id so the post never suggests itself.
    const id = post._id.replace(/^drafts\./, "");
    const ids = (refs?: { _id: string }[]) => (refs ?? []).map((ref) => ref._id);
    const lists = await client.fetch<SuggestionLists>(ARTICLE_SUGGESTIONS_QUERY, {
        id,
        tagIds: ids(post.tags),
        categoryIds: ids(post.categories),
    });

    const seen = new Set([id]);
    const take = (count: number, ...sources: SuggestionLists[keyof SuggestionLists][]) => {
        const picked: SanityDocument[] = [];
        for (const candidate of sources.flatMap((source) => source ?? [])) {
            if (picked.length === count) break;
            if (!candidate?._id || seen.has(candidate._id)) continue;
            seen.add(candidate._id);
            picked.push(candidate);
        }
        return picked;
    };

    // Order matters: each list skips what the earlier ones took. Latest fills any list that runs short.
    const related = take(4, lists.related);
    const trending = take(4, lists.pinned, lists.featured, lists.latest);
    const more = take(4, lists.related, lists.latest);
    // Footer's "The latest" skips the dedupe: deduped, it would show older posts under that heading.
    const latest = (lists.latest ?? []).filter((p): p is SanityDocument => !!p?._id && p._id !== id);
    return { related, trending, more, latest };
}

