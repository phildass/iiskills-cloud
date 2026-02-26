/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@iiskills/ui"],

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
};

module.exports = nextConfig;
