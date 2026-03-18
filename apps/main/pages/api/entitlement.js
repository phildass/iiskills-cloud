/**
 * Entitlement Check API
 *
 * GET /api/entitlement?appId=learn-ai
 *
 * Returns:
 *   { authenticated: bool, entitled: bool, expiresAt: string|null, adminAccess?: bool }
 *
 * Access: authenticated users only (reads their own entitlement row).
 *
 * Priority hierarchy (Admin > Paid_User > Free_User):
 *   1. Admin bypass — profile.is_admin === true OR profile.role === 'admin'
 *      → returns { entitled: true, adminAccess: true } immediately.
 *   2. Active entitlement row in public.entitlements (includes bundle grants).
 *   3. Active row in public.user_app_access (admin-dashboard / dbAccessManager grants).
 *
 * Caching:
 *   Results are stored in the entitlement cache (Redis when configured, in-process
 *   Map otherwise) for DEFAULT_TTL_SECONDS.  The cache is invalidated by
 *   /api/payments/confirm immediately after a user is upgraded to "Paid".
 */

import { createClient } from "@supabase/supabase-js";
import { isFreeAccessEnabled } from "../../../../packages/shared-utils/lib/freeAccess";
import {
  getEntitlementFromCache,
  setEntitlementInCache,
} from "../../../../packages/shared-utils/lib/entitlementCache";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { appId } = req.query;
  if (!appId) {
    return res.status(400).json({ error: "appId query parameter is required" });
  }

  // Free-access mode: treat all paid content as accessible.
  if (isFreeAccessEnabled()) {
    return res
      .status(200)
      .json({ authenticated: true, entitled: true, expiresAt: null, freeAccess: true });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(200).json({ authenticated: false, entitled: false, expiresAt: null });
  }

  // Get authenticated user from Authorization header
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const { data } = await supabase.auth.getUser(token);
    user = data?.user || null;
  }

  if (!user) {
    return res.status(200).json({ authenticated: false, entitled: false, expiresAt: null });
  }

  // ── Cache read ─────────────────────────────────────────────────────────────
  // Check the entitlement cache before hitting the database.  Admin results are
  // also cached (as `true`) so subsequent requests for an admin don't re-query.
  const cached = await getEntitlementFromCache(user.id, appId);
  if (cached !== null) {
    return res.status(200).json({
      authenticated: true,
      entitled: cached,
      expiresAt: null,
      fromCache: true,
    });
  }

  // ── Database checks ────────────────────────────────────────────────────────
  // Run admin-profile check and entitlement check in parallel to minimise
  // DB round trips.

  const now = new Date().toISOString();

  // Check entitlements by BOTH app_id (admin/bundle grants) AND course_slug (Razorpay
  // payment grants written by /api/payments/confirm). Either path grants access.
  const bundleId = "ai-developer-bundle";
  const [profileResult, entitlementResult, certifiedPaidResult] = await Promise.all([
    // Select both is_admin (legacy) and role (new) so either representation works.
    supabase.from("profiles").select("is_admin, role").eq("id", user.id).maybeSingle(),
    supabase
      .from("entitlements")
      .select("id, status, expires_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .or(`app_id.in.(${appId},${bundleId}),course_slug.in.(${appId},${bundleId})`)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("purchased_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    // ── Priority 1.5: Certified paid user (SSOT) ──────────────────────────
    // If is_certified_paid_user = true + not expired, ALL lessons are unlocked.
    // This is the single source of truth for premium access and overrides all
    // per-lesson gating, resolving the "Paywall on Lesson 2" bug.
    supabase
      .from("user_app_access")
      .select("id, expires_at")
      .eq("user_id", user.id)
      .eq("app_id", appId)
      .eq("is_active", true)
      .eq("is_certified_paid_user", true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .limit(1)
      .maybeSingle(),
  ]);

  // ── Priority 1: Admin bypass ───────────────────────────────────────────────
  // Triggered by is_admin = true (legacy) OR role = 'admin' (new field).
  // Admin status is cached so the DB is not queried on every admin page load.
  const profile = profileResult.data;
  if (profile?.is_admin === true || profile?.role === "admin") {
    await setEntitlementInCache(user.id, appId, true);
    return res.status(200).json({
      authenticated: true,
      entitled: true,
      expiresAt: null,
      adminAccess: true,
      fromCache: false,
    });
  }

  // ── Priority 1.5: Certified paid user (SSOT) ──────────────────────────────
  // is_certified_paid_user = true + not expired → ALL lessons unlocked.
  // This is set by grantAppAccess() for every payment/bundle grant and is the
  // absolute authority for premium access. No per-lesson gating can override it.
  const { data: certifiedAccess } = certifiedPaidResult;
  if (certifiedAccess) {
    await setEntitlementInCache(user.id, appId, true);
    return res.status(200).json({
      authenticated: true,
      entitled: true,
      expiresAt: certifiedAccess.expires_at || null,
      certifiedPaidUser: true,
      fromCache: false,
    });
  }

  // ── Priority 2: Active entitlement row ────────────────────────────────────
  const { data: entitlement, error } = entitlementResult;

  if (error) {
    console.error("[entitlement API] DB error:", error.message);
  }

  if (entitlement) {
    await setEntitlementInCache(user.id, appId, true);
    return res.status(200).json({
      authenticated: true,
      entitled: true,
      expiresAt: entitlement.expires_at || null,
      fromCache: false,
    });
  }

  // ── Priority 3: user_app_access fallback ──────────────────────────────────
  // Covers grants via grantAppAccess() / dbAccessManager (admin-dashboard grants,
  // bundle grants) which write to user_app_access rather than entitlements.
  const { data: appAccess } = await supabase
    .from("user_app_access")
    .select("id, expires_at")
    .eq("user_id", user.id)
    .eq("app_id", appId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();

  if (appAccess) {
    await setEntitlementInCache(user.id, appId, true);
    return res.status(200).json({
      authenticated: true,
      entitled: true,
      expiresAt: appAccess.expires_at || null,
      fromCache: false,
    });
  }

  // ── No access found — cache the negative result ───────────────────────────
  await setEntitlementInCache(user.id, appId, false);
  return res.status(200).json({ authenticated: true, entitled: false, expiresAt: null, fromCache: false });
}

