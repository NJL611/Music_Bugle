import type { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "@sanity/env";
import { HOMEPAGE_COUNTS } from "@/lib/constants";

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

export function distributePosts(posts: SanityDocument[] = []): HomepageContent {
    let currentIndex = 0;

    const getSlice = (count: number) => {
        const slice = posts.slice(currentIndex, currentIndex + count);
        currentIndex += count;
        return slice;
    };

    return {
        carousel: getSlice(HOMEPAGE_COUNTS.CAROUSEL),
        topStory: getSlice(HOMEPAGE_COUNTS.TOP_STORY)[0] || null,
        sidebar: getSlice(HOMEPAGE_COUNTS.SIDEBAR),
        newReleases: getSlice(HOMEPAGE_COUNTS.NEW_RELEASES),
        editorsPicksLarge: getSlice(HOMEPAGE_COUNTS.EDITORS_LARGE),
        editorsPicksSmall: getSlice(HOMEPAGE_COUNTS.EDITORS_SMALL),
        latestNews: getSlice(HOMEPAGE_COUNTS.LATEST_NEWS),
        bottomSection: getSlice(HOMEPAGE_COUNTS.BOTTOM_SECTION),
        mustWatch: getSlice(HOMEPAGE_COUNTS.MUST_WATCH),
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

