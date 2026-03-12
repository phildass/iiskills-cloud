/**
 * GET  /api/tickets/replies?ticket_id=<id>  — list replies for a ticket
 * POST /api/tickets/replies                  — add user reply to a ticket
 *
 * Authorization: Bearer <access_token>
 *
 * POST body (JSON):
 *   { ticket_id: string, message: string }
 *
 * Returns:
 *   200/201 { replies: [...] } / { reply: {...} }
 *   401 not authenticated
 *   403 banned user or wrong ticket owner
 *   404 ticket not found
 *   422 content moderation rejection
 *   500 server error
 */

import { createClient } from "@supabase/supabase-js";
import { checkContent, MODERATION_STRIKE_LIMIT } from "../../../../../packages/shared-utils/lib/contentFilter";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function getSupabaseUser(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) return res.status(401).json({ error: "Not authenticated" });

  const userClient = getSupabaseUser(accessToken);
  if (!userClient) return res.status(500).json({ error: "Service configuration error" });

  const {
    data: { user },
    error: authErr,
  } = await userClient.auth.getUser();
  if (authErr || !user) return res.status(401).json({ error: "Not authenticated" });

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Service configuration error" });

  // ── GET: list replies for a ticket ─────────────────────────────────────────
  if (req.method === "GET") {
    const { ticket_id } = req.query;
    if (!ticket_id) return res.status(400).json({ error: "ticket_id query param is required" });

    // Verify ownership
    const { data: ticket } = await supabase
      .from("forum_tickets")
      .select("id")
      .eq("id", ticket_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const { data: replies, error } = await supabase
      .from("ticket_replies")
      .select("id, is_admin, message, created_at")
      .eq("ticket_id", ticket_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[tickets/replies GET] error:", error);
      return res.status(500).json({ error: "Failed to fetch replies" });
    }

    return res.status(200).json({ replies: replies || [] });
  }

  // ── POST: add user reply ─────────────────────────────────────────────────
  if (req.method === "POST") {
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

    // Check ban status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_banned, moderation_strikes")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_banned) {
      return res.status(403).json({
        error: "Your account has been suspended due to repeated policy violations.",
      });
    }

    // Content moderation
    const flagResult = checkContent(message.trim());
    if (flagResult.flagged) {
      await supabase.from("moderation_logs").insert({
        user_id: user.id,
        content_type: "ticket",
        content_snippet: message.trim().slice(0, 200),
        rejection_reason: flagResult.reason,
      });

      const currentStrikes = (profile?.moderation_strikes || 0) + 1;
      const shouldBan = currentStrikes >= MODERATION_STRIKE_LIMIT;

      await supabase
        .from("profiles")
        .update({
          moderation_strikes: currentStrikes,
          ...(shouldBan ? { is_banned: true, banned_at: new Date().toISOString() } : {}),
        })
        .eq("id", user.id);

      console.warn(
        `[tickets/replies] Content rejected for user ${user.id}: ${flagResult.reason}. Strikes: ${currentStrikes}`
      );

      if (shouldBan) {
        return res.status(403).json({
          error:
            "Your message was rejected and your account has been suspended due to repeated policy violations.",
          flagged: true,
        });
      }

      return res.status(422).json({
        error: `Your message was rejected: ${flagResult.reason}. Please revise your message. (Strike ${currentStrikes} of ${MODERATION_STRIKE_LIMIT})`,
        flagged: true,
        strikes: currentStrikes,
      });
    }

    // Verify ownership
    const { data: ticket } = await supabase
      .from("forum_tickets")
      .select("id, status")
      .eq("id", ticket_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.status === "resolved") {
      return res.status(400).json({ error: "Cannot reply to a resolved ticket" });
    }

    const { data: reply, error: insertErr } = await supabase
      .from("ticket_replies")
      .insert({
        ticket_id,
        user_id: user.id,
        is_admin: false,
        message: message.trim(),
      })
      .select("id, is_admin, message, created_at")
      .single();

    if (insertErr) {
      console.error("[tickets/replies POST] error:", insertErr);
      return res.status(500).json({ error: "Failed to send reply" });
    }

    // Update ticket's updated_at
    await supabase
      .from("forum_tickets")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", ticket_id);

    return res.status(201).json({ reply });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method Not Allowed" });
}
