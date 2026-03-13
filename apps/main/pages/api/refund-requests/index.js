/**
 * Refund Requests API (user-facing)
 *
 * GET  /api/refund-requests  — list current user's refund requests
 * POST /api/refund-requests  — submit a new refund request
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * POST body (JSON):
 *   {
 *     purchase_id: string (uuid, optional),
 *     course_slug: string,
 *     amount_paise: number,
 *     reason: string (5–1000 chars)
 *   }
 */

import { createClient } from "@supabase/supabase-js";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  // Authenticate via Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = userData.user.id;

  // ── GET: list user's refund requests ──────────────────────────────────────
  if (req.method === "GET") {
    const { data: requests, error } = await supabase
      .from("refund_requests")
      .select(
        "id, purchase_id, course_slug, amount_paise, reason, status, admin_note, created_at, updated_at"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/refund-requests] GET error:", error);
      return res.status(500).json({ error: "Failed to fetch refund requests" });
    }

    return res.status(200).json({ refundRequests: requests || [] });
  }

  // ── POST: submit a new refund request ─────────────────────────────────────
  const { purchase_id, course_slug, amount_paise, reason } = req.body || {};

  if (!course_slug || typeof course_slug !== "string" || !course_slug.trim()) {
    return res.status(400).json({ error: "course_slug is required" });
  }
  if (typeof amount_paise !== "number" || amount_paise < 0) {
    return res.status(400).json({ error: "amount_paise must be a non-negative number" });
  }
  if (!reason || typeof reason !== "string" || reason.trim().length < 5) {
    return res.status(400).json({ error: "reason must be at least 5 characters" });
  }
  if (reason.trim().length > 1000) {
    return res.status(400).json({ error: "reason must be 1000 characters or fewer" });
  }

  // Check for existing pending/approved request for same purchase
  if (purchase_id) {
    const { data: existing } = await supabase
      .from("refund_requests")
      .select("id, status")
      .eq("user_id", userId)
      .eq("purchase_id", purchase_id)
      .in("status", ["pending", "approved"])
      .maybeSingle();

    if (existing) {
      return res.status(409).json({
        error: "A refund request for this purchase is already pending or approved",
      });
    }
  }

  const insertData = {
    user_id: userId,
    course_slug: course_slug.trim(),
    amount_paise,
    reason: reason.trim(),
    status: "pending",
  };
  if (purchase_id && typeof purchase_id === "string") {
    insertData.purchase_id = purchase_id;
  }

  const { data: newRequest, error: insertError } = await supabase
    .from("refund_requests")
    .insert(insertData)
    .select("id, course_slug, amount_paise, reason, status, created_at")
    .single();

  if (insertError) {
    console.error("[api/refund-requests] POST error:", insertError);
    return res.status(500).json({ error: "Failed to submit refund request" });
  }

  return res.status(201).json({ refundRequest: newRequest });
}
