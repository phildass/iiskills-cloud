import { createClient } from "@supabase/supabase-js";
import sendError from "../../../utils/sendError";

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
 * POST /api/tickets/upload-url
 * Body: { filename: string, contentType: string }
 * Returns a signed upload URL for proof-of-payment files.
 * File path: tickets/{user_id}/{timestamp}-{filename}
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

  const { filename, contentType } = req.body;
  if (!filename) {
    return res.status(400).json({ error: "filename is required" });
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
  if (contentType && !ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({ error: "File type not allowed" });
  }

  // Sanitize filename
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
  const filePath = `${user.id}/${Date.now()}-${safeName}`;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  const { data, error } = await supabase.storage.from("tickets").createSignedUploadUrl(filePath);

  if (error) {
    console.error("[tickets/upload-url] Storage error:", error);
    return res.status(500).json({ error: "Failed to create upload URL" });
  }

  return res.status(200).json({
    uploadUrl: data.signedUrl,
    filePath,
  });
}
