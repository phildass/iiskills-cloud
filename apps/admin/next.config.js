/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@iiskills/ui'],
  basePath: '/admin',

  // Webpack configuration for module resolution
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../..'),
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    };
    return config;
  },
};

module.exports = nextConfig;
