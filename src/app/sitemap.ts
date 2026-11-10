import { MetadataRoute } from 'next';
import type { SanityDocument } from 'next-sanity';
import { client } from '@sanity/lib/client';
import { SITEMAP_POSTS_QUERY, ALL_CATEGORIES_QUERY, SITEMAP_AUTHORS_QUERY } from '@sanity/lib/queries';
import { SITE_URL, SUPPORT_PAYMENTS_ENABLED } from '@/lib/constants';
import { listingRobots } from '@/lib/utils';

// sitemap.xml: static pages, indexable category/author archives, and every published article.
// Archives go through listingRobots so the sitemap never lists a page that is itself noindex.

type ListingRow = { slug: string; postCount: number; latestAt?: string };

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

function toLastModified(value: string | undefined): string {
  if (value) return new Date(value).toISOString();
  return new Date().toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories, authors] = await Promise.all([
    client.fetch<SanityDocument[]>(SITEMAP_POSTS_QUERY),
    client.fetch<ListingRow[]>(ALL_CATEGORIES_QUERY),
    client.fetch<ListingRow[]>(SITEMAP_AUTHORS_QUERY),
  ]);
  // Only list archives the page itself would let Google index.
  const indexable = (row: ListingRow) => Boolean(row.slug) && listingRobots(row.postCount, row.latestAt).index;

  const posts = articles.map(({ slug, publishedAt, _updatedAt }) => ({
    url: `${SITE_URL}/article/${slug}`,
    lastModified: toLastModified(_updatedAt || publishedAt),
    changeFrequency: 'daily' as ChangeFrequency,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    ...(SUPPORT_PAYMENTS_ENABLED ? ['/refund', '/support'] : []),
    '/consent-preferences',
    '/trending',
    '/popular',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly' as ChangeFrequency,
  }));

  const listingRoutes = [
    ...categories.filter(indexable).map(({ slug }) => `/category/${slug}`),
    ...authors.filter(indexable).map(({ slug }) => `/author/${slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly' as ChangeFrequency,
  }));

  return [...staticRoutes, ...listingRoutes, ...posts];
}
