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
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.  All previously-paid apps
 * are now configured as FREE (see packages/access-control/appConfig.js).
 *
 * As a result, isFreeApp() now returns true for all previously-paid apps, so
 * the useUserAccess / useEntitlement hooks short-circuit and never call this
 * API for those apps.  This endpoint is retained for:
 *   - Free apps that already called it
 *   - Admin-related entitlement lookups
 *   - Future re-implementation reference
 *
 * When payments are re-introduced, the entitlement granting pipeline
 * (confirm API → entitlements table → cache invalidation) must be rebuilt
 * from scratch with full security review.
 * ─────────────────────────────────────────────────────────────────────────────
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
import { getBundleConfig } from "../../../../packages/access-control/appConfig.js";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

/**
 * Emit CORS headers so *.iiskills.cloud sub-apps can call this API cross-subdomain.
 *
 * Without these headers the browser enforces the same-origin policy and the
 * request from (e.g.) learn-developer.iiskills.cloud → iiskills.cloud/api/entitlement
 * is rejected before it reaches our handler — causing useUserAccess to catch a
 * network error and fall back to ACCESS_LEVEL.NONE, showing the paywall to
 * every user, including admins.
 *
 * We restrict the allowed origin to *.iiskills.cloud to avoid opening the API
 * to arbitrary third-party domains.
 */
function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "";
  const allowed =
    origin === "https://iiskills.cloud" ||
    // Require subdomain starts AND ends with alphanumeric to block patterns like
    // https://-.iiskills.cloud or https://-evil.iiskills.cloud
    /^https:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?\.iiskills\.cloud$/.test(origin) ||
    // Allow localhost in development so integration tests work without a browser
    /^http:\/\/localhost(:\d+)?$/.test(origin);

  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
}

export default async function handler(req, res) {
  // Apply CORS before anything else so the preflight OPTIONS request succeeds.
  setCorsHeaders(req, res);
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET", "OPTIONS"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { appId } = req.query;
  if (!appId) {
    return res.status(400).json({ error: "appId query parameter is required" });
  }

  // Validate appId to prevent PostgREST filter injection via the .or() query string.
  // App IDs in this project follow the pattern: lowercase letters, digits, and hyphens.
  if (!/^[a-z0-9-]+$/.test(appId)) {
    return res.status(400).json({ error: "Invalid appId" });
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

  // ── Priority 0: Owner email bypass ────────────────────────────────────────
  // For these two product-owner accounts, return true immediately without
  // querying subscriptions, entitlements, or any payment records.
  // This is a global override that fires before the cache and before the DB.
  if (user.email === "philipda@gmail.com" || user.email === "pda.kenya@gmail.com") {
    console.info("[entitlement] P0 owner-email bypass for user", user.id, "app", appId);
    await setEntitlementInCache(user.id, appId, true);
    return res.status(200).json({
      authenticated: true,
      entitled: true,
      expiresAt: null,
      adminAccess: true,
      ownerOverride: true,
      fromCache: false,
    });
  }

  // ── Cache + admin profile check in parallel ──────────────────────────────
  // The admin profile query runs in parallel with the cache read so there is no
  // added latency.  Critically, the admin check evaluates BEFORE the cached
  // result is used: a stale entitled:false cache entry (written before a user
  // was promoted to admin) must never block an admin user.
  const [cached, profileResult] = await Promise.all([
    getEntitlementFromCache(user.id, appId),
    // Select both is_admin (legacy) and role (new) so either representation works.
    supabase.from("profiles").select("is_admin, role").eq("id", user.id).maybeSingle(),
  ]);

  // ── Priority 1: Admin bypass ───────────────────────────────────────────────
  // Triggered by is_admin = true (legacy) OR role = 'admin' (new field).
  // This check fires BEFORE the cached result is evaluated so that a stale
  // entitled:false entry can never block a user whose admin status was updated
  // after the negative entry was written.
  const profile = profileResult.data;
  console.info(
    "[entitlement] profile check for user",
    user.id,
    "app",
    appId,
    "| is_admin:",
    profile?.is_admin,
    "| role:",
    profile?.role,
    "| cached:",
    cached
  );
  if (profile?.is_admin === true || profile?.role === "admin") {
    console.info("[entitlement] P1 admin bypass for user", user.id, "app", appId);
    await setEntitlementInCache(user.id, appId, true);
    return res.status(200).json({
      authenticated: true,
      entitled: true,
      expiresAt: null,
      adminAccess: true,
      fromCache: false,
    });
  }

  // ── Cache read (non-admin users only) ─────────────────────────────────────
  // At this point the user is confirmed non-admin, so a cached false result is
  // safe to return without further DB queries.
  if (cached !== null) {
    return res.status(200).json({
      authenticated: true,
      entitled: cached,
      expiresAt: null,
      fromCache: true,
    });
  }

  // ── Remaining database checks ──────────────────────────────────────────────
  // Cache miss for a non-admin user — run entitlement and certified-paid checks.

  const now = new Date().toISOString();

  // Check entitlements by BOTH app_id (admin/bundle grants) AND course_slug (Razorpay
  // payment grants written by /api/payments/confirm). Either path grants access.
  const bundleId = "ai-developer-bundle";
  // For apps that belong to the AI Developer bundle, also check user_app_access rows
  // stored under the bundle ID. This handles bundle-level grants where app_id is
  // 'ai-developer-bundle' rather than the individual app ID.
  // Derive bundle membership from the central config to avoid a hardcoded list.
  const aiBundleApps = getBundleConfig(bundleId)?.apps ?? [];
  const bundleAppIds = aiBundleApps.includes(appId) ? [appId, bundleId] : [appId];

  const [entitlementResult, certifiedPaidResult] = await Promise.all([
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
    // Also checks bundle-level rows (e.g. app_id = 'ai-developer-bundle') for
    // bundle members so both philipda@gmail.com and pda.kenya@gmail.com are covered.
    supabase
      .from("user_app_access")
      .select("id, expires_at")
      .eq("user_id", user.id)
      .in("app_id", bundleAppIds)
      .eq("is_active", true)
      .eq("is_certified_paid_user", true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .limit(1)
      .maybeSingle(),
  ]);

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
  // Also checks bundle-level rows (e.g. app_id = 'ai-developer-bundle') so that
  // users with a bundle-level grant get access to all apps in the bundle.
  const { data: appAccess } = await supabase
    .from("user_app_access")
    .select("id, expires_at")
    .eq("user_id", user.id)
    .in("app_id", bundleAppIds)
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
  return res
    .status(200)
    .json({ authenticated: true, entitled: false, expiresAt: null, fromCache: false });
}
