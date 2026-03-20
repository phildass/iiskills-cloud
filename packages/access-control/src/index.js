/**
 * @iiskills/access-control — Edge-compatible entry point
 *
 * This module provides a single `hasAccess` function that is safe to import
 * in Next.js Edge Middleware (Edge Runtime).  It has zero external dependencies
 * and performs only synchronous, pure logic.
 *
 * Usage in middleware:
 * ```javascript
 * import { hasAccess } from '@iiskills/access-control/src';
 *
 * export function middleware(request) {
 *   const user = parseUserFromCookies(request);
 *   if (user && hasAccess(user)) {
 *     // Allow through — admin bypass
 *   }
 * }
 * ```
 */

/**
 * Determine whether a user should be granted unconditional access.
 *
 * The Infallible Rule — the very first check before ANY other logic:
 *   • `philipda@gmail.com`  — primary product-owner override
 *   • `pda.kenya@gmail.com` — secondary product-owner override
 *   • `is_admin === true`   — any profile/JWT-flagged administrator
 *
 * If this function returns `true` the caller MUST skip all payment redirects
 * and access gates.  No other check is needed.
 *
 * @param {Object|null|undefined} user - Partial user object (email + is_admin are checked).
 *   Passing null/undefined safely returns false.
 * @param {string|null} [user.email] - User email address.
 * @param {boolean|null} [user.is_admin] - Whether user is an administrator.
 * @returns {boolean} `true` when the user has unconditional admin access.
 */
export function hasAccess(user) {
  if (!user) return false;
  if (user.email === "philipda@gmail.com" || user.email === "pda.kenya@gmail.com" || user.is_admin)
    return true;
  return false;
}

/**
 * Parse the Supabase JWT stored in the auth cookie of a Next.js Edge Middleware
 * request and return a minimal user object for use with `hasAccess`.
 *
 * Looks for any cookie whose name matches `sb-*-auth-token` (the Supabase SSR
 * cookie format) and decodes the JWT payload.  The `is_admin` flag is sourced
 * from `app_metadata.is_admin` OR `user_metadata.is_admin` — whichever is set.
 *
 * Returns `null` when no valid Supabase session cookie is present.
 *
 * @param {{ cookies: Iterable<[string, string]> }} request - The NextRequest object.
 * @returns {{ email: string|null, is_admin: boolean }|null}
 */
/* global atob */
export function parseUserFromCookies(request) {
  let accessToken = null;

  for (const [name, value] of request.cookies) {
    if (name.startsWith("sb-") && name.endsWith("-auth-token")) {
      try {
        const parsed = JSON.parse(value);
        accessToken = parsed.access_token ?? null;
      } catch {
        accessToken = value;
      }
      break;
    }
  }

  if (!accessToken) return null;

  try {
    const parts = accessToken.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return {
      email: payload.email ?? null,
      is_admin: payload.app_metadata?.is_admin === true || payload.user_metadata?.is_admin === true,
    };
  } catch {
    return null;
  }
}

/**
 * Check whether the incoming request carries the `iiskills_admin_bypass=true`
 * cookie — a lightweight override that grants admin-level access without
 * requiring a Supabase session.
 *
 * @param {{ cookies: Iterable<[string, string]> | { get?: function } }} request
 * @returns {boolean}
 */
export function hasBypassCookie(request) {
  const cookies = request.cookies;

  // Next.js RequestCookies object exposes a `.get()` method.
  if (typeof cookies.get === "function") {
    const entry = cookies.get("iiskills_admin_bypass");
    return entry?.value === "true";
  }

  // Fallback: iterate [name, value] pairs.
  for (const [name, value] of cookies) {
    if (name === "iiskills_admin_bypass") return value === "true";
  }
  return false;
}

/**
 * Check whether the raw `document.cookie` string (or any semicolon-delimited
 * cookie header string) contains `iiskills_admin_bypass=true`.
 *
 * Use this on the client side (React hooks, browser code) where there is no
 * `NextRequest` object available.
 *
 * @param {string} cookieStr - The raw cookie string, e.g. `document.cookie`.
 * @returns {boolean}
 */
export function hasBypassCookieFromString(cookieStr) {
  return cookieStr.split(";").some((c) => c.trim() === "iiskills_admin_bypass=true");
}
