import type { Metadata } from 'next';
import { SITE_URL, METADATA } from '@/lib/constants';

import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Graphik-300-Light.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Graphik-400-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/AbrilFatface-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Prata-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className="font-graphiknormal">
        {children}
      </body>
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
