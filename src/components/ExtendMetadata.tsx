import React from 'react';
import Head from 'next/head';
import type { Metadata } from 'next';

interface ExtendedMetadata extends Metadata {
  image?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export default function ExtendMetadata({ meta }: { meta: ExtendedMetadata }) {
  const metadataBase = 'https://themusicbugle.com';
  const titleTemplate = '%s - The Music Bugle';
  const defaultTitle = meta.title;

  // console.log(meta);

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={meta.description?.toString() || 'Your source for the latest music news.'} />
      <meta name="keywords" content={meta.keywords?.toString() || 'music, news, latest updates'} />
      <meta name="author" content={meta.author?.toString() || 'The Music Bugle'} />
      <meta property="og:title" content={meta.title?.toString() || 'The Music Bugle'} />
      <meta property="og:description" content={meta.description?.toString() || 'Your source for the latest music news.'} />
      <meta property="og:url" content={process.env.SITE_URL || metadataBase} />
      <meta property="og:locale" content="en-US" />
      <meta property="og:site_name" content={meta.title?.toString() || 'The Music Bugle'} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={meta.image || 'https://themusicbugle.com/og-preview.jpg'} />
      <meta property="og:type" content="article" />
      <meta property="article:author" content={meta.author?.toString() || 'The Music Bugle'} />
      <meta property="article:published_time" content={meta.publishedTime?.toString() || ''} />
      <meta property="article:modified_time" content={meta.modifiedTime?.toString() || ''} />
      <meta name="twitter:title" content={meta.title?.toString() || 'The Music Bugle'} />
      <meta name="twitter:description" content={meta.description || 'Your source for the latest music news.'} />
      <meta name="twitter:image" content={meta.image || 'https://themusicbugle.com/og-preview.jpg'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@TheMusicBugle" />
      <link rel="canonical" href={process.env.SITE_URL || metadataBase} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
      <title>{defaultTitle ? titleTemplate.replace('%s', defaultTitle as string) : 'The Music Bugle'}</title>
    </Head>
  );
}
