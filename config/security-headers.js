/**
 * Production Security Headers Configuration
 * 
 * This configuration adds essential security headers to protect against:
 * - XSS attacks
 * - Clickjacking
 * - MIME-type sniffing
 * - Information disclosure
 * - Man-in-the-middle attacks
 * 
 * Usage: Import and use in next.config.js headers() function
 */

const securityHeaders = [
  {
    // Prevent XSS attacks
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Prevent clickjacking attacks
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    // Prevent MIME-type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Referrer policy - balance privacy with functionality
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Force HTTPS in production
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    // Permissions Policy (formerly Feature-Policy)
    // Disable unnecessary browser features
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), payment=(self)'
  },
  {
    // Content Security Policy
    // NOTE: This is a baseline. Adjust based on your app's requirements.
    // Start with report-only mode in production to avoid breaking functionality
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://translate.google.com https://translate.googleapis.com https://checkout.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com https://ssl.gstatic.com https://checkout.razorpay.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com wss://*.supabase.co https://translate.googleapis.com https://translate-pa.googleapis.com https://translate.google.com",
      "frame-src 'self' https://api.razorpay.com https://www.google.com https://translate.google.com https://translate.googleapis.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

/**
 * Get security headers for Next.js config
 * @param {boolean} isDevelopment - Whether running in development mode
 * @returns {Array} Array of header configurations
 */
function getSecurityHeaders(isDevelopment = false) {
  // In development, we might want to relax some headers
  if (isDevelopment) {
    return securityHeaders.filter(header => 
      // Remove HSTS in development (not using HTTPS locally)
      header.key !== 'Strict-Transport-Security'
    );
  }
  
  return securityHeaders;
}

/**
 * Get headers configuration for Next.js
 * Apply security headers to all routes
 */
function getHeadersConfig(isDevelopment = false) {
  return [
    {
      // Apply to all routes
      source: '/:path*',
      headers: getSecurityHeaders(isDevelopment)
    },
    {
      // Additional headers for API routes
      source: '/api/:path*',
      headers: [
        ...getSecurityHeaders(isDevelopment),
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow'
        }
      ]
    }
  ];
}

module.exports = {
  securityHeaders,
  getSecurityHeaders,
  getHeadersConfig
};
