/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
  },
  // Ensure standalone output for deployment
  output: "standalone",
};

module.exports = nextConfig;
