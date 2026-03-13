/**
 * GET /api/admin/tickets/proof-url?path=<object_path>
 *
 * Generates a short-lived signed URL for a ticket proof attachment.
 * Admin-only endpoint.
 *
 * Returns:
 *   200 { url: string }
 *   400 missing path
 *   401 unauthorized
 *   500 server error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../../lib/adminAuth";

const SIGNED_URL_EXPIRY_SECONDS = 60 * 60; // 1 hour

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || "Unauthorized" });
  }

  const { path: objectPath } = req.query;
  if (!objectPath || typeof objectPath !== "string") {
    return res.status(400).json({ error: "path query parameter is required" });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  const { data, error } = await supabase.storage
    .from("ticket-proofs")
    .createSignedUrl(objectPath, SIGNED_URL_EXPIRY_SECONDS);

  if (error) {
    console.error("[admin/tickets/proof-url] error:", error);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }

  return res.status(200).json({ url: data.signedUrl });
}
