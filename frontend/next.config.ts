import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set the workspace root explicitly to avoid lockfile detection warnings
  // This tells Next.js where the monorepo root is located
  outputFileTracingRoot: path.join(__dirname, "../"),

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Production build settings
  typescript: {
    // Enable type checking in production for better quality
    ignoreBuildErrors: false,
  },
  eslint: {
    // Temporarily ignore @typescript-eslint/no-explicit-any warnings during builds
    // These are not runtime errors, just type annotations
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Use only webp for better transparency support (avif can have issues with alpha channel)
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    // Disable optimization for local images to preserve transparency
    unoptimized: false,
  },

  // Enable React strict mode for better development
  reactStrictMode: true,

  // Experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
