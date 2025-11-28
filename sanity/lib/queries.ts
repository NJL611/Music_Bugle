// ./sanity/lib/queries.ts

import { groq } from "next-sanity";

// Full post data with complete body
export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    featured_image,
    mainImage {
      asset-> {
        _id,
        _ref,
        url,
        metadata
      }
    },
    "author": author->{
      name,
      _id
    },
    body,
    "categories": coalesce(categories[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    "tags": coalesce(tags[]->{
      title,
      _id,
      "slug": slug.current,
      description
    }, []),
    publishedAt,
    _updatedAt
  }
`;

// Preview data with truncated body for lists/grids
export const POSTS_PREVIEW_QUERY = groq`
  *[_type == "post" && defined(slug)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    featured_image,
    mainImage {
      asset-> {
        _id,
        _ref,
        url,
        metadata
      }
    },
    "author": author->{
      name,
      _id
    },
    "body": body[0...1], 
    "categories": coalesce(categories[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    "tags": coalesce(tags[]->{
      title,
      _id,
      "slug": slug.current,
      description
    }, []),
    publishedAt,
    _updatedAt
  }
`;

export const POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    subtitle,
    "slug": slug.current,
    featured_image,
    mainImage {
      asset-> {
        _id,
        _ref,
        url,
        metadata
      }
    },
    "author": author->{
      name,
      _id
    },
    body,
    "categories": coalesce(categories[]->{
      title,
      _id,
      "slug": slug.current,
      description
    }, []),
    "tags": coalesce(tags[]->{
      title,
      _id,
      "slug": slug.current,
      description
    }, []),
    publishedAt,
    _updatedAt
  }
`;


export const SEARCH_QUERY = groq`
  *[_type == "post" && defined(slug) && (
    title match $search || 
    subtitle match $search ||
    categories[]->title match $search ||
    tags[]->title match $search
  )] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    featured_image,
    mainImage {
      asset-> {
        _id,
        _ref,
        url,
        metadata
      }
    },
    "author": author->{
      name,
      _id
    },
    "body": body[0...1],
    "categories": coalesce(categories[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    "tags": coalesce(tags[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    publishedAt,
    _updatedAt
  }
`;

// Tag-related queries
export const TAG_QUERY = groq`
  *[_type == "tag" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

export const POSTS_BY_TAG_QUERY = groq`
  *[_type == "post" && defined(slug) && references(*[_type == "tag" && slug.current == $slug]._id)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    featured_image,
    mainImage {
      asset-> {
        _id,
        _ref,
        url,
        metadata
      }
    },
    "author": author->{
      name,
      _id
    },
    "body": body[0...1],
    "categories": coalesce(categories[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    "tags": coalesce(tags[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    publishedAt,
    _updatedAt
  }
`;

export const ALL_TAGS_QUERY = groq`
  *[_type == "tag" && defined(slug)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

// Category-related queries
export const CATEGORY_QUERY = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description
  }
`;

export const POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "post" && defined(slug) && references(*[_type == "category" && slug.current == $slug]._id)] | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    featured_image,
    mainImage {
      asset-> {
        _id,
        _ref,
        url,
        metadata
      }
    },
    "author": author->{
      name,
      _id
    },
    "body": body[0...1],
    "categories": coalesce(categories[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    "tags": coalesce(tags[]->{
      title,
      _id,
      "slug": slug.current
    }, []),
    publishedAt,
    _updatedAt
  }
`;

export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category" && defined(slug)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description
  }
`;
