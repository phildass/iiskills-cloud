/**
 * GET  /api/admin/course-messages         — list all unread/all course messages
 * POST /api/admin/course-messages         — reply to a course message thread
 *
 * Admin-only. Uses validateAdminRequest.
 *
 * GET query params:
 *   ?user_id=<uuid>          filter by user
 *   ?course_app_id=<string>  filter by course
 *   ?unread_only=true        only messages not yet seen by admin
 *
 * POST body:
 *   { parent_id: string, message: string }
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../../lib/adminAuth";

export default async function handler(req, res) {
  const auth = validateAdminRequest(req);
  if (!auth.valid) return res.status(403).json({ error: "Forbidden" });

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  // ── GET: list messages ──────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { user_id, course_app_id, unread_only } = req.query;

    let query = supabase
      .from("course_messages")
      .select(
        "id, user_id, course_app_id, message, is_admin_reply, parent_id, read_by_admin, created_at"
      )
      .order("created_at", { ascending: true });

    if (user_id) query = query.eq("user_id", user_id);
    if (course_app_id) query = query.eq("course_app_id", course_app_id);
    if (unread_only === "true") {
      query = query.eq("read_by_admin", false).eq("is_admin_reply", false);
    }

    const { data: messages, error } = await query;
    if (error) {
      console.error("[admin/course-messages GET] error:", error);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    // Mark fetched learner messages as read by admin
    const unreadIds = (messages || [])
      .filter((m) => !m.is_admin_reply && !m.read_by_admin)
      .map((m) => m.id);

    if (unreadIds.length > 0) {
      await supabase.from("course_messages").update({ read_by_admin: true }).in("id", unreadIds);
    }

    return res.status(200).json({ messages: messages || [] });
  }

  // ── POST: reply to a thread ─────────────────────────────────────────────────
  if (req.method === "POST") {
    const { parent_id, message } = req.body || {};

    if (!parent_id || typeof parent_id !== "string") {
      return res.status(400).json({ error: "parent_id is required" });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }
    if (message.trim().length > 2000) {
      return res.status(400).json({ error: "message must be 2000 characters or fewer" });
    }

    // Fetch the parent message to get user_id and course_app_id
    const { data: parent, error: parentErr } = await supabase
      .from("course_messages")
      .select("id, user_id, course_app_id, is_admin_reply")
      .eq("id", parent_id)
      .maybeSingle();

    if (parentErr || !parent) {
      return res.status(404).json({ error: "Parent message not found" });
    }
    if (parent.is_admin_reply) {
      return res
        .status(400)
        .json({ error: "Cannot reply to an admin reply; use the original message id" });
    }

    const { data: reply, error: insertErr } = await supabase
      .from("course_messages")
      .insert({
        user_id: parent.user_id, // reply belongs to the same user thread
        course_app_id: parent.course_app_id,
        message: message.trim(),
        is_admin_reply: true,
        parent_id: parent.id,
        read_by_user: false,
        read_by_admin: true,
      })
      .select("id, created_at")
      .single();

    if (insertErr) {
      console.error("[admin/course-messages POST] error:", insertErr);
      return res.status(500).json({ error: "Failed to send reply" });
    }

    return res.status(201).json({ reply });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
