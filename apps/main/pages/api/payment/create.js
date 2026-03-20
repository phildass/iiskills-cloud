import { createSupabasePagesServerClient } from "../../../lib/supabase/serverPagesClient";
import { createServiceRoleClient } from "../../../lib/adminAuth";

/**
 * POST /api/payment/create
 *
 * Creates a purchase row in public.purchases.
 *
 * The `user_id` is **always** sourced from the authenticated Supabase session
 * and never from the request body.  This prevents spoofed or null user_id
 * values from reaching the database, which was the root cause of the
 * "Failed to create purchase" error.
 *
 * Authentication: Supabase session cookie or Bearer token in Authorization header.
 *
 * Request body:
 *   { courseSlug: string, amountPaise?: number, currency?: string }
 *
 * Response:
 *   200 { purchaseId: string }
 *   400 { error: string }   — missing courseSlug
 *   401 { error: string }   — unauthenticated
 *   500 { error: string }   — DB insert failure or server misconfiguration
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 1. Authenticate — user_id always from session, never from body ─────────
  const supabase = createSupabasePagesServerClient(req, res);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // Bind purchase exclusively to the session user.
  const userId = user.id;

  const { courseSlug, amountPaise = 0, currency = "INR" } = req.body || {};
  if (!courseSlug) {
    return res.status(400).json({ error: "courseSlug is required" });
  }

  // ── 2. Fetch profile — customer name and phone ─────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, full_name, first_name, last_name")
    .eq("id", userId)
    .maybeSingle();

  const customerPhone = profile?.phone || null;
  const customerName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    null;

  // ── 3. Insert purchase with user_id from session ───────────────────────────
  let adminClient;
  try {
    adminClient = createServiceRoleClient();
  } catch (err) {
    console.error("[payment/create] Service role client unavailable:", err?.message);
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const { data: purchase, error: insertError } = await adminClient
    .from("purchases")
    .insert([
      {
        user_id: userId,
        course_slug: courseSlug,
        customer_phone: customerPhone,
        customer_name: customerName,
        amount_paise: Number(amountPaise) || 0,
        currency,
        status: "created",
        metadata: { user_id: userId, email: user.email || null },
      },
    ])
    .select("id")
    .single();

  if (insertError) {
    console.error("[payment/create] Failed to insert purchase:", {
      code: insertError.code,
      message: insertError.message,
      userId,
      courseSlug,
    });
    return res.status(500).json({ error: "Failed to create purchase" });
  }

  console.log(`[payment/create] Purchase created: id=${purchase.id} user=${userId}`);
  return res.status(200).json({ purchaseId: purchase.id });
}
