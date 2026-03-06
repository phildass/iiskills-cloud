/**
 * GET /api/tickets/list
 *
 * Returns the authenticated user's support tickets, newest first.
 *
 * Returns:
 *   200 { tickets: [...] }
 *   401 not authenticated
 *   500 server error
 */

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function getSupabaseUser(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userClient = getSupabaseUser(accessToken);
  if (!userClient) {
    return res.status(500).json({ error: "Service configuration error" });
  }

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // ── Fetch tickets ─────────────────────────────────────────────────────────
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Service configuration error" });
  }

  const { data: tickets, error } = await supabaseAdmin
    .from("forum_tickets")
    .select(
      "id, name, email, phone, issue_type, other_text, proof_path, status, resolved_at, created_at, updated_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[tickets/list] error:", error);
    return res.status(500).json({ error: "Failed to fetch tickets" });
  }

  return res.status(200).json({ tickets: tickets || [] });
}
