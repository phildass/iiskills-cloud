/**
 * App Bundle Configuration
 * 
 * Defines app bundles where purchasing one app grants access to multiple apps.
 * Currently supports the AI-Developer bundle where purchasing either app
 * grants access to both.
 * 
 * @module bundleConfig
 */

/**
 * Bundle Definitions
 * Each bundle defines a set of apps that are unlocked together
 */
export const APP_BUNDLES = {
  'ai-developer-bundle': {
    id: 'ai-developer-bundle',
    name: 'AI + Developer Bundle',
    description: 'Learn AI and Learn Developer - Two Apps for the Price of One',
    apps: ['learn-ai', 'learn-developer'],
    price: {
      // Prices in paisa (smallest currency unit)
      introductory: 11682, // Rs 116.82 (Rs 99 + 18% GST)
      regular: 35282, // Rs 352.82 (Rs 299 + 18% GST)
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
 * Map from app ID to bundle ID
 * If an app is in a bundle, it appears here
 */
export const APP_TO_BUNDLE = {
  'learn-ai': 'ai-developer-bundle',
  'learn-developer': 'ai-developer-bundle',
};

/**
 * Get bundle configuration for an app
 * 
 * @param {string} appId - App identifier (e.g., 'learn-ai')
 * @returns {Object|null} Bundle configuration or null if app is not in a bundle
 */
export function getBundleForApp(appId) {
  const bundleId = APP_TO_BUNDLE[appId];
  return bundleId ? APP_BUNDLES[bundleId] : null;
}

/**
 * Get all apps that should be unlocked when purchasing a given app
 * If the app is in a bundle, returns all apps in the bundle
 * Otherwise, returns just the app itself
 * 
 * @param {string} appId - App identifier
 * @returns {string[]} Array of app IDs that should be unlocked
 */
export function getAppsInBundle(appId) {
  const bundle = getBundleForApp(appId);
  return bundle ? bundle.apps : [appId];
}

/**
 * Check if an app is part of a bundle
 * 
 * @param {string} appId - App identifier
 * @returns {boolean} True if app is in a bundle
 */
export function isAppInBundle(appId) {
  return appId in APP_TO_BUNDLE;
}

/**
 * Get all apps that are part of bundles
 * 
 * @returns {string[]} Array of app IDs that are in bundles
 */
export function getBundledApps() {
  return Object.keys(APP_TO_BUNDLE);
}

/**
 * Get price for an app (including bundle price if applicable)
 * 
 * @param {string} appId - App identifier
 * @param {string} tier - 'introductory' or 'regular'
 * @returns {number} Price in paisa
 */
export function getPriceForApp(appId, tier = 'introductory') {
  const bundle = getBundleForApp(appId);
  if (bundle) {
    return bundle.price[tier];
  }
  
  // Default prices for non-bundled apps (can be customized per app)
  const defaultPrices = {
    introductory: 11682, // Rs 116.82
    regular: 35282, // Rs 352.82
  };
  
  return defaultPrices[tier];
}
