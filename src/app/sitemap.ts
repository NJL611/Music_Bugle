import { MetadataRoute } from 'next';
import type { SanityDocument } from 'next-sanity';
import { client } from '@sanity/lib/client';
import { POSTS_QUERY } from '@sanity/lib/queries';
import { SITE_URL } from '@/lib/constants';

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await client.fetch<SanityDocument[]>(POSTS_QUERY);
  const changeFrequency: ChangeFrequency = 'daily';

  const posts = articles.map(({ slug, date }) => ({
    url: `${SITE_URL}/posts/${slug}`,
    lastModified: date,
    changeFrequency,
  }));

  const routes = ['', '/about', '/article'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
  }));

  return [...routes, ...posts];
}
