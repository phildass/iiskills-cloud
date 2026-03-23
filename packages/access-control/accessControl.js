/**
 * Universal Access Control API
 *
 * This module provides the core access control functions that all apps
 * must use to determine user access, enforce payment requirements, and
 * handle bundle logic.
 *
 * @module accessControl
 */

import {
  APPS,
  APP_TYPE,
  BUNDLES,
  getFreeApps,
  getAppConfig,
  getBundleConfig,
} from "./appConfig.js";

/**
 * Designated product-owner email addresses that receive unconditional access to
 * all paid apps, regardless of payment or entitlement records.
 *
 * Referenced by both checkAccess() and checkUserAccess() so the bypass set
 * is always in sync.  Update this list — and inform the team — before adding
 * or removing any email.
 *
 * @type {readonly string[]}
 */
export const PRODUCT_OWNER_EMAILS = Object.freeze(["philipda@gmail.com", "pda.kenya@gmail.com"]);

/**
 * Centralised admin-bypass predicate — the single source of truth for
 * "HIGH-VALUE ADMIN MODE: UNRESTRICTED ACCESS ACTIVE".
 *
 * Returns `true` when ALL of the following are satisfied:
 *   1. `user` is not null/undefined.
 *   2. The user carries admin status via `is_admin === true` (Supabase JWT /
 *      legacy profile flag) OR `role === "admin"` (newer role-based model).
 *   3. The user has NOT been explicitly restricted (`unrestricted !== false`).
 *      When the `unrestricted` field is absent the user is treated as
 *      unrestricted — preserving backward-compatibility with existing admin
 *      accounts that pre-date the field.
 *
 * All access-gate functions in this module (`hasAccess`, `checkAccess`,
 * `checkUserAccess`, `userHasAccess`) call this function first so the bypass
 * logic is **never** duplicated across the codebase.
 *
 * @param {{ is_admin?: boolean|null, role?: string|null, unrestricted?: boolean|null }|null|undefined} user
 * @returns {boolean}
 *
 * @example
 * import { isUnrestrictedAdmin } from '@iiskills/access-control';
 *
 * // React access guard — frontend
 * function RequireAccess({ children }) {
 *   const { user } = useAuth();
 *   if (isUnrestrictedAdmin(user)) return children; // admin bypass
 *   if (!user?.entitlements?.includes(appId)) return <PaywallPrompt />;
 *   return children;
 * }
 *
 * // API middleware — backend
 * function authorize(req, res, next) {
 *   const user = req.user;
 *   if (isUnrestrictedAdmin(user)) return next(); // admin bypass
 *   if (!userHasEntitlement(user, req.appId)) return res.status(403).end();
 *   return next();
 * }
 */
export function isUnrestrictedAdmin(user) {
  if (!user) return false;
  // Support both the Supabase JWT `is_admin` boolean flag and the newer `role`
  // string field so callers do not have to normalise before calling.
  const isAdmin = user.is_admin === true || user.role === "admin";
  if (!isAdmin) return false;
  // `unrestricted` defaults to true when not set (backward-compatible).
  // An admin can be explicitly restricted by setting unrestricted: false.
  return user.unrestricted !== false;
}

/**
 * Check if an app is free
 *
 * Free apps never require payment or authentication.
 *
 * @param {string} appId - App identifier (e.g., 'learn-ai', 'learn-math')
 * @returns {boolean} True if app is free
 *
 * @example
 * if (isFreeApp('learn-math')) {
 *   // Grant access immediately
 * }
 */
export function isFreeApp(appId) {
  const app = APPS[appId];
  if (!app) {
    console.warn(`isFreeApp: Unknown app "${appId}"`);
    return false;
  }
  return app.type === APP_TYPE.FREE;
}

/**
 * Check if an app is part of a bundle
 *
 * Bundled apps unlock together - purchasing one unlocks all apps in the bundle.
 *
 * @param {string} appId - App identifier
 * @returns {boolean} True if app is in a bundle
 *
 * @example
 * if (isBundleApp('learn-ai')) {
 *   // This app is part of the AI-Developer bundle
 *   // Purchasing it will unlock learn-developer as well
 * }
 */
export function isBundleApp(appId) {
  const app = APPS[appId];
  if (!app) {
    console.warn(`isBundleApp: Unknown app "${appId}"`);
    return false;
  }
  return app.bundleId !== null;
}

/**
 * Check if an app requires payment
 *
 * Returns true for all paid apps (regardless of bundle status).
 * Returns false for free apps.
 *
 * @param {string} appId - App identifier
 * @returns {boolean} True if app requires payment
 *
 * @example
 * if (requiresPayment('learn-developer')) {
 *   // Show payment flow
 * } else {
 *   // Grant free access
 * }
 */
export function requiresPayment(appId) {
  const app = APPS[appId];
  if (!app) {
    console.warn(`requiresPayment: Unknown app "${appId}"`);
    return true; // Fail closed - require payment for unknown apps
  }
  return app.type === APP_TYPE.PAID;
}

/**
 * Get bundle information for an app
 *
 * Returns null if app is not in a bundle.
 *
 * @param {string} appId - App identifier
 * @returns {Object|null} Bundle configuration with all apps in the bundle
 *
 * @example
 * const bundle = getBundleInfo('learn-ai');
 * // Returns: { id: 'ai-developer-bundle', apps: ['learn-ai', 'learn-developer'], ... }
 */
export function getBundleInfo(appId) {
  const app = APPS[appId];
  if (!app || !app.bundleId) {
    return null;
  }
  return getBundleConfig(app.bundleId);
}

/**
 * Get all apps that should be unlocked when purchasing a specific app
 *
 * If app is in a bundle, returns all apps in the bundle.
 * Otherwise, returns just the app itself.
 *
 * @param {string} appId - App identifier
 * @returns {string[]} Array of app IDs to unlock
 *
 * @example
 * const appsToUnlock = getAppsToUnlock('learn-ai');
 * // Returns: ['learn-ai', 'learn-developer'] (both apps in bundle)
 *
 * const appsToUnlock = getAppsToUnlock('learn-management');
 * // Returns: ['learn-management'] (not in a bundle)
 */
export function getAppsToUnlock(appId) {
  // Allow a bundle ID to be passed directly (e.g. 'ai-developer-bundle' →
  // ['learn-ai', 'learn-developer']).  This covers the payment flow where the
  // purchased item is identified by its bundle ID rather than an individual app ID.
  const directBundle = getBundleConfig(appId);
  if (directBundle) {
    return [...directBundle.apps];
  }

  // Standard case: app belongs to a bundle
  const bundle = getBundleInfo(appId);
  if (bundle) {
    return [...bundle.apps];
  }
  return [appId];
}

/**
 * Check if user has access to an app
 *
 * This is the main access control function that considers:
 * 1. Free apps (always accessible)
 * 2. User authentication
 * 3. Payment verification
 * 4. Bundle logic
 *
 * @param {Object|null} user - User object with app access records
 * @param {string} user.id - User ID
 * @param {Array} user.app_access - Array of app access records from user_app_access table
 * @param {string} appId - App identifier
 * @returns {boolean} True if user has access
 *
 * @example
 * // User object should include app_access from database:
 * const user = {
 *   id: 'uuid',
 *   app_access: [
 *     { app_id: 'learn-ai', is_active: true, expires_at: null },
 *     { app_id: 'learn-developer', is_active: true, granted_via: 'bundle' }
 *   ]
 * };
 *
 * if (userHasAccess(user, 'learn-ai')) {
 *   // Grant access
 * }
 */
export function userHasAccess(user, appId) {
  // Check 1: Free apps are always accessible
  if (isFreeApp(appId)) {
    return true;
  }

  // Check 2: Paid apps require authentication
  if (!user || !user.id) {
    return false;
  }

  // Check 3: Owner override — these two accounts always have unconditional access.
  // This fires BEFORE any subscription or payment-record look-ups so neither DB
  // table (entitlements / user_app_access) is ever queried for the owner.
  if (user.email === "philipda@gmail.com" || user.email === "pda.kenya@gmail.com") {
    return true;
  }

  // Check 4: Admin users have unrestricted access to all content.
  // Delegates to isUnrestrictedAdmin() — the single source of truth — so the
  // bypass logic is never duplicated across access-control functions.
  if (isUnrestrictedAdmin(user)) {
    return true;
  }

  // Check 5: Look for active subscription/payment access record
  if (!user.app_access || !Array.isArray(user.app_access)) {
    return false;
  }

  const accessRecord = user.app_access.find(
    (record) => record.app_id === appId && record.is_active === true
  );

  if (!accessRecord) {
    return false;
  }

  // Check 5a: Verify not expired
  if (accessRecord.expires_at) {
    const now = new Date();
    const expiresAt = new Date(accessRecord.expires_at);
    if (now > expiresAt) {
      return false;
    }
  }

  return true;
}

/**
 * Universal access check — returns a result object rather than a plain boolean.
 *
 * Priority hierarchy (mirrors userHasAccess but returns structured result):
 *  1. Admin bypass — user.is_admin === true OR user.email is a designated admin address.
 *     These users always receive { granted: true } as the very first check.
 *  2. Free app — accessible to everyone.
 *  3. Authenticated paid/entitled user — active access record exists.
 *  4. No access.
 *
 * @param {Object|null} user  - User profile object.
 * @param {string}      appId - App identifier (e.g. 'learn-ai').
 * @returns {{ granted: boolean, reason?: string }}
 */
export function checkAccess(user, appId) {
  // ── Priority 1: Admin bypass ──────────────────────────────────────────────
  // Delegates to hasAccess() — the single source of truth — which combines
  // product-owner email overrides and isUnrestrictedAdmin() in one call.
  // Admins are never redirected to the payment page.
  if (hasAccess(user)) return { granted: true };

  // ── Priority 2: Free apps ─────────────────────────────────────────────────
  if (isFreeApp(appId)) return { granted: true };

  // ── Priority 3: Authenticated paid user ──────────────────────────────────
  if (!user || !user.id) return { granted: false, reason: "unauthenticated" };

  if (userHasAccess(user, appId)) return { granted: true };

  // ── No access ─────────────────────────────────────────────────────────────
  return { granted: false, reason: "not_entitled" };
}

/**
 * Get access status for a user across all apps
 *
 * Returns comprehensive access information including:
 * - Which apps user has access to
 * - Which apps were unlocked via bundles
 * - Bundle information
 *
 * @param {Object|null} user - User object with app access records
 * @returns {Object} Access status object
 *
 * @example
 * const status = getAccessStatus(user);
 * // Returns:
 * // {
 * //   freeApps: ['learn-math', 'learn-physics', ...],
 * //   accessibleApps: ['learn-ai', 'learn-developer', ...],
 * //   bundleAccess: {
 * //     'ai-developer-bundle': {
 * //       apps: ['learn-ai', 'learn-developer'],
 * //       purchasedApp: 'learn-ai',
 * //       unlockedApps: ['learn-developer']
 * //     }
 * //   }
 * // }
 */
export function getAccessStatus(user) {
  const freeApps = getFreeApps();
  const accessibleApps = [...freeApps];
  const bundleAccess = {};

  if (user && user.app_access && Array.isArray(user.app_access)) {
    // Get all active paid app access
    const activeAccess = user.app_access.filter((record) => {
      if (!record.is_active) return false;

      // Check expiration
      if (record.expires_at) {
        const now = new Date();
        const expiresAt = new Date(record.expires_at);
        if (now > expiresAt) return false;
      }

      return true;
    });

    // Add paid apps to accessible list
    activeAccess.forEach((record) => {
      if (!accessibleApps.includes(record.app_id)) {
        accessibleApps.push(record.app_id);
      }

      // Track bundle information
      const app = APPS[record.app_id];
      if (app && app.bundleId) {
        if (!bundleAccess[app.bundleId]) {
          const bundle = getBundleConfig(app.bundleId);
          bundleAccess[app.bundleId] = {
            id: app.bundleId,
            name: bundle.name,
            apps: bundle.apps,
            purchasedApp: record.granted_via === "payment" ? record.app_id : null,
            unlockedApps: [],
          };
        }

        if (record.granted_via === "bundle") {
          bundleAccess[app.bundleId].unlockedApps.push(record.app_id);
        } else if (record.granted_via === "payment") {
          bundleAccess[app.bundleId].purchasedApp = record.app_id;
        }
      }
    });
  }

  return {
    freeApps,
    accessibleApps,
    bundleAccess,
    totalAccess: accessibleApps.length,
  };
}

/**
 * Check if user has access via bundle
 *
 * @param {Object|null} user - User object with app access records
 * @param {string} appId - App identifier
 * @returns {boolean} True if user has this app via bundle unlock
 */
export function hasAccessViaBundle(user, appId) {
  if (!user || !user.app_access || !Array.isArray(user.app_access)) {
    return false;
  }

  const accessRecord = user.app_access.find(
    (record) =>
      record.app_id === appId && record.is_active === true && record.granted_via === "bundle"
  );

  return !!accessRecord;
}

/**
 * Get congratulatory message for bundle access
 *
 * @param {string} appId - App identifier the user is accessing
 * @param {string} purchasedAppId - App identifier that was originally purchased
 * @returns {string} Congratulatory message
 */
export function getBundleAccessMessage(appId, purchasedAppId) {
  const bundle = getBundleInfo(appId);
  if (!bundle) {
    return "";
  }

  const currentApp = getAppConfig(appId);
  const purchasedApp = getAppConfig(purchasedAppId);

  if (!currentApp || !purchasedApp) {
    return `🎉 You have bundle access to ${appId}!`;
  }

  return `🎉 Congratulations! You unlocked ${currentApp.name} by purchasing ${purchasedApp.name}. Enjoy your ${bundle.name}!`;
}

/**

 * Determine whether a user should be granted unconditional access.
 *
 * The Infallible Rule — this is the very first check that must be applied
 * before ANY other access logic in every sub-app middleware and hook:
 *   • `philipda@gmail.com`  — primary product-owner override
 *   • `pda.kenya@gmail.com` — secondary product-owner override
 *   • `is_admin === true`   — any profile/JWT-flagged administrator
 *
 * If this function returns `true`, the caller MUST skip all payment redirects
 * and access gates without further evaluation.
 *
 * @param {{ email?: string|null, is_admin?: boolean|null }} user - Partial user
 *   object.  Only `email` and `is_admin` are inspected; all other fields are
 *   ignored so callers may pass raw JWT payloads.
 * @returns {boolean} `true` when the user has unconditional admin access.
 *
 * @example
 * import { hasAccess } from '@iiskills/access-control';
 *
 * // In Next.js Edge Middleware:
 * const user = parseUserFromCookies(request);
 * if (user && hasAccess(user)) {
 *   // Admin bypass — do not redirect to /payment
 * }
 */
export function hasAccess(user) {
  if (!user) return false;
  // Product-owner email override (unconditional regardless of admin flag).
  if (user.email === "philipda@gmail.com" || user.email === "pda.kenya@gmail.com") return true;
  // Delegate admin check to the central isUnrestrictedAdmin predicate.
  return isUnrestrictedAdmin(user);
}

/**
 * Infallible access check — Edge Middleware safe (no DB calls).
 *
 * "Master Key" priority order:
 *  1. Free app          → always allowed.
 *  2. Admin bypass      → `user.is_admin === true` OR `user.email === 'philipda@gmail.com'`.
 *  3. Paid entitlement  → active record in user.app_entitlements for app_id.
 *  4. Denied            → redirect to '/enrol'.
 *
 * @param {Object|null} user
 * @param {boolean}  [user.is_admin]
 * @param {string}   [user.email]
 * @param {Array}    [user.app_entitlements]  - [{ app_id, is_active }]
 * @param {string} app_id
 * @returns {{ allowed: true, reason: string } | { allowed: false, redirectTo: string }}
 */
export function checkUserAccess(user, app_id) {
  // Free apps are always accessible
  if (isFreeApp(app_id)) return { allowed: true, reason: "FREE_APP" };

  // Master Key: delegates to hasAccess() — the single source of truth — which
  // combines product-owner email overrides and isUnrestrictedAdmin() in one call.
  if (user != null && hasAccess(user)) {
    return { allowed: true, reason: "ADMIN_BYPASS" };
  }

  // Paid entitlement check (uses app_entitlements from Supabase JWT app_metadata)
  const hasAccess = (user?.app_entitlements ?? []).some((e) => e.app_id === app_id && e.is_active);
  if (hasAccess) return { allowed: true, reason: "PAID_ACCESS" };

  return { allowed: false, redirectTo: "/enrol" };
}

// Export all constants
export { APPS, APP_TYPE, BUNDLES };
