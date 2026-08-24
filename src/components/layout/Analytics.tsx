'use client';

// Wraps GoogleAnalytics so the Sanity Studio is never tracked.
// Studio routes share the root layout, and their 20-45min authoring sessions
// were ~25% of pageviews and skewed every engagement average on the property.

import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

export function Analytics({ gaId }: { gaId: string }) {
  return usePathname().startsWith('/admin-content') ? null : <GoogleAnalytics gaId={gaId} />;
}
