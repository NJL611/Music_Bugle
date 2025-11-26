import type { Metadata } from 'next';
import './globals.css';
import VisualEditing from '@/components/VisualEditing';
import { draftMode } from 'next/headers';
import localFont from 'next/font/local';
const meta = {
  title: 'The Music Bugle',
  description: 'Your source for the latest music news.',
  image: `${process.env.SITE_URL || 'https://themusicbugle.com'}/og-preview.jpg`,
};

const graphik = localFont({
  src: [
    { path: '../../public/fonts/Graphik-300-Light.woff', weight: '300', style: 'normal' },
    { path: '../../public/fonts/Graphik-400-Regular.woff', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Graphik-500-Medium.woff', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Graphik-600-Semibold.woff', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Graphik-700-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-graphik',
  display: 'swap',
});

const abril = localFont({
  src: [{ path: '../../public/fonts/AbrilFatface-Regular.woff', weight: '400', style: 'normal' }],
  variable: '--font-abril',
  display: 'swap',
});

const prata = localFont({
  src: [{ path: '../../public/fonts/Prata-Regular.woff', weight: '400', style: 'normal' }],
  variable: '--font-prata',
  display: 'swap',
});

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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-graphiknormal ${graphik.variable} ${abril.variable} ${prata.variable}`}>
        {children}
        {draftMode().isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
