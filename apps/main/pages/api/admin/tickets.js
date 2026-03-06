import {
  validateAdminRequestAsync,
  createServiceRoleClient,
  getActorInfo,
  writeAuditEvent,
} from "../../../lib/adminAuth";

/**
 * GET /api/admin/tickets
 *   - Returns all tickets (admin view) ordered by created_at desc
 *   - Query params: ?status=open|in_progress|resolved|closed
 *
 * PATCH /api/admin/tickets
 *   - Body: { id, status, admin_note }
 *   - Updates ticket status / admin note + writes audit event
 */
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

  if (req.method === "GET") {
    const { status } = req.query;

    let query = supabase
      .from("forum_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("[admin/tickets GET] DB error:", error);
      return res.status(500).json({ error: "Failed to fetch tickets" });
    }

    // Badge count: number of open tickets
    const openCount = data.filter((t) => t.status === "open").length;

    return res.status(200).json({ tickets: data, openCount });
  }

  if (req.method === "PATCH") {
    const { id, status, admin_note } = req.body;
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const updates = {};
    if (status) updates.status = status;
    if (admin_note !== undefined) updates.admin_note = admin_note;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Fetch existing ticket for audit
    let previousStatus = null;
    let targetUserId = null;
    try {
      const { data: existing } = await supabase
        .from("forum_tickets")
        .select("status, user_id")
        .eq("id", id)
        .single();
      previousStatus = existing?.status || null;
      targetUserId = existing?.user_id || null;
    } catch {
      // non-fatal
    }

    const { data, error } = await supabase
      .from("forum_tickets")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[admin/tickets PATCH] DB error:", error);
      return res.status(500).json({ error: "Failed to update ticket" });
    }

    // Audit log for status changes
    if (status) {
      const actor = await getActorInfo(req);
      await writeAuditEvent(supabase, {
        actorUserId: actor.actorUserId,
        actorEmail: actor.actorEmail,
        actorType: actor.actorType,
        action: "update_ticket_status",
        targetUserId,
        metadata: {
          ticket_id: id,
          previous_status: previousStatus,
          new_status: status,
          admin_note: admin_note || null,
        },
      });
    }

    return res.status(200).json({ ticket: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
