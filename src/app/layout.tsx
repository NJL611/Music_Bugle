import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import VisualEditing from '@/components/VisualEditing';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { draftMode } from 'next/headers';


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


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        {children}
        {draftMode().isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
