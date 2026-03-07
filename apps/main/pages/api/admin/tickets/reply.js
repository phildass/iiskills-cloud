/**
 * POST /api/admin/tickets/reply
 *
 * Adds an admin reply to a support ticket.
 * Admin-only endpoint.
 *
 * Body (JSON):
 *   { ticket_id: string, message: string }
 *
 * Returns:
 *   201 { reply: { id, created_at } }
 *   400 validation error
 *   401 unauthorized
 *   404 ticket not found
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

  const { ticket_id, message } = req.body || {};

  if (!ticket_id || typeof ticket_id !== "string") {
    return res.status(400).json({ error: "ticket_id is required" });
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }
  if (message.trim().length > 2000) {
    return res.status(400).json({ error: "message must be 2000 characters or fewer" });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  // Verify ticket exists
  const { data: ticket } = await supabase
    .from("forum_tickets")
    .select("id, user_id, status")
    .eq("id", ticket_id)
    .maybeSingle();

  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  // Insert admin reply
  const { data: reply, error } = await supabase
    .from("ticket_replies")
    .insert({
      ticket_id,
      user_id: ticket.user_id,
      is_admin: true,
      message: message.trim(),
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("[admin/tickets/reply] error:", error);
    return res.status(500).json({ error: "Failed to send reply" });
  }

  // Move ticket to under_review if it was not_seen_yet
  if (ticket.status === "not_seen_yet") {
    await supabase
      .from("forum_tickets")
      .update({ status: "under_review", updated_at: new Date().toISOString() })
      .eq("id", ticket_id);
  }

  return res.status(201).json({ reply });
}
