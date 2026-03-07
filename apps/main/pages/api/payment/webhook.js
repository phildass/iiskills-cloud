import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendThankYouEmail } from "@lib/paymentEmail";
import { APPS } from "@lib/appRegistry";

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_KEY || "");

/**
 * Payment Webhook Handler
 *
 * This endpoint receives payment notifications from Razorpay (or aienter.in)
 * after a user successfully completes payment for a specific app/course.
 *
 * Process:
 * 1. Verify webhook signature for security
 * 2. Extract payment details and app/course identifier
 * 3. Extract user contact information (email and/or phone)
 * 4. Store payment record in database
 * 5. Send confirmation email
 *
 * Security:
 * - Webhook signature verification prevents unauthorized requests
 * - No sensitive data returned in response
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get webhook signature for verification
    const webhookSignature = req.headers["x-razorpay-signature"];

    // Verify webhook signature if secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (webhookSignature !== expectedSignature) {
        console.error("Invalid webhook signature");
        return res.status(401).json({ error: "Invalid signature" });
      }
    }

    // Extract payment data
    const { event, payload } = req.body;

    // Only process payment.captured events
    if (event !== "payment.captured") {
      console.log(`Ignoring event type: ${event}`);
      return res.status(200).json({ message: "Event type not processed" });
    }

    // Extract payment details
    const payment = payload.payment.entity;
    const { id: paymentId, amount, currency, email, contact: phone, notes = {} } = payment;

    // Extract app/course identifier from payment notes
    // Expected format: notes.app_id = 'learn-ai' or notes.course_id = 'learn-ai'
    const appId = notes.app_id || notes.course_id || notes.appId || notes.courseId;

    if (!appId) {
      console.error("Payment missing app/course identifier:", paymentId);
      return res.status(400).json({
        error: "Payment missing app/course identifier",
        message: "Payment notes must include app_id or course_id",
      });
    }

    // Verify app exists
    const appConfig = APPS[appId];
    if (!appConfig) {
      console.error("Unknown app identifier:", appId);
      return res.status(400).json({
        error: "Unknown app identifier",
        appId,
      });
    }

    // Validate contact information - email is required
    if (!email) {
      console.error("Payment missing user email:", paymentId);
      return res.status(400).json({
        error: "Payment missing user email",
        message: "Payment must include user email address",
      });
    }

    // Format phone to E.164 if provided
    let formattedPhone = phone;
    if (phone && !phone.startsWith("+")) {
      // Assume Indian number if no country code
      formattedPhone = `+91${phone}`;
    }

    // Store payment record in database (idempotent — UNIQUE constraint on payment_id)
    const { error: paymentError } = await supabase.from("payments").insert([
      {
        payment_id: paymentId,
        app_id: appId,
        user_email: email,
        user_phone: formattedPhone,
        amount: amount / 100, // Convert from smallest currency unit
        currency,
        status: "captured",
        payment_notes: notes,
        created_at: new Date().toISOString(),
      },
    ]);

    if (paymentError) {
      // Duplicate payment — already processed; respond idempotently
      if (
        paymentError.code === "23505" ||
        paymentError.message?.includes("duplicate") ||
        paymentError.message?.includes("unique")
      ) {
        console.log(`[webhook] Duplicate payment_id ${paymentId} — already processed`);
        return res.status(200).json({
          success: true,
          message: "Payment already processed (idempotent)",
          paymentId,
        });
      }
      console.error("Failed to store payment record:", paymentError);
      // Continue with confirmation email even if storage fails for other reasons
    } else {
      // Newly stored payment — send thank-you email (fire-and-forget)
      sendThankYouEmail({
        email,
        appId,
        appName: appConfig.name,
        paymentTransactionId: paymentId,
      }).catch((err) => console.error("[webhook] Thank-you email error:", err));
    }

    return res.status(200).json({
      success: true,
      message: "Payment processed",
      appId,
    });
  } catch (error) {
    console.error("Payment webhook error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
