/** @type {import('next').NextConfig} */
const path = require("path");
const { getHeadersConfig } = require("../../packages/config/security-headers");

const nextConfig = {
  reactStrictMode: true,

  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Turbopack configuration for module resolution
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname, "../.."),
      "@lib": path.resolve(__dirname, "../../packages/shared-utils/lib"),
      "@utils": path.resolve(__dirname, "../../packages/shared-utils/utils"),
      "@config": path.resolve(__dirname, "../../packages/config"),
      "@shared": path.resolve(__dirname, "../../packages/shared-components"),
    },
  },

  // Webpack configuration for module resolution (for non-Turbopack builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../.."),
      "@lib": path.resolve(__dirname, "../../packages/shared-utils/lib"),
      "@utils": path.resolve(__dirname, "../../packages/shared-utils/utils"),
      "@config": path.resolve(__dirname, "../../packages/config"),
      "@shared": path.resolve(__dirname, "../../packages/shared-components"),
    };
    return config;
  },

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS:
      process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || "false",
  },

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return getHeadersConfig(isDev);
  },

  async rewrites() {
    return [
      // Rewrite admin subdomain to /admin routes
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin/:path*",
      },
      // Rewrite admin subdomain root to /admin
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin",
      },
    ];
  },
};

module.exports = nextConfig;
