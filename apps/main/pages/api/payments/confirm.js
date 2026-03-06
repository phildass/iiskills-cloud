import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { sendThankYouEmail } from "@lib/otpService";
import { APPS } from "@lib/appRegistry";

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
 * - payment_confirmations table has a UNIQUE constraint on razorpay_payment_id
 * - Duplicate calls return 200 without side-effects
 *
 * On success (Option A — user_token present):
 * - Verifies the short-lived JWT issued by /api/payments/generate-token
 * - Grants an entitlement directly to the identified user (no OTP needed)
 * - Sends a confirmation notification — not an OTP
 *
 * Fallback (no user_token — legacy flow):
 * - Falls back to the OTP dispatch path for backward compatibility
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

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
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
  if (!secret) {
    console.error("[payments/confirm] AIENTER_CONFIRMATION_SIGNING_SECRET is not configured");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

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
    user_token, // Option A: signed JWT from /api/payments/generate-token
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
  // customerPhone required unless user_token provides identity
  if (!user_token && !customerPhone) {
    return res.status(400).json({ error: "customerPhone is required" });
  }
  if (amountPaise === undefined || amountPaise === null) {
    return res.status(400).json({ error: "amountPaise is required" });
  }

  const appConfig = APPS[appId];
  if (!appConfig) {
    console.warn(`[payments/confirm] Unknown appId: ${appId}`);
  }
  const appName = appConfig?.name || "iiskills.cloud";

  // ── 6. Format phone to E.164 ───────────────────────────────────────────────
  let formattedPhone = customerPhone || null;
  if (formattedPhone && !formattedPhone.startsWith("+")) {
    formattedPhone = `+91${formattedPhone}`;
  }

  // ── 7. Store confirmation record (idempotent) ──────────────────────────────
  const supabase = getSupabaseAdmin();
  let confirmationId = null;

  if (supabase) {
    const { data: inserted, error: insertError } = await supabase
      .from("payment_confirmations")
      .insert([
        {
          purchase_id: purchaseId,
          app_id: appId,
          course_slug: courseSlug || null,
          amount_paise: amountPaise,
          currency,
          customer_phone: formattedPhone,
          razorpay_order_id: razorpayOrderId || null,
          razorpay_payment_id: razorpayPaymentId,
          paid_at: paidAt || null,
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      const isDuplicate =
        insertError.code === "23505" ||
        insertError.message?.includes("duplicate") ||
        insertError.message?.includes("unique");

      if (isDuplicate) {
        console.log(
          `[payments/confirm] Duplicate razorpayPaymentId ${razorpayPaymentId} – already processed`
        );
        // Fetch the existing record id for the response
        const { data: existing } = await supabase
          .from("payment_confirmations")
          .select("id")
          .eq("razorpay_payment_id", razorpayPaymentId)
          .single();
        return res.status(200).json({
          success: true,
          confirmationId: existing?.id || null,
          message: "Payment already confirmed (idempotent)",
        });
      }

      console.error("[payments/confirm] Failed to store confirmation record:", insertError);
      // Continue to entitlement/OTP even if storage fails for non-duplicate reasons
    } else {
      confirmationId = inserted?.id || null;
    }
  } else {
    console.warn("[payments/confirm] Supabase not configured – skipping confirmation storage");
  }

  // ── 8. Option A: verify user_token and grant entitlement directly ─────────
  if (user_token) {
    const tokenSecret = process.env.PAYMENT_TOKEN_SECRET;
    if (!tokenSecret) {
      console.error("[payments/confirm] PAYMENT_TOKEN_SECRET not set");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

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

    if (supabase) {
      const { error: entErr } = await supabase.from("entitlements").insert([
        {
          user_id,
          app_id: courseAppId,
          status: "active",
          source: "razorpay",
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
            `[payments/confirm] Entitlement already exists for user=${user_id} app=${courseAppId}`
          );
        }
      } else {
        console.log(`[payments/confirm] Entitlement granted: user=${user_id} app=${courseAppId}`);

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

    return res.status(200).json({
      success: true,
      confirmationId,
      message: "confirmed",
      user_id,
      app_id: courseAppId,
    });
  }

  // ── 9. Legacy fallback: dispatch OTP ─────────────────────────────────────
  // Kept for backward compatibility when user_token is absent.
  const { generateAndDispatchOTP } = await import("@lib/otpService");

  try {
    // generateAndDispatchOTP requires an email field; synthesize when absent.
    const otpEmail = customerEmail || `${razorpayPaymentId}@payment.iiskills.cloud`;

    const otpResult = await generateAndDispatchOTP({
      email: otpEmail,
      phone: formattedPhone,
      appId,
      appName,
      paymentTransactionId: razorpayPaymentId,
      reason: "payment_verification",
      adminGenerated: false,
    });

    console.log("[payments/confirm] OTP dispatched (legacy):", {
      razorpayPaymentId,
      appId,
      deliveryChannel: otpResult.deliveryChannel,
      smsSent: otpResult.smsSent,
    });

    return res.status(200).json({
      success: true,
      confirmationId,
      message: "confirmed",
    });
  } catch (otpErr) {
    console.error("[payments/confirm] OTP dispatch failed:", otpErr);
    return res.status(500).json({
      success: false,
      confirmationId,
      error: "Payment confirmed but OTP dispatch failed",
    });
  }
}
