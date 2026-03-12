/**
 * Admin Entitlements API
 *
 * GET  /api/admin/entitlements?user_id=<uuid>
 *   — Returns all entitlements for a user
 *
 * POST /api/admin/entitlements
 *   — Grant entitlement (body: { user_id, app_id, payment_reference?, expires_at? })
 *   — Writes audit event
 *
 * PATCH /api/admin/entitlements
 *   — Revoke entitlement (body: { id })
 *   — Writes audit event
 *
 * Authentication: admin (cookie or Bearer token via validateAdminRequestAsync)
 */

import {
  validateAdminRequestAsync,
  createServiceRoleClient,
  getActorInfo,
  writeAuditEvent,
} from "../../../lib/adminAuth";
import sendError from "../../../utils/sendError";
import checkConfig from "../../../utils/checkConfig";

// Paid app registry — course_title is snapshotted into audit events on grant
const PAID_APPS = [
  { id: "learn-ai", label: "Learn AI" },
  { id: "learn-developer", label: "Learn Developer" },
  { id: "learn-management", label: "Learn Management" },
  { id: "learn-pr", label: "Learn PR" },
  { id: "ai-developer-bundle", label: "AI + Developer Bundle (both apps)" },
];

export function getPaidAppLabel(appId) {
  return PAID_APPS.find((a) => a.id === appId)?.label || appId;
}

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

  // ── GET — list entitlements for a user ─────────────────────────────────────
  if (req.method === "GET") {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required" });
    }

    const { data, error } = await supabase
      .from("entitlements")
      .select("*")
      .eq("user_id", user_id)
      .order("purchased_at", { ascending: false });

    if (error) {
      console.error("[admin/entitlements GET]", error);
      return res.status(500).json({ error: "Failed to fetch entitlements" });
    }

    return res.status(200).json({ entitlements: data || [] });
  }

  // ── POST — grant entitlement ─────────────────────────────────────────────────
  if (req.method === "POST") {
    const { user_id, app_id, payment_reference, expires_at } = req.body || {};

    if (!user_id || !app_id) {
      return res.status(400).json({ error: "user_id and app_id are required" });
    }

    const courseTitle = getPaidAppLabel(app_id);

    // Compute expiry (default 1 year)
    const expiresAt = expires_at
      ? new Date(expires_at).toISOString()
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

    const { data: entitlement, error: insertError } = await supabase
      .from("entitlements")
      .insert({
        user_id,
        app_id,
        status: "active",
        source: "admin",
        payment_reference: payment_reference || null,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[admin/entitlements POST]", insertError);
      return res.status(500).json({ error: insertError.message });
    }

    // Sync profiles.is_paid_user = true
    await supabase
      .from("profiles")
      .update({ is_paid_user: true, paid_at: new Date().toISOString() })
      .eq("id", user_id)
      .is("paid_at", null); // Only set paid_at if not already set

    // Audit log
    const actor = await getActorInfo(req);

    // Lookup target user email for audit
    let targetEmailOrPhone = null;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, phone")
        .eq("id", user_id)
        .single();
      targetEmailOrPhone = profile?.email || profile?.phone || null;
    } catch {
      // non-fatal
    }

    await writeAuditEvent(supabase, {
      actorUserId: actor.actorUserId,
      actorEmail: actor.actorEmail,
      actorType: actor.actorType,
      action: "grant_entitlement",
      targetUserId: user_id,
      targetEmailOrPhone,
      appId: app_id,
      courseTitleSnapshot: courseTitle,
      metadata: {
        entitlement_id: entitlement.id,
        payment_reference: payment_reference || null,
        expires_at: expiresAt,
      },
    });

    return res.status(201).json({ entitlement });
  }

  // ── PATCH — revoke entitlement ───────────────────────────────────────────────
  if (req.method === "PATCH") {
    const { id } = req.body || {};
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    // Fetch existing entitlement before revoking (for audit)
    const { data: existing, error: fetchError } = await supabase
      .from("entitlements")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Entitlement not found" });
    }

    const { data: updated, error: updateError } = await supabase
      .from("entitlements")
      .update({ status: "revoked" })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("[admin/entitlements PATCH]", updateError);
      return res.status(500).json({ error: updateError.message });
    }

    // Audit log
    const actor = await getActorInfo(req);

    let targetEmailOrPhone = null;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, phone")
        .eq("id", existing.user_id)
        .single();
      targetEmailOrPhone = profile?.email || profile?.phone || null;
    } catch {
      // non-fatal
    }

    await writeAuditEvent(supabase, {
      actorUserId: actor.actorUserId,
      actorEmail: actor.actorEmail,
      actorType: actor.actorType,
      action: "revoke_entitlement",
      targetUserId: existing.user_id,
      targetEmailOrPhone,
      appId: existing.app_id,
      courseTitleSnapshot: getPaidAppLabel(existing.app_id),
      metadata: {
        entitlement_id: id,
        previous_status: existing.status,
      },
    });

    return res.status(200).json({ entitlement: updated });
  }

  res.setHeader("Allow", ["GET", "POST", "PATCH"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
