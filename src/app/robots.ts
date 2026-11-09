// robots.txt: keeps search + AdSense crawlers, blocks AI-training and backlink-SEO bots hammering
// the 800+ article archive (a Vercel bill driver). Advisory only — hard-block via Vercel Firewall.
import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

const AI_CRAWLERS = [
  'GPTBot',
  'CCBot',
  'Bytespider',
  'ClaudeBot',
  'Amazonbot',
  'meta-externalagent',
  'PerplexityBot',
  'Applebot-Extended',
  'Google-Extended',
];

// Third-party backlink indexers: ~5k requests a day between them (Firewall, 2026-11-08), no readers sent.
const SEO_CRAWLERS = ['AhrefsBot', 'SERankingBacklinksBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', disallow: ['/api/', '/admin-content/', '/preview/', '/search'] },
      ...[...AI_CRAWLERS, ...SEO_CRAWLERS].map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
