const path = require("path");
const { getHeadersConfig } = require("./config/security-headers");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  turbopack: {
    root: __dirname,
  },

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS: process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false',
  },

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return getHeadersConfig(isDev);
  },

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
