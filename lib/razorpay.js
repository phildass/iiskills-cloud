/**
 * Razorpay Payment Integration
 * 
 * This module provides a centralized Razorpay client configuration
 * for payment processing across the application.
 * 
 * Security Notes:
 * - API keys are stored in environment variables
 * - All payment operations are server-side only
 * - Webhook signature validation is mandatory
 */

import Razorpay from "razorpay";
import crypto from "crypto";

/**
 * Initialize Razorpay client with API credentials
 * @returns {Razorpay} Configured Razorpay instance
 */
export function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Verify Razorpay webhook signature
 * 
 * This is critical for security - ensures the webhook request
 * is genuinely from Razorpay and not a malicious actor.
 * 
 * @param {string} body - Raw request body (stringified JSON)
 * @param {string} signature - Razorpay signature from request header
 * @param {string} secret - Webhook secret from Razorpay dashboard
 * @returns {boolean} True if signature is valid
 */
export function verifyWebhookSignature(body, signature, secret) {
  if (!secret) {
    throw new Error("Razorpay webhook secret is not configured. Please set RAZORPAY_WEBHOOK_SECRET in environment variables.");
  }

  // Generate expected signature using HMAC SHA256
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Generate a secure random OTP
 * 
 * @param {number} length - OTP length (default: 6)
 * @returns {string} Secure random OTP
 */
export function generateSecureOTP(length = 6) {
  // Use crypto.randomInt for cryptographically secure random numbers
  const digits = "0123456789";
  let otp = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  
  return otp;
}

/**
 * Calculate membership expiry date (1 year from now)
 * @returns {Date} Expiry date
 */
export function calculateMembershipExpiry() {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  return expiryDate;
}
