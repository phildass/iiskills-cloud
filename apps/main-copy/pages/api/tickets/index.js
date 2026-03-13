import { createClient } from "@supabase/supabase-js";
import sendError from "../../../utils/sendError";

const VALID_ISSUE_TYPES = [
  "payment_auth_not_made",
  "payment_wrongly_made_refund",
  "paid_course_not_satisfactory",
  "other",
];

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getSupabaseAnon() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * GET  /api/tickets  — list caller's tickets
 * POST /api/tickets  — raise a new ticket
 */
export default async function handler(req, res) {
  // ── Auth: require a valid Bearer token ──────────────────────────────────────
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const accessToken = authHeader.slice(7);

  const supabaseAnon = getSupabaseAnon();
  if (!supabaseAnon) {
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  const {
    data: { user },
    error: authErr,
  } = await supabaseAnon.auth.getUser(accessToken);

  if (authErr || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  // ── GET: return user's tickets ───────────────────────────────────────────────
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("forum_tickets")
      .select("id, issue_type, other_text, status, created_at, updated_at, name, phone, email")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[tickets GET] DB error:", error);
      return res.status(500).json({ error: "Failed to fetch tickets" });
    }
    return res.status(200).json({ tickets: data });
  }

  // ── POST: create a new ticket ────────────────────────────────────────────────
  if (req.method === "POST") {
    const { name, phone, email, issue_type, other_text, proof_file_path } = req.body;

    // Validate required fields
    if (!name || !email || !issue_type) {
      return res.status(400).json({ error: "name, email, and issue_type are required" });
    }
    if (!VALID_ISSUE_TYPES.includes(issue_type)) {
      return res.status(400).json({ error: "Invalid issue_type" });
    }
    if (issue_type === "other" && (!other_text || other_text.trim().length === 0)) {
      return res.status(400).json({ error: "other_text is required when issue_type is 'other'" });
    }
    if (other_text && other_text.length > 100) {
      return res.status(400).json({ error: "other_text must be 100 characters or fewer" });
    }

    const { data, error } = await supabase
      .from("forum_tickets")
      .insert([
        {
          user_id: user.id,
          name: name.trim(),
          phone: phone?.trim() || null,
          email: email.trim().toLowerCase(),
          issue_type,
          other_text: issue_type === "other" ? other_text.trim() : null,
          proof_file_path: proof_file_path || null,
        },
      ])
      .select("id, issue_type, status, created_at")
      .single();

    if (error) {
      console.error("[tickets POST] DB error:", error);
      return res.status(500).json({ error: "Failed to create ticket" });
    }

    return res.status(201).json({ ticket: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
