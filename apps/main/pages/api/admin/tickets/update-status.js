/**
 * POST /api/admin/tickets/update-status
 *
 * Updates a ticket's status.
 * Admin-only endpoint.
 *
 * Body: { ticket_id: string, status: 'not_seen_yet' | 'under_review' | 'resolved' }
 *
 * Returns:
 *   200 { ticket: { id, status, resolved_at, updated_at } }
 *   400 validation error
 *   401 unauthorized
 *   404 ticket not found
 *   500 server error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../../lib/adminAuth";

const VALID_STATUSES = ["not_seen_yet", "under_review", "resolved"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || "Unauthorized" });
  }

  const { ticket_id, status } = req.body || {};

  if (!ticket_id || typeof ticket_id !== "string") {
    return res.status(400).json({ error: "ticket_id is required" });
  }
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  const update = {
    status,
    updated_at: new Date().toISOString(),
    resolved_at: status === "resolved" ? new Date().toISOString() : null,
  };

  const { data: ticket, error } = await supabase
    .from("forum_tickets")
    .update(update)
    .eq("id", ticket_id)
    .select("id, status, resolved_at, updated_at")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({ error: "Ticket not found" });
    }
    console.error("[admin/tickets/update-status] error:", error);
    return res.status(500).json({ error: "Failed to update ticket" });
  }

  return res.status(200).json({ ticket });
}
