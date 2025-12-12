import { SanityDocument } from "next-sanity";

export interface Author extends SanityDocument {
    name: string;
    image?: any;
    bio?: any[];
}

export interface Category extends SanityDocument {
    title: string;
    description?: string;
}

export interface Tag extends SanityDocument {
    title: string;
    slug: { current: string };
}

export interface Post extends SanityDocument {
    title: string;
    subtitle?: string;
    slug: { current: string };
    publishedAt: string;
    mainImage?: any;
    featured_image?: string;
    description?: string;
    author?: Author;
    categories?: Category[];
    tags?: Tag[];
    body?: any[];
}

