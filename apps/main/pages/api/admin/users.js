/**
 * Admin User Management API
 *
 * GET  /api/admin/users          — list all profiles (ordered by created_at desc)
 * PATCH /api/admin/users         — toggle profiles.is_admin for a user (superadmin only)
 *
 * Authentication: supreme-admin (admin_session cookie or x-admin-secret header)
 * OR Supabase Bearer token belonging to an admin user.
 *
 * All DB operations use the service-role key (bypasses RLS) so that the
 * caller does not need direct DB privileges. This prevents browsers from
 * mutating profiles.is_admin via the Supabase anon key.
 *
 * NOTE: The dedicated /api/admin/admins endpoint is preferred for admin management
 * as it includes invite handling, audit logging, and superadmin enforcement.
 */

import {
  validateAdminRequestAsync,
  createServiceRoleClient,
  isSuperadmin,
  getActorInfo,
  writeAuditEvent,
} from "../../../lib/adminAuth";
import sendError from "../../../utils/sendError";
import checkConfig from "../../../utils/checkConfig";

export default async function handler(req, res) {
  const auth = await validateAdminRequestAsync(req);
  if (!auth.valid) {
    return res.status(auth.status || 403).json({ error: auth.reason || "Forbidden" });
  }

  let supabase;
  try {
    checkConfig(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
    supabase = createServiceRoleClient();
  } catch {
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
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

  // ── PATCH — toggle is_admin (superadmin only) ─────────────────────────────────
  if (req.method === "PATCH") {
    const { userId, isAdmin } = req.body || {};

    if (!userId || typeof isAdmin !== "boolean") {
      return res.status(400).json({ error: "userId (string) and isAdmin (boolean) are required" });
    }

    // Only superadmins can change is_admin
    const actor = await getActorInfo(req);
    if (!isSuperadmin(actor.actorEmail)) {
      return res
        .status(403)
        .json({ error: "Superadmin privileges required to change admin status" });
    }

    // Verify the target user exists before updating
    const { data: existing, error: lookupError } = await supabase
      .from("profiles")
      .select("id, email")
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

    // Audit log
    await writeAuditEvent(supabase, {
      actorUserId: actor.actorUserId,
      actorEmail: actor.actorEmail,
      actorType: actor.actorType,
      action: isAdmin ? "create_admin" : "revoke_admin",
      targetUserId: userId,
      targetEmailOrPhone: existing.email || null,
      metadata: { source: "users_api" },
    });

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
