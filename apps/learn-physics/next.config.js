/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@iiskills/ui'],

  // Webpack configuration for module resolution
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../..'),
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    };
    // Keep @iiskills/content external so __dirname resolves to the source
    // directory (packages/content/src/) rather than the webpack output directory.
    // This is required for the fs-based content loading to find course files.
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        '@iiskills/content',
      ];
    }
    return config;
  },
};

module.exports = nextConfig;
