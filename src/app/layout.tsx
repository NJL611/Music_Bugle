import type { Metadata } from 'next';
import './globals.css';
import VisualEditing from '@/components/VisualEditing';
import { draftMode } from 'next/headers';
import { loadQuery } from '../../sanity/lib/store';
import { POSTS_QUERY } from '../../sanity/lib/queries';
import { SanityDocument } from 'next-sanity';
import { Bodoni_Moda, Prata } from 'next/font/google';

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni-moda',
  display: 'swap',
});

const prata = Prata({
  subsets: ['latin'],
  variable: '--font-prata',
  display: 'swap',
  weight: '400',
});

const meta = {
  title: 'The Music Bugle',
  description: 'Your source for the latest music news.',
  image: `${process.env.SITE_URL || 'https://themusicbugle.com'}/og-preview.jpg`,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://themusicbugle.com'),
  title: {
    template: '%s - The Music Bugle',
    default: meta.title,
  },
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: process.env.SITE_URL || 'https://themusicbugle.com',
    locale: 'en-US',
    siteName: meta.title,
    type: 'website',
    images: [
      {
        url: meta.image,
      },
    ],
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    images: meta.image,
    card: 'summary_large_image',
  },
  alternates: {
    canonical: process.env.SITE_URL || 'https://themusicbugle.com',
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch latest posts for the footer
  const initial = await loadQuery<SanityDocument[]>(POSTS_QUERY, {}, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });
  const posts = initial.data || [];

  return (
    <html lang="en">
      <body className={`font-graphiknormal ${bodoniModa.variable} ${prata.variable}`}>
        {children}
        {draftMode().isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
