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

  // Check profile for admin override or paid user status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, is_paid_user")
    .eq("id", user.id)
    .maybeSingle();

  // Admins have unrestricted access to all content
  if (profile?.is_admin === true) {
    return res.status(200).json({ hasAccess: true, isAdmin: true });
  }

  return res.status(200).json({ hasAccess: !!profile?.is_paid_user });
}
