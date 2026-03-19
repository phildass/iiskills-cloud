/**
 * @iiskills/access-control — Edge-compatible entry point
 *
 * This module provides a single `hasAccess` function that is safe to import
 * in Next.js Edge Middleware (Edge Runtime).  It has zero external dependencies
 * and performs only synchronous, pure logic.
 *
 * Usage in middleware:
 * ```typescript
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
 * Minimal user shape understood by `hasAccess`.
 * Fields are intentionally optional so callers can pass partial JWT payloads.
 *
 * Note on `is_admin`: in a Supabase JWT this flag may appear at
 * `app_metadata.is_admin` (set by admin triggers) or `user_metadata.is_admin`
 * (set at sign-up).  The `parseUserFromCookies` helper reads both locations
 * and merges them into this single field.
 */
export interface AccessUser {
  email?: string | null;
  is_admin?: boolean | null;
}

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
 * @param user - Partial user object (email + is_admin are checked).
 *               Passing null/undefined safely returns false.
 * @returns `true` when the user has unconditional admin access, `false` otherwise.
 */
export function hasAccess(user: AccessUser | null | undefined): boolean {
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
 * @param request - The `NextRequest` object from Edge Middleware.
 * @returns Partial user object or null.
 */
export function parseUserFromCookies(
  request: { cookies: Iterable<[string, string]> }
): AccessUser | null {
  let accessToken: string | null = null;

  for (const [name, value] of request.cookies as Iterable<[string, string]>) {
    if (name.startsWith("sb-") && name.endsWith("-auth-token")) {
      try {
        const parsed = JSON.parse(value) as { access_token?: string };
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
    // atob is available in Edge Runtime and browsers
    // eslint-disable-next-line no-undef
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))) as {
      email?: string;
      app_metadata?: { is_admin?: boolean };
      user_metadata?: { is_admin?: boolean };
    };
    return {
      email: payload.email ?? null,
      is_admin:
        payload.app_metadata?.is_admin === true || payload.user_metadata?.is_admin === true,
    };
  } catch {
    return null;
  }
}
