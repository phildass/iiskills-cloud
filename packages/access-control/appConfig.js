/**
 * App Configuration
 *
 * Centralized definition of all apps, their pricing models, and bundle relationships.
 * This is the single source of truth for app access control.
 *
 * @module appConfig
 */

/**
 * App type constants
 */
export const APP_TYPE = {
  FREE: "free",
  PAID: "paid",
};

/**
 * Bundle definitions
 * Apps within a bundle are unlocked together when any app in the bundle is purchased
 */
export const BUNDLES = {
  "ai-developer-bundle": {
    id: "ai-developer-bundle",
    name: "AI + Developer Bundle",
    description: "Learn AI and Learn Developer - Two Apps for the Price of One",
    apps: ["learn-ai", "learn-developer"],
    price: {
      introductory: 11682, // Rs 116.82 (Rs 99 + 18% GST) in paisa
      regular: 35282, // Rs 352.82 (Rs 299 + 18% GST) in paisa
    },
    features: [
      "Complete Learn AI course access",
      "Complete Learn Developer course access",
      "Shared progress tracking",
      "Universal certification",
      "Mentor Mode unlock at 30% completion",
    ],
    highlight: "🎉 Special Offer: Get BOTH courses for the price of one!",
  },
};

/**
 * All apps in the iiskills.cloud ecosystem
 *
 * Properties:
 * - id: Unique app identifier
 * - name: Display name
 * - type: 'free' or 'paid'
 * - bundleId: Bundle this app belongs to (null if not in a bundle)
 * - price: Default pricing if not in a bundle
 */
// ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
// Payment / paywall system has been intentionally DISABLED.
// All previously-paid apps are temporarily marked as FREE.
//
// DO NOT re-enable payments by simply changing the type back to APP_TYPE.PAID.
// When payments are re-introduced this entire section MUST be rebuilt from
// scratch with fresh security review, user acceptance testing, and stakeholder
// sign-off before going live.  The old payment logic is preserved (commented)
// in the lesson pages and payment API routes as reintroduction markers.
//
// Reintroduction checklist (non-exhaustive):
//   1. Re-evaluate pricing and bundle structure
//   2. Rebuild payment gateway integration (Razorpay / alternative)
//   3. Re-implement entitlement granting and cache invalidation
//   4. Full security audit of payment API routes
//   5. User acceptance testing on staging before production deploy
//   6. Legal / tax compliance review
// ─────────────────────────────────────────────────────────────────────────────
export const APPS = {
  "learn-ai": {
    id: "learn-ai",
    name: "Learn-AI",
    // PAYMENT_STUB: was APP_TYPE.PAID — see reintroduction checklist above
    type: APP_TYPE.FREE,
    bundleId: null, // PAYMENT_STUB: was "ai-developer-bundle"
    price: null,
  },
  "learn-apt": {
    id: "learn-apt",
    name: "Learn-Apt",
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  "learn-chemistry": {
    id: "learn-chemistry",
    name: "Learn-Chemistry",
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  "learn-developer": {
    id: "learn-developer",
    name: "Learn-Developer",
    // PAYMENT_STUB: was APP_TYPE.PAID — see reintroduction checklist above
    type: APP_TYPE.FREE,
    bundleId: null, // PAYMENT_STUB: was "ai-developer-bundle"
    price: null,
  },
  "learn-geography": {
    id: "learn-geography",
    name: "Learn-Geography",
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  "learn-management": {
    id: "learn-management",
    name: "Learn-Management",
    // PAYMENT_STUB: was APP_TYPE.PAID — see reintroduction checklist above
    type: APP_TYPE.FREE,
    bundleId: null,
    // PAYMENT_STUB: was { introductory: 11682, regular: 35282 }
    price: null,
  },
  "learn-math": {
    id: "learn-math",
    name: "Learn-Math",
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  "learn-physics": {
    id: "learn-physics",
    name: "Learn-Physics",
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  "learn-pr": {
    id: "learn-pr",
    name: "Learn-PR",
    // PAYMENT_STUB: was APP_TYPE.PAID — see reintroduction checklist above
    type: APP_TYPE.FREE,
    bundleId: null,
    // PAYMENT_STUB: was { introductory: 11682, regular: 35282 }
    price: null,
  },
};

/**
 * Get all free apps
 * @returns {string[]} Array of free app IDs
 */
export function getFreeApps() {
  return Object.values(APPS)
    .filter((app) => app.type === APP_TYPE.FREE)
    .map((app) => app.id);
}

/**
 * Get all paid apps
 * @returns {string[]} Array of paid app IDs
 */
export function getPaidApps() {
  return Object.values(APPS)
    .filter((app) => app.type === APP_TYPE.PAID)
    .map((app) => app.id);
}

/**
 * Get app configuration by ID
 * @param {string} appId - App identifier
 * @returns {Object|null} App configuration or null if not found
 */
export function getAppConfig(appId) {
  return APPS[appId] || null;
}

/**
 * Get bundle configuration by ID
 * @param {string} bundleId - Bundle identifier
 * @returns {Object|null} Bundle configuration or null if not found
 */
export function getBundleConfig(bundleId) {
  return BUNDLES[bundleId] || null;
}
