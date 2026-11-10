import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { SanityDocument } from "next-sanity";
import FeedLayout from "@/components/layout/FeedLayout";
import {
  fetchAuthorData,
  fetchAuthorPosts,
  fetchCategoryData,
  fetchCategoryPosts,
  fetchPopularSidebarPosts,
  fetchTagData,
  fetchTagPosts,
} from "@/lib/fetchers";
import { LISTING_PAGE_SIZE, METADATA, SITE_URL } from "@/lib/constants";
import { bioToText, listingPagePath, listingRobots } from "@/lib/utils";

// Paginated category, tag and author archives: page 1 at /<kind>/<slug>, later pages at /<kind>/<slug>/page/N.
// Path segments rather than ?page= keep every page ISR; searchParams would render each bot hit dynamically.

type ListingKind = "category" | "tag" | "author";

interface ListingSource {
  fetchData: (slug: string) => Promise<SanityDocument | null>;
  fetchPosts: (slug: string, page: number) => Promise<SanityDocument[]>;
  heading: (data: SanityDocument) => { title: string; description?: string };
  fallbackDescription: (title: string) => string;
  ogType: "website" | "profile";
}

const SOURCES: Record<ListingKind, ListingSource> = {
  category: {
    fetchData: fetchCategoryData,
    fetchPosts: fetchCategoryPosts,
    heading: (data) => ({ title: data.title, description: data.description }),
    fallbackDescription: (title) =>
      `Browse ${title} articles on ${METADATA.title} — music news, reviews, and coverage.`,
    ogType: "website",
  },
  tag: {
    fetchData: fetchTagData,
    fetchPosts: fetchTagPosts,
    heading: (data) => ({ title: data.title, description: data.description }),
    fallbackDescription: (title) => `Articles tagged "${title}" on ${METADATA.title}.`,
    ogType: "website",
  },
  author: {
    fetchData: fetchAuthorData,
    fetchPosts: fetchAuthorPosts,
    heading: (data) => ({ title: data.name, description: bioToText(data.bio) || undefined }),
    fallbackDescription: (title) => `${title}, ${METADATA.title}.`,
    ogType: "profile",
  },
};

const pageTitle = (title: string, page: number) => (page > 1 ? `${title} – Page ${page}` : title);

/** `[[...pagination]]` segments → page number: none is page 1, `page/N` is N ≥ 2, anything else null (404). */
export function parseListingSegments(segments?: string[]): number | null {
  if (!segments?.length) return 1;
  if (segments.length !== 2 || segments[0] !== "page" || !/^\d+$/.test(segments[1])) return null;
  const page = Number(segments[1]);
  return page >= 2 ? page : null;
}

export async function listingMetadata(kind: ListingKind, slug: string, page = 1): Promise<Metadata> {
  const source = SOURCES[kind];
  const data = await source.fetchData(slug);
  if (!data) return { title: "Not Found" };

  const { title, description } = source.heading(data);
  const desc = description || source.fallbackDescription(title);
  const url = `${SITE_URL}${listingPagePath(`/${kind}/${slug}`, page)}`;

  return {
    title: pageTitle(title, page),
    description: desc,
    openGraph: {
      title: `${pageTitle(title, page)} - ${METADATA.title}`,
      description: desc,
      url,
      type: source.ogType,
    },
    alternates: { canonical: url },
    robots: listingRobots(data.postCount, data.latestAt),
  };
}

export async function ListingPage({ kind, slug, page = 1 }: { kind: ListingKind; slug: string; page?: number }) {
  const source = SOURCES[kind];
  const [data, posts, popularPosts] = await Promise.all([
    source.fetchData(slug),
    source.fetchPosts(slug, page),
    fetchPopularSidebarPosts(),
  ]);

  // Empty archives and out-of-range pages 404 so they aren't indexed as thin pages.
  if (!data || !posts?.length) {
    notFound();
  }

  const { title, description } = source.heading(data);

  return (
    <FeedLayout
      title={pageTitle(title, page)}
      description={page === 1 ? description : undefined}
      mainPosts={posts}
      popularPosts={popularPosts}
      pagination={{
        page,
        totalPages: Math.ceil((data.postCount ?? 0) / LISTING_PAGE_SIZE),
        basePath: `/${kind}/${slug}`,
      }}
    />
  );
}
