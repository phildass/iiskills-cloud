/**
 * GET  /api/course-messages?course_app_id=learn-ai  — list messages for a course
 * POST /api/course-messages                          — send a new message
 *
 * Authorization: Bearer <access_token>
 *
 * POST body (JSON):
 *   { course_app_id: string, message: string }
 *
 * Security:
 *   - Users can only view / send messages for courses they are enrolled in
 *   - Content is screened through the server-side content filter
 *   - Banned users cannot send new messages
 *   - 3 moderation strikes → automatic ban
 */

import { createClient } from "@supabase/supabase-js";
import {
  checkContent,
  MODERATION_STRIKE_LIMIT,
} from "../../../../../packages/shared-utils/lib/contentFilter";

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

/** Check if the user has an active entitlement for the given app */
async function hasEntitlement(supabaseAdmin, userId, courseAppId) {
  const now = new Date().toISOString();
  const { data } = await supabaseAdmin
    .from("entitlements")
    .select("id")
    .eq("user_id", userId)
    .in("app_id", [courseAppId, "ai-developer-bundle"])
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();
  if (data) return true;

  // Legacy check
  const { data: legacy } = await supabaseAdmin
    .from("user_app_access")
    .select("id")
    .eq("user_id", userId)
    .eq("app_id", courseAppId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();
  return !!legacy;
}

export default async function handler(req, res) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userClient = getSupabaseUser(accessToken);
  if (!userClient) return res.status(500).json({ error: "Service configuration error" });

  const {
    data: { user },
    error: authErr,
  } = await userClient.auth.getUser();
  if (authErr || !user) return res.status(401).json({ error: "Not authenticated" });

  const supabase = getSupabaseAdmin();
  if (!supabase) return res.status(500).json({ error: "Service configuration error" });

  // ── GET: list messages for a course ────────────────────────────────────────
  if (req.method === "GET") {
    const { course_app_id } = req.query;
    if (!course_app_id) {
      return res.status(400).json({ error: "course_app_id query param is required" });
    }

    // Verify entitlement
    const entitled = await hasEntitlement(supabase, user.id, course_app_id);
    if (!entitled) {
      return res.status(403).json({ error: "You do not have access to this course" });
    }

    const { data: messages, error } = await supabase
      .from("course_messages")
      .select(
        "id, user_id, course_app_id, message, is_admin_reply, parent_id, read_by_user, created_at"
      )
      .eq("course_app_id", course_app_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[course-messages GET] error:", error);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    // Also fetch admin replies that reference any of these message ids
    const topLevelIds = messages.filter((m) => !m.is_admin_reply).map((m) => m.id);
    let allMessages = messages;

    if (topLevelIds.length > 0) {
      const { data: replies } = await supabase
        .from("course_messages")
        .select(
          "id, user_id, course_app_id, message, is_admin_reply, parent_id, read_by_user, created_at"
        )
        .in("parent_id", topLevelIds)
        .eq("is_admin_reply", true)
        .order("created_at", { ascending: true });

      if (replies && replies.length > 0) {
        // Merge and sort by created_at
        const replyIds = new Set(replies.map((r) => r.id));
        allMessages = [...messages.filter((m) => !replyIds.has(m.id)), ...replies].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      }
    }

    // Mark unread admin replies as read
    const unreadAdminIds = allMessages
      .filter((m) => m.is_admin_reply && !m.read_by_user)
      .map((m) => m.id);

    if (unreadAdminIds.length > 0) {
      await supabase
        .from("course_messages")
        .update({ read_by_user: true })
        .in("id", unreadAdminIds);
    }

    return res.status(200).json({ messages: allMessages });
  }

  // ── POST: send a new message ─────────────────────────────────────────────
  if (req.method === "POST") {
    const { course_app_id, message } = req.body || {};

    if (!course_app_id || typeof course_app_id !== "string" || !course_app_id.trim()) {
      return res.status(400).json({ error: "course_app_id is required" });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }
    if (message.trim().length > 2000) {
      return res.status(400).json({ error: "message must be 2000 characters or fewer" });
    }

    // Verify entitlement
    const entitled = await hasEntitlement(supabase, user.id, course_app_id);
    if (!entitled) {
      return res.status(403).json({ error: "You do not have access to this course" });
    }

    // Check ban status
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_banned, moderation_strikes")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.is_banned) {
      return res.status(403).json({
        error:
          "Your account has been suspended due to repeated policy violations. Please contact support via a ticket.",
      });
    }

    // Content moderation
    const flagResult = checkContent(message.trim());
    if (flagResult.flagged) {
      // Log the rejection
      await supabase.from("moderation_logs").insert({
        user_id: user.id,
        content_type: "course_message",
        content_snippet: message.trim().slice(0, 200),
        rejection_reason: flagResult.reason,
      });

      // Increment strikes and potentially ban the user
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
        `[course-messages] Content rejected for user ${user.id}: ${flagResult.reason}. Strikes: ${currentStrikes}`
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

    // Insert message
    const { data: newMsg, error: insertErr } = await supabase
      .from("course_messages")
      .insert({
        user_id: user.id,
        course_app_id: course_app_id.trim(),
        message: message.trim(),
        is_admin_reply: false,
        read_by_admin: false,
      })
      .select("id, created_at")
      .single();

    if (insertErr) {
      console.error("[course-messages POST] error:", insertErr);
      return res.status(500).json({ error: "Failed to send message" });
    }

    return res.status(201).json({ message: newMsg });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
