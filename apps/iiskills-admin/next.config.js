/**
 * Next.js configuration for iiskills-admin
 * Admin Dashboard with Local Content Mode
 */

module.exports = {
  reactStrictMode: true,
  
  // Transpile shared packages if using monorepo packages
  transpilePackages: ['@iiskills/core'],
  
  async rewrites() {
    return [
      // Redirect /admin to / within admin app
      {
        source: '/admin',
        destination: '/',
      },
      {
        source: '/admin/:path*',
        destination: '/:path*',
      },
    ];
  },
  
  async redirects() {
    return [
      // Redirect /admin to root within admin app
      {
        source: '/admin',
        destination: '/',
        permanent: false,
      },
    ];
  },
};
