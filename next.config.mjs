import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Dev-only — Vercel production installs omit devDependencies, so don't import at load time.
const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (config) => config;

// autoCert is disabled by default to avoid URL errors
// To enable: uncomment the import and wrapper below, and ensure you have proper environment variables set
// The error "Invalid URL: An explicit scheme (such as https) must be provided" 
// usually means autoCert needs environment variables with full URLs (including https://)

import autoCert from "anchor-pki/auto-cert/integrations/next";
const withAutoCert = autoCert({
  enabledEnv: "development",
});

// Identity function (no-op) - replace with withAutoCert above when ready
// const withAutoCert = (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/category/trending',
        destination: '/trending',
        permanent: true,
      },
      // Alias known dead paths so they don't become soft-404s.
      {
        source: '/videos',
        destination: '/category/music-videos',
        permanent: true,
      },
      // Old WordPress dated permalinks -> new article path; slugs are identical.
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/article/:slug',
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [65, 75],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    taint: true,
  },
};

// Apply wrappers as needed - can be used separately or together
// To use both: export default withAutoCert(withBundleAnalyzer(nextConfig));
// To use only autoCert: export default withAutoCert(nextConfig);
// To use only bundleAnalyzer: export default withBundleAnalyzer(nextConfig);
export default withAutoCert(withBundleAnalyzer(nextConfig));