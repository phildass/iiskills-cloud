/** @type {import('next').NextConfig} */
const path = require("path");
const { getHeadersConfig } = require("../../packages/config/security-headers");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@iiskills/ui"],

  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Turbopack configuration for module resolution
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname, "../.."),
      "@shared": path.resolve(__dirname, "../../packages/shared-components"),
      "@lib": path.resolve(__dirname, "../../packages/shared-utils/lib"),
      "@utils": path.resolve(__dirname, "../../packages/shared-utils/utils"),
      "@config": path.resolve(__dirname, "../../packages/config"),
    },
  },

  // Webpack configuration for module resolution (for non-Turbopack builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../.."),
      "@shared": path.resolve(__dirname, "../../packages/shared-components"),
      "@lib": path.resolve(__dirname, "../../packages/shared-utils/lib"),
      "@utils": path.resolve(__dirname, "../../packages/shared-utils/utils"),
      "@config": path.resolve(__dirname, "../../packages/config"),
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
};

module.exports = nextConfig;
