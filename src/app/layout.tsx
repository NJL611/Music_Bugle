import type { Metadata } from 'next';
import Script from 'next/script';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import { GoogleTagManager } from '@next/third-parties/google';
import { SITE_URL, METADATA, GOOGLE_ANALYTICS_ID, GOOGLE_TAG_MANAGER_ID, ADSENSE_PUBLISHER_ID } from '@/lib/constants';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';
import { Analytics } from '@/components/layout/Analytics';

import './styles.css';

// Root layout: fonts, Consent Mode defaults, AdSense loader, analytics, and Studio visual editing.
// Script order is load-bearing — the consent defaults must run before any Google tag.

// EEA + UK + Switzerland: where Google's CMP (AdSense Privacy & messaging, loaded by adsbygoogle.js) asks for consent.
const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
  'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];
const CONSENT_TYPES = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];
const consent = (value: string, extra = {}) =>
  JSON.stringify({ ...Object.fromEntries(CONSENT_TYPES.map((t) => [t, value])), ...extra });
// Denied where the CMP asks, granted elsewhere — US law doesn't require opt-in, and a global deny hid most US readers from GA.
const CONSENT_DEFAULTS_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',${consent('denied', { region: CONSENT_REGIONS, wait_for_update: 500 })});
gtag('consent','default',${consent('granted')});`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDraft = (await draftMode()).isEnabled;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/Graphik-300-Light.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Graphik-400-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/AbrilFatface-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Prata-Regular.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className="font-graphiknormal" suppressHydrationWarning>
        {/* beforeInteractive runs these one by one in placement order, before hydration: the consent defaults must land before the trackers. */}
        <Script id="consent-defaults" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }} />
        {ADSENSE_PUBLISHER_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        <OrganizationJsonLd />
        {children}
        {/* Presentation's iframe can land on any route (its initial URL is the homepage), and every
            page it shows must answer the handshake or the Studio reports "Unable to connect".
            draftMode() here does not opt static pages into dynamic rendering — readers never get this. */}
        {isDraft && <VisualEditing />}
        {/* Draft mode means Presentation's iframe or /preview — authoring, not readers. */}
        {GOOGLE_ANALYTICS_ID && !isDraft && <Analytics gaId={GOOGLE_ANALYTICS_ID} />}
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
  // No root canonical: every page inherits it, and pages without their own were canonicalizing to the homepage.
};
