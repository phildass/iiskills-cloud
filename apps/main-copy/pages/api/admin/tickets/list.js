/**
 * GET /api/admin/tickets/list
 *
 * Returns all tickets for admin review, oldest first.
 * Optional query param: ?status=not_seen_yet|under_review|resolved
 * Admin-only endpoint.
 *
 * Returns:
 *   200 { tickets: [...] }
 *   401 unauthorized
 *   500 server error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../../lib/adminAuth";

const VALID_STATUSES = ["not_seen_yet", "under_review", "resolved"];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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

  const { status } = req.query;

  let query = supabase.from("forum_tickets").select("*").order("created_at", { ascending: true }); // oldest first for admin queue

  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }
    query = query.eq("status", status);
  }

  const { data: tickets, error } = await query;

  if (error) {
    console.error("[admin/tickets/list] error:", error);
    return res.status(500).json({ error: "Failed to fetch tickets" });
  }

  return res.status(200).json({ tickets: tickets || [] });
}
