/**
 * Admin User Management API
 *
 * GET  /api/admin/users          — list all profiles (ordered by created_at desc)
 * PATCH /api/admin/users         — toggle profiles.is_admin for a user
 *
 * Authentication: supreme-admin (admin_session cookie or x-admin-secret header)
 * OR Supabase Bearer token belonging to an admin user.
 *
 * All DB operations use the service-role key (bypasses RLS) so that the
 * caller does not need direct DB privileges. This prevents browsers from
 * mutating profiles.is_admin via the Supabase anon key.
 */

import { validateAdminRequestAsync, createServiceRoleClient } from "../../../lib/adminAuth";

export default async function handler(req, res) {
  const auth = await validateAdminRequestAsync(req);
  if (!auth.valid) {
    return res.status(auth.status || 403).json({ error: auth.reason || "Forbidden" });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  // ── GET — list profiles ──────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { filter } = req.query; // "admin" | "regular" | undefined

    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

    if (filter === "admin") {
      query = query.eq("is_admin", true);
    } else if (filter === "regular") {
      query = query.eq("is_admin", false);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ users: data });
  }

  // ── PATCH — toggle is_admin ───────────────────────────────────────────────────
  if (req.method === "PATCH") {
    const { userId, isAdmin } = req.body || {};

    if (!userId || typeof isAdmin !== "boolean") {
      return res.status(400).json({ error: "userId (string) and isAdmin (boolean) are required" });
    }

    // Verify the target user exists before updating
    const { data: existing, error: lookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (lookupError || !existing) {
      return res.status(404).json({ error: "User not found" });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("id", userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
