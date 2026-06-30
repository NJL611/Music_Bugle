import { MetadataRoute } from 'next';
import type { SanityDocument } from 'next-sanity';
import { client } from '@sanity/lib/client';
import { POSTS_QUERY, ALL_CATEGORIES_QUERY, ALL_AUTHORS_QUERY } from '@sanity/lib/queries';
import { SITE_URL } from '@/lib/constants';

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
    client.fetch<SanityDocument[]>(POSTS_QUERY),
    client.fetch<Array<{ slug: string }>>(ALL_CATEGORIES_QUERY),
    client.fetch<Array<{ slug: string }>>(ALL_AUTHORS_QUERY),
  ]);

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
    '/refund',
    '/consent-preferences',
    '/support',
    '/search',
    '/trending',
    '/popular',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as ChangeFrequency,
  }));

  const categoryRoutes = categories
    .filter((category) => category.slug)
    .map(({ slug }) => ({
      url: `${SITE_URL}/category/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as ChangeFrequency,
    }));

  const authorRoutes = authors
    .filter((author) => author.slug)
    .map(({ slug }) => ({
      url: `${SITE_URL}/author/${slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as ChangeFrequency,
    }));

  return [...staticRoutes, ...categoryRoutes, ...authorRoutes, ...posts];
}
