import { createSupabasePagesServerClient } from "../../../lib/supabase/serverPagesClient";
import { createServiceRoleClient } from "../../../lib/adminAuth";
import { APPS } from "@lib/appRegistry";

/**
 * Create Purchase Endpoint
 *
 * Creates a purchase row in public.purchases BEFORE the user is redirected to
 * aienter.in. The returned purchaseId is passed to aienter.in and included in
 * the server-to-server callback so iiskills can update the correct row.
 *
 * Endpoint: POST /api/payments/create-purchase
 *
 * Authentication: Supabase session (Bearer token in Authorization header)
 *
 * Request body:
 *   { courseSlug: string, amountPaise?: number, currency?: string }
 *
 * Response:
 *   { purchaseId: string }  — the UUID of the newly created purchase row
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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

  const { courseSlug, amountPaise = 0, currency = "INR" } = req.body || {};
  if (!courseSlug) {
    return res.status(400).json({ error: "courseSlug is required" });
  }

  // ── 2. Fetch profile (phone identity + name) ───────────────────────────────
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("phone, first_name, last_name, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("[create-purchase] profiles select error:", profileError.message);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }

  const customerPhone = profile?.phone || null;
  if (!customerPhone) {
    console.warn("[create-purchase] Profile has no phone — cannot create purchase", {
      userId: user.id,
    });
    return res.status(422).json({
      error: "Phone number is required to create a purchase. Please complete your profile.",
      code: "profile_incomplete",
    });
  }

  const customerName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    null;
  // customerName may be null if the profile has no name fields set yet — that is acceptable;
  // identity is established via user_token in the confirm callback, not via name matching.

  // ── 3. Derive app metadata ─────────────────────────────────────────────────
  const appConfig = APPS[courseSlug];
  const targetAppHost = appConfig?.primaryDomain || null;

  // ── 4. Insert purchase row ─────────────────────────────────────────────────
  let adminClient;
  try {
    adminClient = createServiceRoleClient();
  } catch (err) {
    console.error("[create-purchase] Service role client unavailable:", err?.message);
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const { data: purchase, error: insertError } = await adminClient
    .from("purchases")
    .insert([
      {
        course_slug: courseSlug,
        target_app_host: targetAppHost,
        customer_phone: customerPhone,
        customer_name: customerName,
        amount_paise: amountPaise,
        currency,
        status: "created",
        metadata: { user_id: user.id, email: user.email || null },
      },
    ])
    .select("id")
    .single();

  if (insertError) {
    console.error("[create-purchase] Failed to insert purchase:", {
      code: insertError.code,
      message: insertError.message,
      userId: user.id,
      courseSlug,
    });
    return res.status(500).json({ error: "Failed to create purchase" });
  }

  console.log(`[create-purchase] Purchase created: id=${purchase.id} user=${user.id} course=${courseSlug}`);
  return res.status(200).json({ purchaseId: purchase.id });
}
