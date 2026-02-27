/** @type {import('next').NextConfig} */
const path = require("path");
const { getHeadersConfig } = require("../../config/security-headers");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@iiskills/ui"],

  // ESLint v9 removed useEslintrc/extensions options that Next.js uses internally.
  // Run `yarn lint` separately; do not lint during next build.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Turbopack configuration for module resolution
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname, "../.."),
      "@shared": path.resolve(__dirname, "../../components/shared"),
      "@lib": path.resolve(__dirname, "../../lib"),
      "@utils": path.resolve(__dirname, "../../utils"),
      "@config": path.resolve(__dirname, "../../config"),
    },
  },

  // Webpack configuration for module resolution (for non-Turbopack builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../.."),
      "@shared": path.resolve(__dirname, "../../components/shared"),
      "@lib": path.resolve(__dirname, "../../lib"),
      "@utils": path.resolve(__dirname, "../../utils"),
      "@config": path.resolve(__dirname, "../../config"),
    };
    return config;
  },

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS: process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || "false",
  },

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    return getHeadersConfig(isDev);
  },
};

module.exports = nextConfig;
