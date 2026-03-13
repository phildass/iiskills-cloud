/**
 * Admin Refund Requests API
 *
 * GET  /api/admin/refund-requests         — list all refund requests
 *   ?status=pending|approved|rejected     — optional filter
 *
 * PATCH /api/admin/refund-requests        — update a refund request status
 *   Body: { id, status, admin_note? }
 *
 * Admin-only endpoint (password-cookie auth).
 */

import {
  validateAdminRequest,
  createServiceRoleClient,
  getActorInfo,
  writeAuditEvent,
} from "../../../../lib/adminAuth";

const VALID_STATUSES = ["pending", "approved", "rejected"];

export default async function handler(req, res) {
  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || "Unauthorized" });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  // ── GET: list refund requests ─────────────────────────────────────────────
  if (req.method === "GET") {
    const { status } = req.query;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    let query = supabase
      .from("refund_requests")
      .select(
        "id, user_id, purchase_id, course_slug, amount_paise, reason, status, admin_note, acted_by, acted_at, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error("[admin/refund-requests] GET error:", error);
      return res.status(500).json({ error: "Failed to fetch refund requests" });
    }

    // Enrich with user email from profiles
    const userIds = [...new Set((requests || []).map((r) => r.user_id))];
    let profileMap = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, phone")
        .in("id", userIds);
      (profiles || []).forEach((p) => {
        profileMap[p.id] = p;
      });
    }

    // Enrich with auth.users email (via admin API)
    let emailMap = {};
    for (const uid of userIds) {
      try {
        const { data: userResp } = await supabase.auth.admin.getUserById(uid);
        if (userResp?.user?.email) {
          emailMap[uid] = userResp.user.email;
        }
      } catch {
        // non-fatal
      }
    }

    const enriched = (requests || []).map((r) => ({
      ...r,
      user_email: emailMap[r.user_id] || null,
      user_name: profileMap[r.user_id]
        ? [profileMap[r.user_id].first_name, profileMap[r.user_id].last_name]
            .filter(Boolean)
            .join(" ") || null
        : null,
      user_phone: profileMap[r.user_id]?.phone || null,
    }));

    return res.status(200).json({ refundRequests: enriched });
  }

  // ── PATCH: update status ──────────────────────────────────────────────────
  if (req.method === "PATCH") {
    const { id, status, admin_note } = req.body || {};

    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "id is required" });
    }
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }
    if (admin_note !== undefined && typeof admin_note !== "string") {
      return res.status(400).json({ error: "admin_note must be a string" });
    }
    if (admin_note && admin_note.length > 500) {
      return res.status(400).json({ error: "admin_note must be 500 characters or fewer" });
    }

    const actor = getActorInfo(auth);
    const now = new Date().toISOString();

    const update = {
      status,
      updated_at: now,
      acted_at: now,
      acted_by: actor?.id || "admin",
    };
    if (admin_note !== undefined) {
      update.admin_note = admin_note.trim() || null;
    }

    const { data: updated, error: updateError } = await supabase
      .from("refund_requests")
      .update(update)
      .eq("id", id)
      .select(
        "id, user_id, course_slug, amount_paise, status, admin_note, acted_by, acted_at, updated_at"
      )
      .single();

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return res.status(404).json({ error: "Refund request not found" });
      }
      console.error("[admin/refund-requests] PATCH error:", updateError);
      return res.status(500).json({ error: "Failed to update refund request" });
    }

    // Write audit event
    await writeAuditEvent(supabase, {
      actor_type: actor?.type || "password_admin",
      actor_id: actor?.id || "admin",
      action: `refund_request.${status}`,
      target_type: "refund_request",
      target_id: id,
      metadata: {
        course_slug: updated.course_slug,
        amount_paise: updated.amount_paise,
        admin_note: update.admin_note || null,
      },
    });

    return res.status(200).json({ refundRequest: updated });
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
