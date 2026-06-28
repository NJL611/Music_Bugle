import type { SanityDocument } from 'next-sanity';

export const POPULAR_DEFAULTS = {
  title: 'Popular',
  description:
    'The stories readers are engaging with most — curated by our editors until analytics is connected.',
  autoFillDays: 14,
  autoFillLimit: 12,
} as const;

export interface PopularPageConfig {
  title?: string;
  description?: string;
  autoFillDays?: number;
  autoFillLimit?: number;
  featuredPosts?: SanityDocument[];
}

export function resolvePopularPageMeta(config: PopularPageConfig | null) {
  return {
    title: config?.title?.trim() || POPULAR_DEFAULTS.title,
    description: config?.description?.trim() || POPULAR_DEFAULTS.description,
    autoFillDays: config?.autoFillDays ?? POPULAR_DEFAULTS.autoFillDays,
    autoFillLimit: config?.autoFillLimit ?? POPULAR_DEFAULTS.autoFillLimit,
    featuredPosts: config?.featuredPosts ?? [],
  };
}
