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
  FREE: 'free',
  PAID: 'paid',
};

/**
 * Bundle definitions
 * Apps within a bundle are unlocked together when any app in the bundle is purchased
 */
export const BUNDLES = {
  'ai-developer-bundle': {
    id: 'ai-developer-bundle',
    name: 'AI + Developer Bundle',
    description: 'Learn AI and Learn Developer - Two Apps for the Price of One',
    apps: ['learn-ai', 'learn-developer'],
    price: {
      introductory: 11682, // Rs 116.82 (Rs 99 + 18% GST) in paisa
      regular: 35282, // Rs 352.82 (Rs 299 + 18% GST) in paisa
    },
    features: [
      'Complete Learn AI course access',
      'Complete Learn Developer course access',
      'Shared progress tracking',
      'Universal certification',
      'Mentor Mode unlock at 30% completion',
    ],
    highlight: '🎉 Special Offer: Get BOTH courses for the price of one!',
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
export const APPS = {
  main: {
    id: 'main',
    name: 'iiskills.cloud',
    type: APP_TYPE.PAID,
    bundleId: null,
    price: {
      introductory: 11682,
      regular: 35282,
    },
  },
  'learn-ai': {
    id: 'learn-ai',
    name: 'Learn-AI',
    type: APP_TYPE.PAID,
    bundleId: 'ai-developer-bundle',
    price: null, // Use bundle price
  },
  'learn-apt': {
    id: 'learn-apt',
    name: 'Learn-Apt',
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  'learn-chemistry': {
    id: 'learn-chemistry',
    name: 'Learn-Chemistry',
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  'learn-developer': {
    id: 'learn-developer',
    name: 'Learn-Developer',
    type: APP_TYPE.PAID,
    bundleId: 'ai-developer-bundle',
    price: null, // Use bundle price
  },
  'learn-geography': {
    id: 'learn-geography',
    name: 'Learn-Geography',
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  'learn-management': {
    id: 'learn-management',
    name: 'Learn-Management',
    type: APP_TYPE.PAID,
    bundleId: null,
    price: {
      introductory: 11682,
      regular: 35282,
    },
  },
  'learn-math': {
    id: 'learn-math',
    name: 'Learn-Math',
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  'learn-physics': {
    id: 'learn-physics',
    name: 'Learn-Physics',
    type: APP_TYPE.FREE,
    bundleId: null,
    price: null,
  },
  'learn-pr': {
    id: 'learn-pr',
    name: 'Learn-PR',
    type: APP_TYPE.PAID,
    bundleId: null,
    price: {
      introductory: 11682,
      regular: 35282,
    },
  },
};

/**
 * Get all free apps
 * @returns {string[]} Array of free app IDs
 */
export function getFreeApps() {
  return Object.values(APPS)
    .filter(app => app.type === APP_TYPE.FREE)
    .map(app => app.id);
}

/**
 * Get all paid apps
 * @returns {string[]} Array of paid app IDs
 */
export function getPaidApps() {
  return Object.values(APPS)
    .filter(app => app.type === APP_TYPE.PAID)
    .map(app => app.id);
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
