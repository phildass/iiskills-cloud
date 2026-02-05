/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async rewrites() {
    return [
      // Rewrite admin subdomain to /admin routes
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin/:path*",
      },
      // Rewrite admin subdomain root to /admin
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin",
      },
    ];
  },
};

module.exports = nextConfig;
