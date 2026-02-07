/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS: process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.iiskills.cloud',
      },
    ],
  },
};

module.exports = nextConfig;
