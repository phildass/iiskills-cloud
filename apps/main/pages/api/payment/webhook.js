/**
 * Razorpay Payment Webhook Endpoint
 * 
 * POST /api/payment/webhook
 * 
 * Receives payment notifications from Razorpay and processes successful payments.
 * This endpoint MUST be registered in your Razorpay dashboard under Webhooks.
 * 
 * Security:
 * - CRITICAL: Always verify webhook signature before processing
 * - Use constant-time comparison to prevent timing attacks
 * - Never trust webhook data without signature verification
 * 
 * Flow on Payment Success:
 * 1. Verify webhook signature
 * 2. Extract payment details
 * 3. Generate secure OTP (6-8 characters)
 * 4. Store payment, OTP, and user info in database
 * 5. Send membership email with OTP
 * 
 * Webhook Configuration:
 * URL: https://yourdomain.com/api/payment/webhook
 * Events: payment.captured, payment.failed (optional)
 * Secret: Set RAZORPAY_WEBHOOK_SECRET in environment variables
 */

import { verifyWebhookSignature, generateSecureOTP } from "../../../../lib/razorpay";
import { storePayment, getPayment, storeOTP } from "../../../../lib/mockDatabase";
import { sendMembershipEmail } from "../../../../lib/membershipEmail";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed. Use POST." 
    });
  }

  try {
    // Get signature from headers
    const signature = req.headers["x-razorpay-signature"];
    
    if (!signature) {
      console.error("Webhook signature missing");
      return res.status(400).json({
        success: false,
        error: "Webhook signature missing",
      });
    }

    // Get raw body as string for signature verification
    // Note: Next.js provides req.body as parsed JSON by default
    // For production, you may need to configure bodyParser to get raw body
    const rawBody = JSON.stringify(req.body);

    // CRITICAL: Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    let isValid = false;
    try {
      isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    } catch (error) {
      console.error("Webhook signature verification failed:", error.message);
      return res.status(401).json({
        success: false,
        error: "Webhook signature verification failed",
      });
    }

    if (!isValid) {
      console.error("Invalid webhook signature");
      return res.status(401).json({
        success: false,
        error: "Invalid webhook signature",
      });
    }

    // Signature is valid - process the webhook
    const event = req.body.event;
    const payload = req.body.payload;

    console.log("\n========================================");
    console.log("🔔 Webhook Received:", event);
    console.log("========================================");

    // Handle different webhook events
    switch (event) {
      case "payment.captured":
        return await handlePaymentCaptured(payload, res);
      
      case "payment.failed":
        return await handlePaymentFailed(payload, res);
      
      default:
        console.log("Unhandled webhook event:", event);
        // Acknowledge receipt even for unhandled events
        return res.status(200).json({
          success: true,
          message: "Webhook received but not processed",
        });
    }

  } catch (error) {
    console.error("Webhook processing error:", error);
    
    // Return 500 to let Razorpay retry the webhook
    return res.status(500).json({
      success: false,
      error: "Webhook processing failed",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * Handle successful payment capture
 */
async function handlePaymentCaptured(payload, res) {
  try {
    const payment = payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    console.log("Payment captured:", paymentId);
    console.log("Order ID:", orderId);
    console.log("Amount: ₹", payment.amount / 100);

    // Get stored payment record
    const paymentRecord = getPayment(orderId);
    
    if (!paymentRecord) {
      console.error("Payment record not found for order:", orderId);
      // Still acknowledge to prevent retries
      return res.status(200).json({
        success: true,
        message: "Payment record not found, but webhook acknowledged",
      });
    }

    // Update payment record with capture details
    storePayment({
      ...paymentRecord,
      payment_id: paymentId,
      status: "captured",
      captured_at: new Date().toISOString(),
      method: payment.method,
      bank: payment.bank || null,
      wallet: payment.wallet || null,
    });

    // Extract user details from payment record
    const { email, name, app_id, app_name, amount } = paymentRecord;

    // Generate secure OTP (6 digits)
    const otp = generateSecureOTP(6);

    // Store OTP for verification
    storeOTP(email, app_id, otp, orderId);

    // Send membership email with OTP
    const emailResult = await sendMembershipEmail({
      email,
      name,
      appId: app_id,
      appName: app_name,
      otp,
      orderId,
      amount,
    });

    console.log("✅ Payment processed successfully");
    console.log("OTP generated and stored");
    console.log("Email sent:", emailResult.success ? "Yes" : "Failed");
    console.log("========================================\n");

    // Acknowledge webhook
    return res.status(200).json({
      success: true,
      message: "Payment captured and processed successfully",
      payment_id: paymentId,
      order_id: orderId,
    });

  } catch (error) {
    console.error("Error handling payment capture:", error);
    throw error; // Let parent handler deal with it
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(payload, res) {
  try {
    const payment = payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    console.log("Payment failed:", paymentId);
    console.log("Order ID:", orderId);
    console.log("Error:", payment.error_description);

    // Get stored payment record
    const paymentRecord = getPayment(orderId);
    
    if (paymentRecord) {
      // Update payment record
      storePayment({
        ...paymentRecord,
        payment_id: paymentId,
        status: "failed",
        failed_at: new Date().toISOString(),
        error_code: payment.error_code,
        error_description: payment.error_description,
      });
    }

    console.log("❌ Payment failure recorded");
    console.log("========================================\n");

    // Acknowledge webhook
    return res.status(200).json({
      success: true,
      message: "Payment failure recorded",
      payment_id: paymentId,
      order_id: orderId,
    });

  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}

/**
 * Next.js API route configuration
 * Disable body parsing to get raw body for signature verification
 * 
 * Note: This configuration may need adjustment based on Next.js version
 */
export const config = {
  api: {
    bodyParser: true, // For demo, we use parsed body
    // In production, you might need: bodyParser: false
    // And handle raw body parsing manually for signature verification
  },
};
