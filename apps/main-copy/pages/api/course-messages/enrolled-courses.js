/**
 * GET /api/course-messages/enrolled-courses
 *
 * Returns the list of paid apps the authenticated user is enrolled in.
 * Used by the dashboard to let the user pick which course to message about.
 *
 * Authorization: Bearer <access_token>
 *
 * Returns:
 *   200 { courses: [{ app_id, name }] }
 *   401 not authenticated
 *   500 server error
 */

import { createClient } from "@supabase/supabase-js";
import { APPS } from "@lib/appRegistry";

// Build paid app name map from the canonical app registry
// Only include apps where isFree === false (paid courses)
const PAID_APP_NAMES = Object.entries(APPS)
  .filter(([, app]) => app.isFree === false && app.id && app.id !== "main")
  .reduce((acc, [, app]) => {
    acc[app.id] = app.name;
    return acc;
  }, {});

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function getSupabaseUser(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  const userClient = getSupabaseUser(accessToken);
  if (!userClient) return res.status(500).json({ error: "Service configuration error" });

  const {
    data: { user },
    error: authErr,
  } = await userClient.auth.getUser();
  if (authErr || !user) return res.status(401).json({ error: "Not authenticated" });

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Service configuration error" });

  const now = new Date().toISOString();
  const paidAppIds = Object.keys(PAID_APP_NAMES);

  // Check entitlements table
  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("app_id")
    .eq("user_id", user.id)
    .in("app_id", [...paidAppIds, "ai-developer-bundle"])
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  const enrolledAppIds = new Set();

  for (const e of entitlements || []) {
    if (e.app_id === "ai-developer-bundle") {
      enrolledAppIds.add("learn-ai");
      enrolledAppIds.add("learn-developer");
    } else if (PAID_APP_NAMES[e.app_id]) {
      enrolledAppIds.add(e.app_id);
    }
  }

  // Legacy check
  if (enrolledAppIds.size === 0) {
    const { data: legacyAccess } = await supabase
      .from("user_app_access")
      .select("app_id")
      .eq("user_id", user.id)
      .in("app_id", paidAppIds)
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${now}`);

    for (const row of legacyAccess || []) {
      if (PAID_APP_NAMES[row.app_id]) enrolledAppIds.add(row.app_id);
    }
  }

  const courses = Array.from(enrolledAppIds).map((app_id) => ({
    app_id,
    name: PAID_APP_NAMES[app_id] || app_id,
  }));

  return res.status(200).json({ courses });
}
