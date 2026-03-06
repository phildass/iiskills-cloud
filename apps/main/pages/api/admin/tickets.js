import { createClient } from "@supabase/supabase-js";
import { validateAdminRequest } from "../../../lib/adminAuth";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * GET /api/admin/tickets
 *   - Returns all tickets (admin view) ordered by created_at desc
 *   - Query params: ?status=open|in_progress|resolved|closed
 *
 * PATCH /api/admin/tickets
 *   - Body: { id, status, admin_note }
 *   - Updates ticket status / admin note
 */
export default async function handler(req, res) {
  const adminCheck = validateAdminRequest(req);
  if (!adminCheck.valid) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

    return res.status(200).json({ ticket: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
