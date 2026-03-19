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
