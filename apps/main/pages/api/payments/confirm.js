import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { sendThankYouEmail } from "@lib/paymentEmail";
import { APPS } from "@lib/appRegistry";
import checkConfig from "../../../utils/checkConfig";
import sendError from "../../../utils/sendError";
import { invalidateEntitlementCache } from "../../../../packages/shared-utils/lib/entitlementCache";

/**
 * Centralized Payment Confirmation Endpoint  (Option A — token-based flow)
 *
 * Receives a signed server-to-server POST from aienter.in after successful
 * Razorpay webhook verification on their side.
 *
 * Endpoint: POST https://iiskills.cloud/api/payments/confirm
 *
 * Security:
 * - Verifies HMAC-SHA256 signature in x-aienter-signature header
 * - Signature is computed over the RAW request body bytes
 * - Uses AIENTER_CONFIRMATION_SIGNING_SECRET shared between aienter.in and iiskills
 * - Optional replay-protection via x-aienter-timestamp (rejects requests older than 5 min)
 *
 * Idempotency:
 * - purchases table tracks iiskills_ack_at; duplicate calls with the same purchaseId
 *   and razorpayPaymentId return 200 without side-effects
 * - entitlements insert is idempotent via ON CONFLICT handling
 *
 * On success (Option A — user_token required):
 * - Verifies the short-lived JWT issued by /api/payments/generate-token
 * - Updates the purchases row (status='paid', razorpay fields, iiskills_ack_at)
 * - Grants an entitlement into public.entitlements (both app_id and course_slug set to courseAppId)
 * - Marks profiles.is_paid_user=true and paid_at (idempotent)
 * - Sends a confirmation notification email
 */

// Disable Next.js body parsing so we can read raw bytes for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Duration for new entitlements: 1 year in milliseconds
const ENTITLEMENT_DURATION_MS = 365 * 24 * 60 * 60 * 1000;

const MAX_TIMESTAMP_SKEW_SECONDS = 300; // 5 minutes

/** Bundle ID that grants access to both learn-ai and learn-developer. */
const AI_DEVELOPER_BUNDLE_ID = "ai-developer-bundle";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/**
 * Read the raw request body as a Buffer.
 */
function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  try {
    checkConfig(["AIENTER_CONFIRMATION_SIGNING_SECRET", "PAYMENT_TOKEN_SECRET"]);
  } catch (err) {
    console.error("[payments/confirm] Missing required env:", err.message);
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 1. Read raw body ───────────────────────────────────────────────────────
  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error("[payments/confirm] Failed to read request body:", err);
    return res.status(400).json({ error: "Failed to read request body" });
  }

  // ── 2. Verify HMAC-SHA256 signature ───────────────────────────────────────
  const secret = process.env.AIENTER_CONFIRMATION_SIGNING_SECRET;

  const receivedSig = req.headers["x-aienter-signature"];
  if (!receivedSig) {
    console.error("[payments/confirm] Missing x-aienter-signature header");
    return res.status(401).json({ error: "Missing signature" });
  }

  const expectedSig = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  // Constant-time comparison to prevent timing attacks
  let sigValid = false;
  try {
    sigValid =
      receivedSig.length === expectedSig.length &&
      crypto.timingSafeEqual(Buffer.from(receivedSig, "hex"), Buffer.from(expectedSig, "hex"));
  } catch {
    sigValid = false;
  }

  if (!sigValid) {
    console.error("[payments/confirm] Signature mismatch");
    return res.status(401).json({ error: "Invalid signature" });
  }

  // ── 3. Optional replay-protection via timestamp ────────────────────────────
  const tsHeader = req.headers["x-aienter-timestamp"];
  if (tsHeader) {
    const tsSeconds = parseInt(tsHeader, 10);
    if (isNaN(tsSeconds)) {
      return res.status(400).json({ error: "Invalid x-aienter-timestamp" });
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - tsSeconds) > MAX_TIMESTAMP_SKEW_SECONDS) {
      console.error("[payments/confirm] Request timestamp too old or too far in future");
      return res.status(401).json({ error: "Request timestamp out of acceptable range" });
    }
  }

  // ── 4. Parse body ──────────────────────────────────────────────────────────
  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch (err) {
    console.error("[payments/confirm] Invalid JSON body:", err);
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const {
    purchaseId,
    appId,
    courseSlug,
    amountPaise,
    currency = "INR",
    customerPhone,
    customerEmail,
    razorpayOrderId,
    razorpayPaymentId,
    paidAt,
    user_token, // Option A: signed JWT from /api/payments/generate-token (required)
  } = payload;

  // ── 5. Validate required fields ────────────────────────────────────────────
  if (!purchaseId) {
    return res.status(400).json({ error: "purchaseId is required" });
  }
  if (!appId) {
    return res.status(400).json({ error: "appId is required" });
  }
  if (!razorpayPaymentId) {
    return res.status(400).json({ error: "razorpayPaymentId is required" });
  }
  if (!user_token) {
    return res.status(400).json({ error: "user_token is required for payment confirmation." });
  }
  if (amountPaise === undefined || amountPaise === null) {
    return res.status(400).json({ error: "amountPaise is required" });
  }

  const appConfig = APPS[appId];
  if (!appConfig) {
    console.warn(`[payments/confirm] Unknown appId: ${appId}`);
  }
  const appName = appConfig?.name || "iiskills.cloud";

  // ── 6. Verify user_token (Option A — required) ────────────────────────────
  const tokenSecret = process.env.PAYMENT_TOKEN_SECRET;

  let tokenPayload;
  try {
    tokenPayload = jwt.verify(user_token, tokenSecret);
  } catch (err) {
    console.error("[payments/confirm] user_token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired user token" });
  }

  const { user_id, course_slug: tokenCourseSlug } = tokenPayload;
  if (!user_id) {
    return res.status(400).json({ error: "user_token missing user_id claim" });
  }

  const courseAppId = tokenCourseSlug || courseSlug || appId;

  // ── 7. Format phone to E.164 ───────────────────────────────────────────────
  let formattedPhone = customerPhone || null;
  if (formattedPhone && !formattedPhone.startsWith("+")) {
    formattedPhone = `+91${formattedPhone}`;
  }

  // ── 8. Update purchase row in public.purchases (idempotent) ───────────────
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data: existingPurchase, error: fetchError } = await supabase
      .from("purchases")
      .select("id, user_id, razorpay_payment_id, iiskills_ack_at, metadata")
      .eq("id", purchaseId)
      .maybeSingle();

    if (fetchError) {
      console.error("[payments/confirm] Failed to fetch purchase:", fetchError);
      // Continue — don't block entitlement grant on fetch error
    } else if (existingPurchase) {
      // Verify user ownership: prefer dedicated user_id column, fall back to
      // metadata.user_id. Reject if neither is present (cannot verify ownership).
      const purchaseUserId = existingPurchase.user_id || existingPurchase.metadata?.user_id;
      if (!purchaseUserId) {
        console.error(
          `[payments/confirm] Purchase ${purchaseId} has no user_id — ownership unverifiable`
        );
        return res.status(403).json({ error: "Purchase ownership cannot be verified" });
      }
      if (purchaseUserId !== user_id) {
        console.error(
          `[payments/confirm] user_id mismatch: token=${user_id} purchase=${purchaseUserId}`
        );
        return res.status(403).json({ error: "Purchase does not belong to this user" });
      }

      // Idempotency: already acknowledged with the same payment ID
      if (
        existingPurchase.iiskills_ack_at &&
        existingPurchase.razorpay_payment_id === razorpayPaymentId
      ) {
        console.log(`[payments/confirm] Purchase ${purchaseId} already acknowledged (idempotent)`);
        return res.status(200).json({
          success: true,
          purchaseId,
          message: "Payment already confirmed (idempotent)",
          course_slug: courseAppId,
        });
      }

      // Update the purchase to paid
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("purchases")
        .update({
          status: "paid",
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId || null,
          paid_at: paidAt || now,
          iiskills_ack_at: now,
          updated_at: now,
        })
        .eq("id", purchaseId);

      if (updateError) {
        console.error("[payments/confirm] Failed to update purchase:", updateError);
        // Continue to entitlement grant even if purchase update fails
      } else {
        console.log(`[payments/confirm] Purchase ${purchaseId} updated to paid`);
      }
    } else {
      console.warn(
        `[payments/confirm] Purchase ${purchaseId} not found — proceeding with entitlement grant`
      );
    }
  } else {
    console.warn("[payments/confirm] Supabase not configured — skipping purchases update");
  }

  // ── 9. Grant entitlement into public.entitlements (idempotent) ────────────
  if (supabase) {
    const { error: entErr } = await supabase.from("entitlements").insert([
      {
        user_id,
        app_id: courseAppId, // required NOT NULL column — mirrors course_slug
        course_slug: courseAppId, // also stored in course_slug for idempotency index
        status: "active",
        source: "razorpay",
        purchase_id: purchaseId, // links back to the purchase row
        expires_at: new Date(Date.now() + ENTITLEMENT_DURATION_MS).toISOString(),
      },
    ]);

    if (entErr) {
      const isDuplicate =
        entErr.code === "23505" ||
        entErr.message?.includes("duplicate") ||
        entErr.message?.includes("unique");
      if (!isDuplicate) {
        console.error("[payments/confirm] Failed to insert entitlement:", entErr);
      } else {
        console.log(
          `[payments/confirm] Entitlement already exists for user=${user_id} course=${courseAppId}`
        );
      }
    } else {
      console.log(`[payments/confirm] Entitlement granted: user=${user_id} course=${courseAppId}`);

      // ── Invalidate entitlement cache immediately ──────────────────────────
      // This ensures the NEXT call to /api/entitlement reads fresh data from the
      // database instead of a stale cached "not entitled" result.  Both the
      // specific course and the bundle ID are invalidated so all grant paths
      // are covered.
      await Promise.all([
        invalidateEntitlementCache(user_id, courseAppId),
        invalidateEntitlementCache(user_id, AI_DEVELOPER_BUNDLE_ID),
      ]).catch((err) =>
        console.warn("[payments/confirm] Cache invalidation warning:", err.message)
      );

      // Mark user as paid (idempotent)
      await supabase
        .from("profiles")
        .update({ is_paid_user: true })
        .eq("id", user_id)
        .eq("is_paid_user", false);

      await supabase
        .from("profiles")
        .update({ paid_at: new Date().toISOString() })
        .eq("id", user_id)
        .is("paid_at", null);

      // Send confirmation notification (not OTP) — fire-and-forget
      const notifyEmail = tokenPayload.email || customerEmail || null;
      if (notifyEmail) {
        sendThankYouEmail({
          email: notifyEmail,
          appId: courseAppId,
          appName,
          paymentTransactionId: razorpayPaymentId,
        }).catch((err) => console.error("[payments/confirm] Confirmation email error:", err));
      }
    }
  }

  const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud";
  const redirectUrl =
    tokenPayload.return_to ||
    `${mainAppUrl}/complete-registration?course=${encodeURIComponent(courseAppId)}`;

  return res.status(200).json({
    success: true,
    purchaseId,
    message: "confirmed",
    user_id,
    course_slug: courseAppId,
    redirect_url: redirectUrl,
  });
}
