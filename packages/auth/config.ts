/**
 * @iiskills/auth — Centralized Supabase Cookie Configuration
 *
 * Sets `domain: ".iiskills.cloud"` so that auth cookies set on any subdomain
 * (e.g. learn-management.iiskills.cloud) are readable on all other subdomains,
 * allowing the admin session to travel between apps without re-authentication.
 *
 * On localhost the domain is intentionally left undefined so that browser
 * cookies work normally during development.
 *
 * Usage:
 *   import { cookieOptions } from '@iiskills/auth/config';
 *   createBrowserClient(url, key, { cookieOptions });
 */

const isProduction =
  process.env.NODE_ENV === "production" ||
  (typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1");

/**
 * The cookie domain for cross-subdomain session sharing.
 * Resolves to `.iiskills.cloud` in production; undefined on localhost.
 */
export const cookieDomain: string | undefined =
  process.env.NEXT_PUBLIC_COOKIE_DOMAIN || (isProduction ? ".iiskills.cloud" : undefined);

/**
 * Shared Supabase cookie options.
 *
 * domain: ".iiskills.cloud" — wildcard domain so auth cookies are visible on
 *   every *.iiskills.cloud subdomain (learn-ai, learn-management, etc.).
 * path: "/"                 — cookie is valid for all paths on the domain.
 */
export const cookieOptions = {
  ...(cookieDomain ? { domain: cookieDomain } : {}),
  path: "/",
  secure: isProduction,
  sameSite: "lax" as const,
};
