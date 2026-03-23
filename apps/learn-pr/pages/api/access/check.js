/**
 * Access Check API — /api/access/check
 *
 * GET /api/access/check?appId=<appId>
 *
 * Returns { hasAccess: bool, isAdmin?: bool }
 * Used by TriLevelLandingPage to determine whether to show the payment CTA.
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Checks:
 *   1. Active entitlement row in public.entitlements for the user + appId
 *      (includes ai-developer-bundle which grants access to learn-ai and learn-developer).
 *   2. Admin bypass: profiles.is_admin = true grants full access to all content.
 *   3. Fallback: profiles.is_paid_user flag.
 */

import { createClient } from "@supabase/supabase-js";

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
    return res.status(400).json({ error: "appId is required" });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(200).json({ hasAccess: false });
  }

  // Authenticate via Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(200).json({ hasAccess: false });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(200).json({ hasAccess: false });
  }

  const user = userData.user;

  // ── Admin bypass: check profile BEFORE entitlement rows ──────────────────
  // Admins do not need a payment/entitlement row — their profile flag is the
  // source of truth.  Checking admin status first avoids an unnecessary DB
  // round-trip to the entitlements table and matches the priority order used
  // by the main entitlement API (apps/main/pages/api/entitlement.js).
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, is_paid_user, role")
    .eq("id", user.id)
    .maybeSingle();

  console.info(
    "[access/check] gate for user",
    user.id,
    "app",
    appId,
    "| is_admin:",
    profile?.is_admin,
    "| role:",
    profile?.role
  );

  if (profile?.is_admin === true || profile?.role === "admin") {
    console.info("[access/check] admin bypass granted for user", user.id, "app", appId);
    return res.status(200).json({ hasAccess: true, isAdmin: true });
  }

  // Check active entitlement (includes bundle access)
  const now = new Date().toISOString();
  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("id")
    .eq("user_id", user.id)
    .in("app_id", [appId, "ai-developer-bundle"])
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();

  if (entitlement) {
    return res.status(200).json({ hasAccess: true });
  }

  return res.status(200).json({ hasAccess: !!profile?.is_paid_user });
}
