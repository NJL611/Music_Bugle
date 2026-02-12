import bundleAnalyzer from "@next/bundle-analyzer";

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

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [65, 75],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "themusicbugle.com",
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