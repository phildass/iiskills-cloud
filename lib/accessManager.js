/**
 * Access Manager Library
 * 
 * DEPRECATED: This file is maintained for backward compatibility.
 * New code should import from @iiskills/access-control package.
 * 
 * @deprecated Use @iiskills/access-control instead
 * @module accessManager
 */

// Re-export from the new centralized package
export {
  grantAppAccess,
  grantBundleAccess,
  hasAppAccess,
  getUserWithAccess,
  getUserApps,
  revokeAppAccess,
  getAccessStats,
  updatePaymentBundleInfo,
} from '../packages/access-control';
