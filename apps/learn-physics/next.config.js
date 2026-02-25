/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@iiskills/ui'],
  // Prevent webpack from bundling @iiskills/content so __dirname resolves correctly
  webpack: (config, { isServer }) => {
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
