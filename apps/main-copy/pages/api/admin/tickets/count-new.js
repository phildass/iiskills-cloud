/**
 * GET /api/admin/tickets/count-new
 *
 * Returns the count of tickets with status='not_seen_yet'.
 * Admin-only endpoint.
 *
 * Returns:
 *   200 { count: number }
 *   401 unauthorized
 *   500 server error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../../lib/adminAuth";

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

  const { count, error } = await supabase
    .from("forum_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "not_seen_yet");

  if (error) {
    console.error("[admin/tickets/count-new] error:", error);
    return res.status(500).json({ error: "Failed to count tickets" });
  }

  return res.status(200).json({ count: count ?? 0 });
}
