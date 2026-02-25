/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@iiskills/ui'],

  // Webpack configuration for module resolution and server externals
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../..'),
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    };
    // Prevent webpack from bundling @iiskills/content so __dirname resolves correctly
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
