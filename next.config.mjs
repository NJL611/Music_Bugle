// Next config: redirects (www -> bare, legacy aliases), image hosts, dev-only headers and wrappers.
// Legacy WordPress permalinks are NOT here — src/proxy.ts owns them via the slug map.

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
  // A stray package-lock.json in ~/Documents/GitHub makes Next infer the wrong workspace root.
  turbopack: {
    root: import.meta.dirname,
  },
  // Next 16 blocks cross-origin dev assets; needed for on-device testing via LAN IP.
  allowedDevOrigins: ["192.168.1.160", "192.168.1.*"],
  // Brave iOS reuses dev CSS/JS across edits (stable chunk URLs); forbid storing in dev.
  async headers() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
  // Old WordPress dated permalinks are handled in src/proxy.ts (slug map); redirects here would shadow it.
  async redirects() {
    return [
      // www serves the same pages; canonicals already point at the bare domain, this makes it one host.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.themusicbugle.com' }],
        destination: 'https://themusicbugle.com/:path*',
        permanent: true,
      },
      {
        source: '/category/trending',
        destination: '/trending',
        permanent: true,
      },
    ];
  },
  images: {
    qualities: [65, 75],
    minimumCacheTTL: 2678400,
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