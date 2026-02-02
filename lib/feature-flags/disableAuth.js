/**
 * Centralized Authentication Disable Feature Flag
 * 
 * This module provides a single source of truth for whether authentication
 * is disabled across all apps in the monorepo (client + server).
 * 
 * ⚠️ SECURITY WARNING:
 * Enabling this flag exposes all content and APIs publicly without authentication.
 * Only use temporarily for debugging, maintenance, or testing purposes.
 * NEVER enable in production without explicit approval.
 * 
 * Usage:
 * - Set NEXT_PUBLIC_DISABLE_AUTH=true for client-side bypass
 * - Set DISABLE_AUTH=true for server-side bypass
 * - Rebuild apps after changing environment variables
 * 
 * Related PR: feature/disable-auth-temporary
 */

/**
 * Check if auth is disabled on the client side
 * @returns {boolean} True if client-side auth should be bypassed
 */
export const isAuthDisabledClient = () => {
  // NEXT_PUBLIC_* is exposed to client builds
  try {
    return Boolean(
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'
    );
  } catch {
    return false;
  }
};

/**
 * Check if auth is disabled on the server side
 * @returns {boolean} True if server-side auth should be bypassed
 */
export const isAuthDisabledServer = () => {
  // Server-side only - not exposed to client
  try {
    return Boolean(
      typeof process !== 'undefined' &&
      process.env &&
      (process.env.DISABLE_AUTH === 'true' || 
       process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true')
    );
  } catch {
    return false;
  }
};

/**
 * Get a mock user object for use when auth is disabled
 * This allows code that expects a user object to continue working
 * 
 * @returns {Object} Mock user object with bypass credentials
 */
export const getMockUser = () => ({
  id: 'dev-override',
  email: 'dev@iiskills.cloud',
  role: 'bypass',
  user_metadata: {
    firstName: 'Dev',
    lastName: 'Override',
    full_name: 'Dev Override',
    is_admin: true,
    payment_status: 'paid'
  },
  app_metadata: {
    payment_status: 'paid',
    is_admin: true
  }
});

// Log warning if auth is disabled (server-side only to avoid console spam)
if (typeof window === 'undefined' && isAuthDisabledServer()) {
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn('⚠️  AUTHENTICATION DISABLED - TEMPORARY OVERRIDE ACTIVE');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.warn('All authentication and paywall checks are bypassed.');
  console.warn('Content is publicly accessible without login.');
  console.warn('This should ONLY be used for temporary debugging/maintenance.');
  console.warn('To disable: unset DISABLE_AUTH and NEXT_PUBLIC_DISABLE_AUTH');
  console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}
