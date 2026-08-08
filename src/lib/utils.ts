import type { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "@sanity/env";
import { HOMEPAGE_CATEGORIES, HOMEPAGE_COUNTS } from "@/lib/constants";

// Sanity Helpers
const builder = imageUrlBuilder({ projectId, dataset });

export const sanityImageBuilder = builder;

export const imageFromSource = (source: SanityImageSource) => builder.image(source);

// next.config.mjs only whitelists cdn.sanity.io, and the old WordPress origin is gone — legacy
// i0.wp.com featured_image URLs 400 at the image optimizer and render as a BROKEN image. Returning
// null instead lets every caller fall through to its existing no-image layout.
export function usableImageUrl(url?: string | null): string | null {
    return url && url.startsWith("https://cdn.sanity.io/") ? url : null;
}

export function resolvePostPath(source: SlugLike, prefix = "/article/"): string {
    const slug = resolvePostSlug(source);
    return slug ? `${prefix}${slug}` : "/";
}

export function getPostExcerpt(post: SanityDocument): string | undefined {
    const firstBlock = post.body?.[0]?.children?.[0]?.text;
    return firstBlock || post.subtitle || post.description;
}

export function getPostImage(post: SanityDocument, width = 1200, height?: number) {
    if (post.mainImage?.asset?._ref || post.mainImage?.asset?._id) {
        // Pass the whole image object, not .asset — the editor's hotspot lives on the parent and
        // is only honoured by fit("crop"), which is what fixed-ratio card slots actually do.
        let img = sanityImageBuilder
            .image(post.mainImage)
            .width(width)
            .auto("format");

        img = height ? img.height(height).fit("crop") : img.fit("clip");

        return img.url();
    }

    return usableImageUrl(post.featured_image);
}

// Card grids need *an* image or the tile collapses, so they take the branded fallback. Article
// heroes deliberately don't — a blank hero reads better than the same placeholder on every page.
export function getPostImageOrFallback(post: SanityDocument, width = 1200, height?: number): string {
    // Local path, not METADATA.image: next/image rejects absolute URLs to unconfigured hosts.
    return getPostImage(post, width, height) ?? '/og-preview.jpg';
}

function postHasCategory(post: SanityDocument, categorySlug: string): boolean {
    return post.categories?.some((category: { slug?: string }) => category.slug === categorySlug) ?? false;
}

function takeUniquePosts(
    posts: SanityDocument[],
    count: number,
    usedIds: Set<string>,
): SanityDocument[] {
    const selected: SanityDocument[] = [];

    for (const post of posts) {
        if (selected.length >= count) break;
        if (usedIds.has(post._id)) continue;

        usedIds.add(post._id);
        selected.push(post);
    }

    return selected;
}

function takeCategoryPosts(
    posts: SanityDocument[],
    categorySlug: string,
    count: number,
    usedIds: Set<string>,
): SanityDocument[] {
    const categoryPosts = posts.filter((post) => postHasCategory(post, categorySlug));
    return takeUniquePosts(categoryPosts, count, usedIds);
}

// Date-driven split for showcase mode: the live corpus is ~99% one category,
// so the category-keyed sections of distributePosts would come back empty.
// Visual slots draw imaged posts first — only ~40% of the corpus has one.
export function distributePostsShowcase(posts: SanityDocument[] = []) {
    const usedIds = new Set<string>();
    const imaged = posts.filter((post) => post.mainImage?.asset);
    return {
        carousel: takeUniquePosts(imaged, HOMEPAGE_COUNTS.CAROUSEL, usedIds),
        topStory: takeUniquePosts(imaged, HOMEPAGE_COUNTS.TOP_STORY, usedIds)[0] || null,
        featured: takeUniquePosts(imaged, 12, usedIds),
        sidebar: takeUniquePosts(posts, HOMEPAGE_COUNTS.SIDEBAR, usedIds),
        more: takeUniquePosts(imaged, 12, usedIds),
    };
}

export function distributePosts(posts: SanityDocument[] = []): HomepageContent {
    const usedIds = new Set<string>();

    const carousel = takeUniquePosts(posts, HOMEPAGE_COUNTS.CAROUSEL, usedIds);
    const topStory = takeUniquePosts(posts, HOMEPAGE_COUNTS.TOP_STORY, usedIds)[0] || null;
    const sidebar = takeCategoryPosts(
        posts,
        HOMEPAGE_CATEGORIES.SIDEBAR,
        HOMEPAGE_COUNTS.SIDEBAR,
        usedIds,
    );
    const newReleases = takeCategoryPosts(
        posts,
        HOMEPAGE_CATEGORIES.NEW_RELEASES,
        HOMEPAGE_COUNTS.NEW_RELEASES,
        usedIds,
    );
    const editorsPicks = takeCategoryPosts(
        posts,
        HOMEPAGE_CATEGORIES.EDITORS_PICKS,
        HOMEPAGE_COUNTS.EDITORS_LARGE + HOMEPAGE_COUNTS.EDITORS_SMALL,
        usedIds,
    );
    const latestNews = takeCategoryPosts(
        posts,
        HOMEPAGE_CATEGORIES.LATEST_NEWS,
        HOMEPAGE_COUNTS.LATEST_NEWS,
        usedIds,
    );
    const bottomSection = takeCategoryPosts(
        posts,
        HOMEPAGE_CATEGORIES.BOTTOM_SECTION,
        HOMEPAGE_COUNTS.BOTTOM_SECTION,
        usedIds,
    );
    const mustWatch = takeCategoryPosts(
        posts,
        HOMEPAGE_CATEGORIES.MUST_WATCH,
        HOMEPAGE_COUNTS.MUST_WATCH,
        usedIds,
    );

    return {
        carousel,
        topStory,
        sidebar,
        newReleases,
        editorsPicksLarge: editorsPicks.slice(0, HOMEPAGE_COUNTS.EDITORS_LARGE),
        editorsPicksSmall: editorsPicks.slice(HOMEPAGE_COUNTS.EDITORS_LARGE),
        latestNews,
        bottomSection,
        mustWatch,
    };
}

// --- Post Helpers ---
export type HomepageContent = {
    carousel: SanityDocument[];
    topStory: SanityDocument | null;
    sidebar: SanityDocument[];
    newReleases: SanityDocument[];
    editorsPicksLarge: SanityDocument[];
    editorsPicksSmall: SanityDocument[];
    latestNews: SanityDocument[];
    bottomSection: SanityDocument[];
    mustWatch: SanityDocument[];
};

// --- Format Date ---
// The migrated publishedAt values are WordPress's GMT instants, but WordPress displayed the site's
// local day (US Eastern) — its permalinks prove it: /2023/11/28/...-jeffrey-james vs the stored
// 2023-11-29T04:57Z. Formatting in UTC shifted every evening post one day late.
export const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    return `${get('day')} ${get('month')} ${get('year')}`;
};

// --- Currency Helpers ---
export function convertToSubcurrency(amount: number, factor = 100): number {
    return Math.round(amount * factor);
}

type SlugShape = {
    slug?: string | { current?: string };
};

type SlugLike = string | undefined | SlugShape | (SanityDocument & SlugShape);

export function resolvePostSlug(source: SlugLike): string | undefined {
    if (!source) return undefined;
    if (typeof source === "string") return source;

    const slug = source.slug;

    if (typeof slug === "string") {
        return slug;
    }

    return slug?.current;
}

/** Bios are short Portable Text; flatten to a string for headers, bylines and meta descriptions. */
export function bioToText(bio?: Array<{ children?: Array<{ text?: string }> }>): string {
    if (!Array.isArray(bio)) return "";
    return bio
        .map((block) => (Array.isArray(block?.children) ? block.children.map((c) => c?.text ?? "").join("") : ""))
        .join("\n\n")
        .trim();
}

/** Tag/author archives below this many posts carry no content of their own worth indexing. */
export const MIN_INDEXABLE_LISTING_POSTS = 3;

// Thin archives are the "low value content" surface AdSense flags: a tag page with one post is a
// near-duplicate of that post. follow stays true so link equity still reaches the articles.
export function listingRobots(postCount: number | undefined) {
    return { index: (postCount ?? 0) >= MIN_INDEXABLE_LISTING_POSTS, follow: true };
}

