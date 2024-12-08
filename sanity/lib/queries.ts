// ./sanity/lib/queries.ts

import { groq } from "next-sanity";

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug)]{
    _id,
    title,
    subtitle,
    "slug": slug.current,
    mainImage {
      asset->{
        _id,
        url
      }
    },
    "author": author->{
      name,
      _id
    },
    body,
    "categories": categories[]->{
      title,
      _id
    },
    "tags": tags[]->{
      title,
      _id,
      description
    },
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
    mainImage {
      asset->{
        _id,
        url
      }
    },
    "author": author->{
      name,
      _id
    },
    body,
    "categories": categories[]->{
      title,
      _id,
      description
    },
    "tags": coalesce(tags[]->{
      title,
      _id,
      description
    }, []),
    publishedAt,
    _updatedAt
  }
`;


export const SEARCH_QUERY = groq`
  *[_type == "post" && defined(slug) && (title match $search || categories[]->title match $search)] {
    _id,
    title,
    subtitle,
    "slug": slug.current,
    mainImage {
      asset->{
        _id,
        url
      }
    },
    "author": author->{
      name,
      _id
    },
    body,
    "categories": categories[]->{
      title,
      _id
    },
    "tags": tags[]->{
      title,
      _id
    },
    publishedAt,
    _updatedAt
  }
`;

