/**
 * Database Access Manager
 * 
 * Handles database operations for user app access.
 * This module integrates the access control logic with Supabase.
 * 
 * @module dbAccessManager
 */

import { createClient } from '@supabase/supabase-js';
import { isFreeApp, getAppsToUnlock, getAccessStatus } from './accessControl';

/**
 * Initialize Supabase client for server-side operations
 * Requires service role key for administrative operations
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY - database access manager requires service role privileges');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Grant app access to a user
 * 
 * @param {Object} params - Access grant parameters
 * @param {string} params.userId - User UUID
 * @param {string} params.appId - App identifier
 * @param {string} params.grantedVia - How access was granted: 'payment', 'bundle', 'otp', 'admin', or 'free'
 * @param {string|null} params.paymentId - Payment UUID (if granted via payment)
 * @param {Date|null} params.expiresAt - Expiration date (null for permanent)
 * @returns {Promise<Object>} Access record
 */
export async function grantAppAccess({ userId, appId, grantedVia, paymentId = null, expiresAt = null }) {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_app_access')
    .upsert({
      user_id: userId,
      app_id: appId,
      granted_via: grantedVia,
      payment_id: paymentId,
      expires_at: expiresAt,
      is_active: true,
      access_granted_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,app_id',
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (error) {
    console.error(`Error granting app access for ${appId} to user ${userId}:`, error);
    throw error;
  }

  console.log(`✅ Granted ${appId} access to user ${userId} via ${grantedVia}`);
  return data;
}

/**
 * Grant access to all apps in a bundle
 * 
 * When a user purchases one app in a bundle, they get all apps.
 * This function:
 * 1. Identifies all apps in the bundle
 * 2. Grants access to each app
 * 3. Marks bundle apps with 'bundle' granted_via
 * 4. Logs the bundle unlock for audit trail
 * 
 * @param {Object} params - Bundle access grant parameters
 * @param {string} params.userId - User UUID
 * @param {string} params.purchasedAppId - The app that was purchased
 * @param {string} params.paymentId - Payment UUID
 * @returns {Promise<Object>} Result with access records and bundle info
 */
export async function grantBundleAccess({ userId, purchasedAppId, paymentId }) {
  const appsToUnlock = getAppsToUnlock(purchasedAppId);
  const accessRecords = [];
  
  console.log(`🎁 Granting bundle access for ${purchasedAppId}:`, appsToUnlock);
  
  for (const appId of appsToUnlock) {
    const grantedVia = appId === purchasedAppId ? 'payment' : 'bundle';
    const access = await grantAppAccess({
      userId,
      appId,
      grantedVia,
      paymentId,
      expiresAt: null, // Permanent access
    });
    accessRecords.push(access);
  }
  
  console.log(`✅ Bundle access granted: ${appsToUnlock.join(', ')} for user ${userId}`);
  
  return {
    accessRecords,
    bundledApps: appsToUnlock,
    purchasedApp: purchasedAppId,
    unlockedApps: appsToUnlock.filter(id => id !== purchasedAppId),
  };
}

/**
 * Check if user has access to an app (database query)
 * 
 * Returns true for:
 * - Free apps
 * - Apps with active access record in database
 * - Non-expired access
 * 
 * @param {string|null} userId - User UUID (null for unauthenticated)
 * @param {string} appId - App identifier
 * @returns {Promise<boolean>} True if user has access
 */
export async function hasAppAccess(userId, appId) {
  // Check if app is free
  if (isFreeApp(appId)) {
    return true;
  }
  
  // Unauthenticated users only have access to free apps
  if (!userId) {
    return false;
  }
  
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_app_access')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('is_active', true)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error(`Error checking app access for ${appId}:`, error);
    return false;
  }

  // No access record found
  if (!data) {
    return false;
  }

  // Check if access is expired
  if (data.expires_at) {
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    if (now > expiresAt) {
      // Access expired - revoke it
      await revokeAppAccess(userId, appId, 'expired');
      return false;
    }
  }

  return true;
}

/**
 * Get user with app access records
 * 
 * Fetches user data along with their app access records.
 * This can be used with userHasAccess() from accessControl.js
 * 
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} User object with app_access array
 */
export async function getUserWithAccess(userId) {
  const supabase = getSupabaseClient();
  
  // Get user profile
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (userError) {
    console.error('Error fetching user:', userError);
    throw userError;
  }
  
  // Get app access records
  const { data: appAccess, error: accessError } = await supabase
    .from('user_app_access')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (accessError) {
    console.error('Error fetching app access:', accessError);
    throw accessError;
  }
  
  // Filter out expired access
  const now = new Date();
  const activeAccess = (appAccess || []).filter(record => {
    if (!record.expires_at) return true;
    const expiresAt = new Date(record.expires_at);
    return now <= expiresAt;
  });
  
  return {
    ...user,
    app_access: activeAccess,
  };
}

/**
 * Get all apps a user has access to
 * 
 * Includes free apps and purchased apps
 * 
 * @param {string|null} userId - User UUID (null for unauthenticated)
 * @returns {Promise<Object>} Access status object
 */
export async function getUserApps(userId) {
  if (!userId) {
    // Return only free apps for unauthenticated users
    return getAccessStatus(null);
  }
  
  const user = await getUserWithAccess(userId);
  return getAccessStatus(user);
}

/**
 * Revoke app access
 * 
 * @param {string} userId - User UUID
 * @param {string} appId - App identifier
 * @param {string} reason - Reason for revocation (e.g., 'expired', 'refund', 'manual')
 * @returns {Promise<void>}
 */
export async function revokeAppAccess(userId, appId, reason = 'manual') {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('user_app_access')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoke_reason: reason,
    })
    .eq('user_id', userId)
    .eq('app_id', appId);

  if (error) {
    console.error(`Error revoking app access for ${appId}:`, error);
    throw error;
  }
  
  console.log(`🚫 Revoked ${appId} access for user ${userId} (reason: ${reason})`);
}

/**
 * Get access statistics for admin dashboard
 * 
 * @param {string|null} appId - App identifier (null for all apps)
 * @returns {Promise<Object>} Access statistics
 */
export async function getAccessStats(appId = null) {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('user_app_access')
    .select('app_id, granted_via, is_active', { count: 'exact' })
    .eq('is_active', true);
  
  if (appId) {
    query = query.eq('app_id', appId);
  }
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching access stats:', error);
    return { total: 0, byGrantType: {}, byApp: {} };
  }
  
  // Aggregate by grant type
  const byGrantType = {};
  const byApp = {};
  
  (data || []).forEach(record => {
    byGrantType[record.granted_via] = (byGrantType[record.granted_via] || 0) + 1;
    byApp[record.app_id] = (byApp[record.app_id] || 0) + 1;
  });
  
  return {
    total: count || 0,
    byGrantType,
    byApp,
  };
}

/**
 * Update payment record with bundle information
 * 
 * This should be called after granting bundle access to log which apps were unlocked.
 * 
 * @param {string} paymentId - Payment UUID
 * @param {string[]} bundledApps - Array of app IDs that were unlocked
 * @returns {Promise<void>}
 */
export async function updatePaymentBundleInfo(paymentId, bundledApps) {
  const supabase = getSupabaseClient();
  
  const { error } = await supabase
    .from('payments')
    .update({
      bundle_apps: bundledApps,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId);
  
  if (error) {
    console.error(`Error updating payment bundle info for ${paymentId}:`, error);
    throw error;
  }
  
  console.log(`📝 Updated payment ${paymentId} with bundle apps:`, bundledApps);
}
