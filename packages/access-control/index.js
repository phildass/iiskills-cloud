/**
 * @iiskills/access-control
 * 
 * Universal App Access Control System
 * 
 * This package provides centralized access control for all iiskills.cloud apps.
 * It handles:
 * - Free vs paid app definitions
 * - Bundle logic (AI + Developer bundle)
 * - User access verification
 * - Payment integration
 * - Database operations
 * 
 * @example Basic usage
 * ```javascript
 * import { isFreeApp, requiresPayment, userHasAccess } from '@iiskills/access-control';
 * 
 * // Check if app is free
 * if (isFreeApp('learn-math')) {
 *   console.log('This app is free!');
 * }
 * 
 * // Check if app requires payment
 * if (requiresPayment('learn-ai')) {
 *   console.log('Payment required');
 * }
 * 
 * // Check user access
 * if (userHasAccess(user, 'learn-developer')) {
 *   console.log('User has access!');
 * }
 * ```
 * 
 * @example Database operations
 * ```javascript
 * import { hasAppAccess, grantBundleAccess } from '@iiskills/access-control';
 * 
 * // Check access from database
 * const hasAccess = await hasAppAccess(userId, 'learn-ai');
 * 
 * // Grant bundle access after payment
 * const result = await grantBundleAccess({
 *   userId: 'uuid',
 *   purchasedAppId: 'learn-ai',
 *   paymentId: 'payment-uuid'
 * });
 * // This unlocks both learn-ai and learn-developer
 * ```
 * 
 * @module @iiskills/access-control
 */

// Core access control functions
export {
  isFreeApp,
  isBundleApp,
  requiresPayment,
  userHasAccess,
  getBundleInfo,
  getAppsToUnlock,
  getAccessStatus,
  hasAccessViaBundle,
  getBundleAccessMessage,
} from './accessControl';

// Database operations
export {
  grantAppAccess,
  grantBundleAccess,
  hasAppAccess,
  getUserWithAccess,
  getUserApps,
  revokeAppAccess,
  getAccessStats,
  updatePaymentBundleInfo,
} from './dbAccessManager';

// Configuration and constants
export {
  APPS,
  APP_TYPE,
  BUNDLES,
  getFreeApps,
  getPaidApps,
  getAppConfig,
  getBundleConfig,
} from './appConfig';
