import { MetadataRoute } from 'next';
import { SanityDocument } from 'next-sanity';
import { draftMode } from 'next/headers';

import { loadQuery } from '../../sanity/lib/store';
import { POSTS_QUERY } from '../../sanity/lib/queries';

const WEBSITE_HOST_URL = process.env.SITE_URL || 'https://themusicbugle.com';

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

interface Article {
  slug: string;
  date: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const initial: any = await loadQuery<SanityDocument[]>(POSTS_QUERY, {}, {
    perspective: draftMode().isEnabled ? 'previewDrafts' : 'published',
  });

  let articles: Article[] = initial.data;
  const changeFrequency: ChangeFrequency = 'daily';

  const posts = articles.map(({ slug, date }) => ({
    url: `${WEBSITE_HOST_URL}/posts/${slug}`,
    lastModified: date,
    changeFrequency,
  }));

  const routes = ['', '/about', '/article'].map((route) => ({
    url: `${WEBSITE_HOST_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
  }));

  return [...routes, ...posts];
}
