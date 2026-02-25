import type { Metadata } from 'next';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Suspense } from 'react';
import Script from 'next/script';
import { SITE_URL, METADATA, GOOGLE_ANALYTICS_ID, GOOGLE_TAG_MANAGER_ID, TERMLY_WEBSITE_UUID } from '@/lib/constants';
import TermlyCMP from '@/components/TermlyCMP';

import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://app.termly.io/resource-blocker/${TERMLY_WEBSITE_UUID}?autoBlock=on`}
          strategy="beforeInteractive"
          data-name="termly-embed-banner"
        />
        <link rel="preload" href="/fonts/Graphik-300-Light.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Graphik-400-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/AbrilFatface-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Prata-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className="font-graphiknormal">
        <Suspense fallback={null}>
          <TermlyCMP websiteUUID={TERMLY_WEBSITE_UUID} />
        </Suspense>
        {children}
      </body>
      {GOOGLE_ANALYTICS_ID && <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />}
      {GOOGLE_TAG_MANAGER_ID && <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />}
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s - The Music Bugle',
    default: METADATA.title,
  },
  description: METADATA.description,
  openGraph: {
    title: METADATA.title,
    description: METADATA.description,
    url: SITE_URL,
    locale: 'en-US',
    siteName: METADATA.title,
    type: 'website',
    images: [
      {
        url: METADATA.image,
      },
    ],
  },
  twitter: {
    title: METADATA.title,
    description: METADATA.description,
    images: METADATA.image,
    card: 'summary_large_image',
  },
  alternates: {
    canonical: SITE_URL,
  },
};
