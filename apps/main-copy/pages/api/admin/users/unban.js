/**
 * POST /api/admin/users/unban
 *
 * Unbans a user and resets their moderation strike count.
 * Admin-only endpoint.
 *
 * Body (JSON):
 *   { user_id: string }
 *
 * Returns:
 *   200 { success: true }
 *   400 validation error
 *   401 unauthorized
 *   404 user not found
 *   500 server error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = validateAdminRequest(req);
  if (!auth.valid) return res.status(403).json({ error: "Forbidden" });

  const { user_id } = req.body || {};
  if (!user_id || typeof user_id !== "string") {
    return res.status(400).json({ error: "user_id is required" });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user_id)
    .maybeSingle();

  if (!profile) {
    return res.status(404).json({ error: "User not found" });
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      is_banned: false,
      moderation_strikes: 0,
      banned_at: null,
    })
    .eq("id", user_id);

  if (error) {
    console.error("[admin/users/unban] error:", error);
    return res.status(500).json({ error: "Failed to unban user" });
  }

  return res.status(200).json({ success: true });
}
