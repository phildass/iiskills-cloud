/**
 * Universal Access Control API
 * 
 * This module provides the core access control functions that all apps
 * must use to determine user access, enforce payment requirements, and
 * handle bundle logic.
 * 
 * @module accessControl
 */

import { APPS, APP_TYPE, BUNDLES, getFreeApps, getAppConfig, getBundleConfig } from './appConfig.js';

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
  
  // Check 3: Look for active access record
  if (!user.app_access || !Array.isArray(user.app_access)) {
    return false;
  }
  
  const accessRecord = user.app_access.find(record => 
    record.app_id === appId && 
    record.is_active === true
  );
  
  if (!accessRecord) {
    return false;
  }
  
  // Check 4: Verify not expired
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
    const activeAccess = user.app_access.filter(record => {
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
    activeAccess.forEach(record => {
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
            purchasedApp: record.granted_via === 'payment' ? record.app_id : null,
            unlockedApps: [],
          };
        }
        
        if (record.granted_via === 'bundle') {
          bundleAccess[app.bundleId].unlockedApps.push(record.app_id);
        } else if (record.granted_via === 'payment') {
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
  
  const accessRecord = user.app_access.find(record => 
    record.app_id === appId && 
    record.is_active === true &&
    record.granted_via === 'bundle'
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
    return '';
  }
  
  const currentApp = getAppConfig(appId);
  const purchasedApp = getAppConfig(purchasedAppId);
  
  if (!currentApp || !purchasedApp) {
    return `🎉 You have bundle access to ${appId}!`;
  }
  
  return `🎉 Congratulations! You unlocked ${currentApp.name} by purchasing ${purchasedApp.name}. Enjoy your ${bundle.name}!`;
}

// Export all constants
export { APPS, APP_TYPE, BUNDLES };
