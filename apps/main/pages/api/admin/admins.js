/**
 * Admin Management API (superadmin only)
 *
 * GET  /api/admin/admins          — list all admin users (profiles.is_admin=true)
 * GET  /api/admin/admins?self=1   — check if the caller is a superadmin (used by useAdminProtectedPage)
 * POST /api/admin/admins          — create admin (set is_admin=true or create an invite)
 * DELETE /api/admin/admins        — revoke admin (set is_admin=false)
 *
 * All mutating actions require SUPERADMIN (email in ADMIN_ALLOWLIST_EMAILS).
 * Regular admins (profiles.is_admin=true) can only read the list.
 *
 * Authentication: admin (cookie or Bearer token via validateAdminRequestAsync)
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

  const actor = await getActorInfo(req);

  // ── GET — list admins or self-check ─────────────────────────────────────────
  if (req.method === "GET") {
    // ?self=1 is used by useAdminProtectedPage to check superadmin status
    if (req.query.self === "1") {
      const superadmin = isSuperadmin(actor.actorEmail);
      if (!superadmin) {
        return res.status(403).json({ error: "Not a superadmin" });
      }
      return res.status(200).json({ superadmin: true });
    }

    // Return admins: profiles with is_admin=true + pending invites
    const [adminsResult, invitesResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, first_name, last_name, is_admin, created_at")
        .eq("is_admin", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("admin_invites")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
    ]);

    if (adminsResult.error) {
      console.error("[admin/admins GET]", adminsResult.error);
      return res.status(500).json({ error: "Failed to fetch admins" });
    }

    return res.status(200).json({
      admins: adminsResult.data || [],
      pendingInvites: invitesResult.data || [],
    });
  }

  // Mutating operations require superadmin
  const callerIsSuperadmin = isSuperadmin(actor.actorEmail);
  if (!callerIsSuperadmin) {
    return res.status(403).json({ error: "Superadmin privileges required" });
  }

  // ── POST — create admin ──────────────────────────────────────────────────────
  if (req.method === "POST") {
    const { email, name } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already has a Supabase account
    const { data: existingUsers, error: lookupError } = await supabase.auth.admin.listUsers();
    if (lookupError) {
      return res.status(500).json({ error: "Failed to look up user" });
    }

    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    let targetUserId = null;

    if (existingUser) {
      // User exists — set is_admin=true in profiles
      targetUserId = existingUser.id;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", existingUser.id);

      if (updateError) {
        console.error("[admin/admins POST] update profile:", updateError);
        return res.status(500).json({ error: "Failed to update user profile" });
      }
    } else {
      // User doesn't exist — create an invite record
      const { error: inviteError } = await supabase.from("admin_invites").upsert(
        {
          email: normalizedEmail,
          name: name || null,
          invited_by_user_id: actor.actorUserId || null,
          invited_by_email: actor.actorEmail || null,
          status: "pending",
        },
        { onConflict: "email" }
      );

      if (inviteError) {
        console.error("[admin/admins POST] upsert invite:", inviteError);
        return res.status(500).json({ error: "Failed to create admin invite" });
      }
    }

    // Audit log
    await writeAuditEvent(supabase, {
      actorUserId: actor.actorUserId,
      actorEmail: actor.actorEmail,
      actorType: actor.actorType,
      action: "create_admin",
      targetUserId,
      targetEmailOrPhone: normalizedEmail,
      metadata: {
        name: name || null,
        user_existed: !!existingUser,
        method: existingUser ? "profile_update" : "invite_created",
      },
    });

    return res.status(201).json({
      success: true,
      method: existingUser ? "profile_updated" : "invite_created",
      targetUserId,
    });
  }

  // ── DELETE — revoke admin ───────────────────────────────────────────────────
  if (req.method === "DELETE") {
    const { user_id, email } = req.body || {};
    if (!user_id && !email) {
      return res.status(400).json({ error: "user_id or email is required" });
    }

    let targetUserId = user_id || null;
    let targetEmail = email || null;

    if (user_id) {
      // Revoke via user_id: clear is_admin in profiles
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_admin: false })
        .eq("id", user_id);

      if (updateError) {
        console.error("[admin/admins DELETE] update profile:", updateError);
        return res.status(500).json({ error: "Failed to revoke admin" });
      }

      // Also look up their email for the audit log
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", user_id)
          .single();
        targetEmail = profile?.email || null;
      } catch {
        // non-fatal
      }
    } else if (email) {
      // Revoke via email: mark invite as revoked (if pending)
      await supabase
        .from("admin_invites")
        .update({ status: "revoked" })
        .eq("email", email.trim().toLowerCase())
        .eq("status", "pending");
    }

    // Audit log
    await writeAuditEvent(supabase, {
      actorUserId: actor.actorUserId,
      actorEmail: actor.actorEmail,
      actorType: actor.actorType,
      action: "revoke_admin",
      targetUserId,
      targetEmailOrPhone: targetEmail,
      metadata: { method: user_id ? "profile_update" : "invite_revoked" },
    });

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
