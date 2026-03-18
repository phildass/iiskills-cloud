import { createSupabasePagesServerClient } from "../../../lib/supabase/serverPagesClient";
import { createServiceRoleClient } from "../../../lib/adminAuth";
import { APPS } from "@lib/appRegistry";
import { getCurrentPricing } from "@iiskills/ui/pricing";

// Utilities for config and error handling
const checkConfig = require("../../../utils/checkConfig");
const sendError = require("../../../utils/sendError");

// Deduplication window: reuse an existing 'created' purchase within this window
// to prevent double-click / double-tab duplicate rows.
const PURCHASE_DEDUP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

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
  try {
    checkConfig(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

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

    const { courseSlug, amountPaise: amountPaiseRaw, currency = "INR" } = req.body || {};
    if (!courseSlug) {
      return res.status(400).json({ error: "courseSlug is required" });
    }

    // ── 1b. Canonical pricing (total incl GST) ────────────────────────────────
    // We intentionally derive the amount server-side to avoid trusting the client.
    const pricing = getCurrentPricing(); // numeric totals
    const canonicalAmountPaise = Math.round(Number(pricing.totalPrice) * 100);

    if (!Number.isFinite(canonicalAmountPaise) || canonicalAmountPaise <= 0) {
      console.error("[create-purchase] Invalid canonicalAmountPaise", {
        pricing,
        canonicalAmountPaise,
      });
      return res.status(500).json({ error: "Server pricing misconfiguration" });
    }

    let amountPaise = Number.isFinite(Number(amountPaiseRaw)) ? Number(amountPaiseRaw) : null;

    // If client didn't send a valid amount, use canonical total (incl GST).
    if (!amountPaise || amountPaise <= 0) {
      amountPaise = canonicalAmountPaise;
    }

    // If client DID send an amount and it doesn't match canonical, reject.
    // (Prevents tampering; allow only canonical amount.)
    if (amountPaiseRaw !== undefined && amountPaise !== canonicalAmountPaise) {
      return res.status(400).json({
        error: "Invalid amountPaise. Please refresh and try again.",
        code: "invalid_amount",
        expectedAmountPaise: canonicalAmountPaise,
      });
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
      sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
      return;
    }

    // Idempotency: reuse an existing "created" purchase for the same
    // user+course+amount that was created within the dedup window.
    // This prevents double-click / double-tab duplicate purchases.
    const dedupWindowStart = new Date(Date.now() - PURCHASE_DEDUP_WINDOW_MS).toISOString();
    const { data: existingPurchase } = await adminClient
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_slug", courseSlug)
      .eq("amount_paise", amountPaise)
      .eq("status", "created")
      .gte("created_at", dedupWindowStart)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPurchase) {
      console.log(
        `[create-purchase] Reusing existing purchase ${existingPurchase.id} for user=${user.id} course=${courseSlug}`
      );
      return res.status(200).json({ purchaseId: existingPurchase.id });
    }
    const { data: purchase, error: insertError } = await adminClient
      .from("purchases")
      .insert([
        {
          user_id: user.id,
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

    console.log(
      `[create-purchase] Purchase created: id=${purchase.id} user=${user.id} course=${courseSlug}`
    );
    return res.status(200).json({ purchaseId: purchase.id });
  } catch (err) {
    console.error("[create-purchase] Caught error:", err);
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }
}
