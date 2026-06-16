import type { SanityDocument } from 'next-sanity';

export const TRENDING_DEFAULTS = {
  title: 'Trending',
  description:
    'The stories getting the most attention right now — curated by our editors and updated automatically.',
  autoFillDays: 14,
  autoFillLimit: 24,
} as const;

export interface TrendingPageConfig {
  title?: string;
  description?: string;
  autoFillDays?: number;
  autoFillLimit?: number;
  featuredPosts?: SanityDocument[];
}

/** Merge admin-pinned, featured, and automatic posts without duplicates. */
export function mergeTrendingPosts(
  priorityPosts: SanityDocument[],
  featuredPosts: SanityDocument[],
  autoPosts: SanityDocument[],
  limit: number,
): SanityDocument[] {
  const seen = new Set<string>();
  const merged: SanityDocument[] = [];

  const add = (post: SanityDocument | null | undefined) => {
    if (!post?._id || seen.has(post._id) || merged.length >= limit) return;
    seen.add(post._id);
    merged.push(post);
  };

  for (const post of priorityPosts) add(post);
  for (const post of featuredPosts) add(post);
  for (const post of autoPosts) add(post);

  return merged;
}

export function resolveTrendingPageMeta(config: TrendingPageConfig | null) {
  return {
    title: config?.title?.trim() || TRENDING_DEFAULTS.title,
    description: config?.description?.trim() || TRENDING_DEFAULTS.description,
    autoFillDays: config?.autoFillDays ?? TRENDING_DEFAULTS.autoFillDays,
    autoFillLimit: config?.autoFillLimit ?? TRENDING_DEFAULTS.autoFillLimit,
    featuredPosts: config?.featuredPosts ?? [],
  };
}
