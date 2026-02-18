/**
 * App Bundle Configuration
 * 
 * DEPRECATED: This file is maintained for backward compatibility.
 * New code should import from @iiskills/access-control package.
 * 
 * @deprecated Use @iiskills/access-control instead
 * @module bundleConfig
 */

// Re-export from the new centralized package
export {
  BUNDLES as APP_BUNDLES,
  getAppsToUnlock as getAppsInBundle,
  getBundleInfo as getBundleForApp,
  isBundleApp as isAppInBundle,
  APPS,
} from '../packages/access-control';

// Legacy function mappings for backward compatibility
import { 
  BUNDLES, 
  getBundleInfo, 
  getAppsToUnlock,
  getAppConfig 
} from '../packages/access-control';

/**
 * @deprecated Use getAppsToUnlock from @iiskills/access-control instead
 */
export function getAppsInBundle(appId) {
  return getAppsToUnlock(appId);
}

/**
 * @deprecated Use getBundleInfo from @iiskills/access-control instead
 */
export function getBundleForApp(appId) {
  return getBundleInfo(appId);
}

/**
 * @deprecated Use getBundleInfo from @iiskills/access-control instead
 */
export function isAppInBundle(appId) {
  return getBundleInfo(appId) !== null;
}

/**
 * Get price for an app (including bundle price if applicable)
 * 
 * @param {string} appId - App identifier
 * @param {string} tier - 'introductory' or 'regular'
 * @returns {number} Price in paisa
 */
export function getPriceForApp(appId, tier = 'introductory') {
  const bundle = getBundleInfo(appId);
  if (bundle) {
    return bundle.price[tier];
  }
  
  const app = getAppConfig(appId);
  if (app && app.price) {
    return app.price[tier];
  }
  
  // Default prices for non-bundled apps
  const defaultPrices = {
    introductory: 11682, // Rs 116.82
    regular: 35282, // Rs 352.82
  };
  
  return defaultPrices[tier];
}

/**
 * Map from app ID to bundle ID
 * @deprecated Use getBundleInfo from @iiskills/access-control instead
 */
export const APP_TO_BUNDLE = {
  'learn-ai': 'ai-developer-bundle',
  'learn-developer': 'ai-developer-bundle',
};

/**
 * Get all apps that are part of bundles
 * @deprecated Use getBundleInfo from @iiskills/access-control instead
 */
export function getBundledApps() {
  return Object.keys(APP_TO_BUNDLE);
}
