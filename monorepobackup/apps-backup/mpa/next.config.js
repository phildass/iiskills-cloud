/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
