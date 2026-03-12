import { createSupabasePagesServerClient } from "../../../lib/supabase/serverPagesClient";
import { createServiceRoleClient } from "../../../lib/adminAuth";
import sendError from "../../../utils/sendError";
import checkConfig from "../../../utils/checkConfig";

/**
 * Purchase Details Endpoint
 *
 * Returns course_slug and status for a given purchaseId.
 * Only returns the purchase if it belongs to the authenticated user.
 *
 * Used by the payment recovery page (/payments/recover) to determine
 * the correct course so the user can re-initiate the payment flow.
 *
 * Endpoint: GET /api/payments/purchase-details?purchaseId=<uuid>
 *
 * Authentication: Supabase session (Bearer token in Authorization header or cookie)
 *
 * Response:
 *   { purchaseId, courseSlug, status }
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { purchaseId } = req.query;
  if (!purchaseId || typeof purchaseId !== "string") {
    return res.status(400).json({ error: "purchaseId is required" });
  }

  // ── 1. Authenticate ────────────────────────────────────────────────────────
  const supabase = createSupabasePagesServerClient(req, res);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // ── 2. Look up the purchase ────────────────────────────────────────────────
  let adminClient;
  try {
    checkConfig(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
    adminClient = createServiceRoleClient();
  } catch (err) {
    console.error("[purchase-details] Service role client unavailable:", err?.message);
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  const { data: purchase, error: fetchError } = await adminClient
    .from("purchases")
    .select("id, user_id, course_slug, status")
    .eq("id", purchaseId)
    .maybeSingle();

  if (fetchError) {
    console.error("[purchase-details] Failed to fetch purchase:", fetchError.message);
    return res.status(500).json({ error: "Failed to fetch purchase details" });
  }

  if (!purchase) {
    return res.status(404).json({ error: "Purchase not found" });
  }

  // ── 3. Verify ownership ────────────────────────────────────────────────────
  if (purchase.user_id !== user.id) {
    return res.status(403).json({ error: "Purchase does not belong to this user" });
  }

  return res.status(200).json({
    purchaseId: purchase.id,
    courseSlug: purchase.course_slug,
    status: purchase.status,
  });
}
