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
 * Canonical URL for the centralised user dashboard on the main site.
 * All sub-apps (learn-ai, learn-pr, learn-developer, …) must link here
 * instead of using a relative `/dashboard` path that does not exist in those apps.
 */
export const DASHBOARD_URL = "https://iiskills.cloud/dashboard";

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
export function parseUserFromCookies(request: {
  cookies: Iterable<[string, string]>;
}): AccessUser | null {
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
      is_admin: payload.app_metadata?.is_admin === true || payload.user_metadata?.is_admin === true,
    };
  } catch {
    return null;
  }
}

/** Cookie container accepted by `hasBypassCookie` — either an iterable of
 *  `[name, value]` pairs or a Next.js `RequestCookies` object with `.get()`. */
type CookieContainer =
  | Iterable<[string, string]>
  | { get?: (name: string) => { value: string } | undefined };

/**
 * Check whether the incoming request carries the `iiskills_admin_bypass=true`
 * cookie — a lightweight override that grants admin-level access without
 * requiring a Supabase session.
 *
 * This is intentionally separate from `hasAccess` / `parseUserFromCookies` so
 * that middleware can gate on it before attempting JWT decoding.
 *
 * @param request - Any object exposing a `cookies` property iterable as
 *   `[name, value]` pairs (Next.js `NextRequest` satisfies this).
 * @returns `true` when the bypass cookie is present and set to `"true"`.
 */
export function hasBypassCookie(request: { cookies: CookieContainer }): boolean {
  const cookies = request.cookies as CookieContainer;

  // Next.js RequestCookies object exposes a `.get()` method.
  if (typeof (cookies as { get?: unknown }).get === "function") {
    const entry = (cookies as { get: (name: string) => { value: string } | undefined }).get(
      "iiskills_admin_bypass"
    );
    return entry?.value === "true";
  }

  // Fallback: iterate [name, value] pairs (used in tests / plain objects).
  for (const [name, value] of cookies as Iterable<[string, string]>) {
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
 * @param cookieStr - The raw cookie string, e.g. `document.cookie`.
 * @returns `true` when the bypass cookie is present and set to `"true"`.
 */
export function hasBypassCookieFromString(cookieStr: string): boolean {
  return cookieStr.split(";").some((c) => c.trim() === "iiskills_admin_bypass=true");
}

/**
 * @iiskills/access-control - Edge-safe TypeScript entry
 *
 * Exports the `checkUserAccess` infallible access function and shared types.
 * Safe for use in Next.js Edge Middleware - no Node.js APIs, no database calls.
 *
 * All sub-apps import `checkUserAccess` from here (via the main package export
 * or directly from this source in TypeScript projects).
 */

// Types

/** A single app-entitlement record, as stored in the Supabase JWT app_metadata. */
export interface AppEntitlement {
  app_id: string;
  is_active: boolean;
}

/**
 * Minimal user shape required by checkUserAccess.
 * Matches what Next.js middleware can read from the Supabase session JWT.
 */
export interface AccessUser {
  /** True when the user has the admin role in Supabase app_metadata. */
  is_admin?: boolean;
  /** User's email address, used for the product-owner bypass. */
  email?: string;
  /** Active entitlement records embedded in the JWT app_metadata. */
  app_entitlements?: AppEntitlement[];
}

/** Success result - access is allowed. */
export interface AccessAllowed {
  allowed: true;
  reason: "ADMIN_BYPASS" | "PAID_ACCESS" | "FREE_APP";
}

/** Denial result - middleware must redirect to `redirectTo`. */
export interface AccessDenied {
  allowed: false;
  /** Relative path on the main site to redirect to, e.g. '/enrol'. */
  redirectTo: string;
}

export type AccessResult = AccessAllowed | AccessDenied;

// Master-key access function

/**
 * Infallible access check - safe for Next.js Edge Middleware.
 *
 * Priority:
 *  1. Free apps  -> always allowed (no auth / payment required).
 *  2. Admin bypass -> `user.is_admin === true` OR email is in PRODUCT_OWNER_EMAILS.
 *     This is the "Master Key" that every app honours.
 *  3. Paid access -> user has an active app_entitlement for `app_id`.
 *  4. Denied      -> redirect to '/enrol' on the main site.
 *
 * @param user   - User object from the Supabase session (null = unauthenticated).
 * @param app_id - App identifier, e.g. `'learn-management'`.
 */
export function checkUserAccess(user: AccessUser | null | undefined, app_id: string): AccessResult {
  // Priority 1 - free apps are always accessible
  if (isFreeApp(app_id)) return { allowed: true, reason: "FREE_APP" };

  // Priority 2 - admin / product-owner master key
  // Uses the PRODUCT_OWNER_EMAILS constant so both checkAccess and
  // checkUserAccess always bypass the same set of accounts.
  if (user?.is_admin || (user?.email != null && PRODUCT_OWNER_EMAILS.includes(user.email))) {
    return { allowed: true, reason: "ADMIN_BYPASS" };
  }

  // Priority 3 - active paid entitlement
  const hasAccess = (user?.app_entitlements ?? []).some((e) => e.app_id === app_id && e.is_active);
  if (hasAccess) return { allowed: true, reason: "PAID_ACCESS" };

  // Denied - send to enrollment page on main site
  return { allowed: false, redirectTo: "/enrol" };
}

// Re-exports (pure, Edge-safe functions from sibling JS modules)

export {
  isFreeApp,
  isBundleApp,
  requiresPayment,
  userHasAccess,
  checkAccess,
  getBundleInfo,
  getAppsToUnlock,
  getAccessStatus,
  hasAccessViaBundle,
  getBundleAccessMessage,
  APPS,
  APP_TYPE,
  BUNDLES,
  PRODUCT_OWNER_EMAILS,
  // @ts-expect-error JS modules lack full TS declarations
} from "../accessControl.js";

export {
  getFreeApps,
  getPaidApps,
  getAppConfig,
  getBundleConfig,
  // @ts-expect-error JS modules lack full TS declarations
} from "../appConfig.js";
