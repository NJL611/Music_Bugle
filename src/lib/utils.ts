import type { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "@sanity/env";
import { HOMEPAGE_CATEGORIES, HOMEPAGE_COUNTS } from "@/lib/constants";

// Sanity Helpers
const builder = imageUrlBuilder({ projectId, dataset });

export const sanityImageBuilder = builder;

export const imageFromSource = (source: SanityImageSource) => builder.image(source);

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
        let img = sanityImageBuilder
            .image(post.mainImage.asset)
            .width(width)
            .fit("clip")
            .auto("format");

        if (height) {
            img = img.height(height);
        }

        return img.url();
    }

    return post.featured_image || null;
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
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
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

