/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,

  // Turbopack configuration for module resolution
  turbopack: {
    resolveAlias: {
      '@shared': path.resolve(__dirname, '../../components/shared'),
      '@components': path.resolve(__dirname, '../../components'),
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    },
  },

  // Webpack configuration for module resolution (for non-Turbopack builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../../components/shared'),
      '@components': path.resolve(__dirname, '../../components'),
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    };
    return config;
  },

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS: process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.iiskills.cloud',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
