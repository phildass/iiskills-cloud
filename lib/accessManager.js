/**
 * Access Manager Library
 * 
 * Handles user access control to apps, including:
 * - Granting access (via payment, OTP, admin, or free tier)
 * - Checking user access
 * - Revoking access
 * - Bundle logic integration
 * 
 * @module accessManager
 */

import { createClient } from '@supabase/supabase-js';
import { getAppsInBundle } from './bundleConfig';
import { APPS } from './appRegistry';

// Initialize Supabase client for server-side operations
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseKey);
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
 * When a user purchases one app in a bundle, they get all apps
 * 
 * @param {Object} params - Bundle access grant parameters
 * @param {string} params.userId - User UUID
 * @param {string} params.purchasedAppId - The app that was purchased
 * @param {string} params.paymentId - Payment UUID
 * @returns {Promise<Object[]>} Array of access records
 */
export async function grantBundleAccess({ userId, purchasedAppId, paymentId }) {
  const appsToUnlock = getAppsInBundle(purchasedAppId);
  const accessRecords = [];
  
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
  
  console.log(`✅ Granted bundle access: ${appsToUnlock.join(', ')} for user ${userId}`);
  return accessRecords;
}

/**
 * Check if user has access to an app
 * Returns true for:
 * - Free apps (from appRegistry)
 * - Apps with active access record
 * - Non-expired access
 * 
 * @param {string} userId - User UUID (null for unauthenticated)
 * @param {string} appId - App identifier
 * @returns {Promise<boolean>} True if user has access
 */
export async function hasAppAccess(userId, appId) {
  // Check if app is free
  const app = APPS[appId];
  if (app && app.isFree) {
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
 * Get all apps a user has access to
 * Includes free apps and purchased apps
 * 
 * @param {string|null} userId - User UUID (null for unauthenticated)
 * @returns {Promise<Object[]>} Array of app access records with app info
 */
export async function getUserApps(userId) {
  const supabase = getSupabaseClient();
  
  // Get free apps
  const freeApps = Object.values(APPS)
    .filter(app => app.isFree)
    .map(app => ({
      app_id: app.id,
      app_name: app.name,
      granted_via: 'free',
      is_free: true,
    }));
  
  // If no user, return only free apps
  if (!userId) {
    return freeApps;
  }
  
  // Get purchased/granted apps
  const { data: paidApps, error } = await supabase
    .from('user_app_access')
    .select('app_id, access_granted_at, granted_via, expires_at')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching user apps:', error);
    return freeApps;
  }

  // Filter out expired access
  const activeApps = (paidApps || []).filter(app => {
    if (!app.expires_at) return true;
    const now = new Date();
    const expiresAt = new Date(app.expires_at);
    return now <= expiresAt;
  });
  
  // Add app metadata
  const enrichedPaidApps = activeApps.map(app => {
    const appInfo = APPS[app.app_id];
    return {
      ...app,
      app_name: appInfo?.name || app.app_id,
      is_free: false,
    };
  });
  
  // Combine free and paid apps, removing duplicates
  const allApps = [...freeApps];
  for (const paidApp of enrichedPaidApps) {
    if (!allApps.some(a => a.app_id === paidApp.app_id)) {
      allApps.push(paidApp);
    }
  }
  
  return allApps;
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
 * @param {string} appId - App identifier (optional - null for all apps)
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
