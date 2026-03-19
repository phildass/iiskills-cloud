/**
 * Database Access Manager
 *
 * Handles database operations for user app access.
 * This module integrates the access control logic with Supabase.
 *
 * @module dbAccessManager
 */

import { createClient } from "@supabase/supabase-js";
import { isFreeApp, getAppsToUnlock, getAccessStatus } from "./accessControl.js";

/**
 * Initialize Supabase client for server-side operations
 * Requires service role key for administrative operations
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY - database access manager requires service role privileges"
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Duration for annual paid entitlements: 1 year in milliseconds
const ANNUAL_ENTITLEMENT_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Grant app access to a user
 *
 * For payment and bundle grants, automatically sets:
 *   - is_certified_paid_user = true
 *   - entitlement_type = 'annual_paid'
 *   - expires_at = 1 year from now (if not explicitly provided)
 *
 * @param {Object} params - Access grant parameters
 * @param {string} params.userId - User UUID
 * @param {string} params.appId - App identifier
 * @param {string} params.grantedVia - How access was granted: 'payment', 'bundle', 'otp', 'admin', or 'free'
 * @param {string|null} params.paymentId - Payment UUID (if granted via payment)
 * @param {string|null} params.expiresAt - Expiration ISO timestamp (null for permanent; defaults to 1 year for paid grants)
 * @returns {Promise<Object>} Access record
 */
export async function grantAppAccess({
  userId,
  appId,
  grantedVia,
  paymentId = null,
  expiresAt = null,
}) {
  const supabase = getSupabaseClient();

  // Determine certified paid status and entitlement type based on grant source
  const isPaidGrant = grantedVia === "payment" || grantedVia === "bundle";
  const isCertifiedPaidUser = isPaidGrant;
  const entitlementType = isPaidGrant ? "annual_paid" : null;

  // For paid grants without an explicit expiry, default to 1 year from now
  const resolvedExpiresAt =
    expiresAt !== null
      ? expiresAt
      : isPaidGrant
        ? new Date(Date.now() + ANNUAL_ENTITLEMENT_MS).toISOString()
        : null;

  const { data, error } = await supabase
    .from("user_app_access")
    .upsert(
      {
        user_id: userId,
        app_id: appId,
        granted_via: grantedVia,
        payment_id: paymentId,
        expires_at: resolvedExpiresAt,
        is_active: true,
        is_certified_paid_user: isCertifiedPaidUser,
        entitlement_type: entitlementType,
        access_granted_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,app_id",
        ignoreDuplicates: false,
      }
    )
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
 * All granted records are marked as annual paid entitlements and expire one year
 * from the purchase date.
 *
 * @param {Object} params - Bundle access grant parameters
 * @param {string} params.userId - User UUID
 * @param {string} params.purchasedAppId - The app that was purchased
 * @param {string} params.paymentId - Payment UUID
 * @param {string|null} params.purchaseDate - ISO timestamp of purchase (defaults to now)
 * @returns {Promise<Object>} Result with access records and bundle info
 */
export async function grantBundleAccess({
  userId,
  purchasedAppId,
  paymentId,
  purchaseDate = null,
}) {
  const appsToUnlock = getAppsToUnlock(purchasedAppId);
  const accessRecords = [];

  // Calculate expiry: one year from purchase date
  // Validate purchaseDate is a parseable date string; fall back to now if invalid
  let baseDate = new Date();
  if (purchaseDate) {
    const parsed = new Date(purchaseDate);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    } else {
      console.warn(`grantBundleAccess: invalid purchaseDate "${purchaseDate}", defaulting to now`);
    }
  }
  const expiresAt = new Date(baseDate);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  console.log(`🎁 Granting bundle access for ${purchasedAppId}:`, appsToUnlock);

  for (const appId of appsToUnlock) {
    const grantedVia = appId === purchasedAppId ? "payment" : "bundle";
    const access = await grantAppAccess({
      userId,
      appId,
      grantedVia,
      paymentId,
      expiresAt: expiresAt.toISOString(),
    });
    accessRecords.push(access);
  }

  console.log(`✅ Bundle access granted: ${appsToUnlock.join(", ")} for user ${userId}`);

  return {
    accessRecords,
    bundledApps: appsToUnlock,
    purchasedApp: purchasedAppId,
    unlockedApps: appsToUnlock.filter((id) => id !== purchasedAppId),
  };
}

/**
 * verifyEntitlement — Certified Paid User override (High-Value Logic)
 *
 * Single source of truth for premium content access.  If the user holds a
 * certified-paid record that is active and not yet expired, they receive an
 * immediate 365-day global unlock for ALL lessons in that course — no
 * individual lesson or module gate can override this.
 *
 * This resolves the "Lesson 2 Paywall" bug where per-lesson checks could fire
 * even for users who had already paid.
 *
 * @param {string} userId   - User UUID
 * @param {string} courseId - App / course identifier (e.g. "learn-developer")
 * @returns {Promise<{ entitled: boolean, accessLevel?: string, reason?: string, expiresAt?: string|null }>}
 */
export async function verifyEntitlement(userId, courseId) {
  if (!userId || !courseId) {
    return { entitled: false, reason: "MISSING_PARAMS" };
  }

  const supabase = getSupabaseClient();

  // HIGH-VALUE LOGIC: Certified Paid Users get immediate 365-day global unlock
  const { data: access, error } = await supabase
    .from("user_app_access")
    .select("is_certified_paid_user, expires_at, is_active")
    .eq("user_id", userId)
    .eq("app_id", courseId) // The schema column is app_id; courseId maps directly to it
    .eq("is_active", true)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error(`[verifyEntitlement] DB error for courseId=${courseId}:`, error);
    return { entitled: false, reason: "DB_ERROR" };
  }

  const isCertified =
    access?.is_certified_paid_user === true &&
    access?.is_active === true &&
    (access?.expires_at == null || new Date(access.expires_at) > new Date());

  if (isCertified) {
    return {
      entitled: true,
      accessLevel: "CERTIFIED_PAID_ANNUAL",
      expiresAt: access.expires_at || null,
    };
  }

  // Fallback: free sample lessons only — caller decides whether to show paywall
  return { entitled: false, reason: "PAYMENT_REQUIRED" };
}

/**
 * A Certified Paid User has `is_certified_paid_user = true` AND
 * either no expiry or an expiry in the future. This flag is set
 * automatically by `grantAppAccess()` for every payment/bundle grant
 * and is the **single source of truth** for premium content access.
 * When this returns `certified: true`, ALL lessons in the app must be
 * unlocked — no individual lesson gating applies.
 *
 * @param {string} userId - User UUID
 * @param {string} appId  - App identifier (e.g. "learn-ai")
 * @returns {Promise<{ certified: boolean, expiresAt: string|null }>}
 */
export async function isCertifiedPaidUser(userId, appId) {
  if (!userId || !appId) return { certified: false, expiresAt: null };

  const supabase = getSupabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_app_access")
    .select("id, expires_at")
    .eq("user_id", userId)
    .eq("app_id", appId)
    .eq("is_active", true)
    .eq("is_certified_paid_user", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error(`[isCertifiedPaidUser] DB error for ${appId}:`, error);
    return { certified: false, expiresAt: null };
  }

  if (data) {
    return { certified: true, expiresAt: data.expires_at || null };
  }

  return { certified: false, expiresAt: null };
}

/**
 * Check if user has access to an app (database query).
 *
 * Priority:
 *   1. Free apps → always true.
 *   2. Admin users (`is_admin = true` in profiles) → always true.
 *      This is the highest-priority override — admin users bypass all paywall
 *      checks so that the ⚠️ HIGH-VALUE ADMIN MODE banner works correctly when
 *      clicking "Preview" on any course.
 *   3. Certified paid user (`is_certified_paid_user = true` + unexpired) → true.
 *      This is the SSOT for paid access — overrides all individual lesson gates.
 *   4. Any active, unexpired `user_app_access` row → true.
 *
 * @param {string|null} userId - User UUID (null for unauthenticated)
 * @param {string} appId - App identifier
 * @returns {Promise<boolean>} True if user has access
 */
export async function hasAppAccess(userId, appId) {
  // Free apps are always accessible
  if (isFreeApp(appId)) {
    return true;
  }

  // Unauthenticated users only have access to free apps
  if (!userId) {
    return false;
  }

  // ── Priority 2: Admin override (FIRST check after auth) ───────────────────
  // Admin users bypass all entitlement checks — this must be the very first
  // DB-level check so that the HIGH-VALUE ADMIN MODE banner actually grants
  // access when an admin clicks "Preview" on any paid course.
  const supabase = getSupabaseClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.is_admin === true) {
    return true;
  }

  // ── Priority 3: Certified paid user check (SSOT) ─────────────────────────
  // If is_certified_paid_user = true and not expired, grant access immediately.
  // This resolves the "Paywall on Lesson 2" bug by making Supabase the absolute
  // authority — no per-lesson gating can override a valid paid entitlement.
  const { certified } = await isCertifiedPaidUser(userId, appId);
  if (certified) {
    return true;
  }

  // ── Priority 4: Any active access record ──────────────────────────────────
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_app_access")
    .select("id, expires_at")
    .eq("user_id", userId)
    .eq("app_id", appId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    console.error(`Error checking app access for ${appId}:`, error);
    return false;
  }

  if (!data) {
    return false;
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
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    throw userError;
  }

  // Get app access records
  const { data: appAccess, error: accessError } = await supabase
    .from("user_app_access")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (accessError) {
    console.error("Error fetching app access:", accessError);
    throw accessError;
  }

  // Filter out expired access
  const now = new Date();
  const activeAccess = (appAccess || []).filter((record) => {
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
 *
 * Note: Field names follow database schema naming convention (snake_case)
 */
export async function revokeAppAccess(userId, appId, reason = "manual") {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("user_app_access")
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoke_reason: reason,
    })
    .eq("user_id", userId)
    .eq("app_id", appId);

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
    .from("user_app_access")
    .select("app_id, granted_via, is_active", { count: "exact" })
    .eq("is_active", true);

  if (appId) {
    query = query.eq("app_id", appId);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching access stats:", error);
    return { total: 0, byGrantType: {}, byApp: {} };
  }

  // Aggregate by grant type
  const byGrantType = {};
  const byApp = {};

  (data || []).forEach((record) => {
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
    .from("payments")
    .update({
      bundle_apps: bundledApps,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (error) {
    console.error(`Error updating payment bundle info for ${paymentId}:`, error);
    throw error;
  }

  console.log(`📝 Updated payment ${paymentId} with bundle apps:`, bundledApps);
}
