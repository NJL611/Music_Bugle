import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import {
    CATEGORY_QUERY,
    POSTS_BY_CATEGORY_QUERY,
    POSTS_BY_TAG_QUERY,
    POSTS_PREVIEW_QUERY,
    TAG_QUERY,
} from "@sanity/lib/queries";

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

