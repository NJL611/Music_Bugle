// robots.txt: keeps search + AdSense crawlers, blocks AI-training bots hammering the
// 800+ article archive (a Vercel bill driver). Advisory only — hard-block via Vercel Firewall.
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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', disallow: ['/api/', '/admin-content/', '/preview/', '/search'] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, disallow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
