import type { Metadata } from 'next';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import { SITE_URL, METADATA, GOOGLE_ANALYTICS_ID, GOOGLE_TAG_MANAGER_ID, TERMLY_WEBSITE_UUID, ADSENSE_PUBLISHER_ID } from '@/lib/constants';

import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/Graphik-300-Light.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Graphik-400-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/AbrilFatface-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Prata-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        {ADSENSE_PUBLISHER_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="font-graphiknormal" suppressHydrationWarning>
        {children}
        <Script
          src={`https://app.termly.io/resource-blocker/${TERMLY_WEBSITE_UUID}?autoBlock=on`}
          strategy="afterInteractive"
          data-name="termly-embed-banner"
        />
        {GOOGLE_ANALYTICS_ID && <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />}
        {GOOGLE_TAG_MANAGER_ID && <GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />}
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  ...(ADSENSE_PUBLISHER_ID
    ? { other: { 'google-adsense-account': ADSENSE_PUBLISHER_ID } }
    : {}),
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
