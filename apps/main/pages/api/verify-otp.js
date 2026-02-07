/**
 * OTP Verification Endpoint
 * 
 * POST /api/verify-otp
 * 
 * Verifies the OTP sent to user's email and activates membership for one year.
 * This is the final step in the payment and membership activation flow.
 * 
 * Security:
 * - OTP has 30-minute expiry
 * - OTP can only be used once
 * - Case-sensitive OTP matching
 * - Rate limiting should be implemented in production
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "appId": "learn-ai",
 *   "otp": "123456"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Membership activated successfully",
 *   "membership": {
 *     "email": "user@example.com",
 *     "app_id": "learn-ai",
 *     "status": "active",
 *     "activated_at": "2024-01-01T00:00:00.000Z",
 *     "expires_at": "2025-01-01T00:00:00.000Z"
 *   }
 * }
 */

import { verifyOTP, getMembership, storeMembership } from "../../../lib/mockDatabase";
import { calculateMembershipExpiry } from "../../../lib/razorpay";

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed. Use POST." 
    });
  }

  try {
    // Extract and validate request body
    const { email, appId, otp } = req.body;

    // Validate required fields
    if (!email || !appId || !otp) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: email, appId, otp",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Validate OTP format (6-8 characters, alphanumeric)
    if (!/^[A-Za-z0-9]{6,8}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP format. OTP should be 6-8 alphanumeric characters.",
      });
    }

    console.log("\n========================================");
    console.log("🔐 OTP Verification Request");
    console.log("========================================");
    console.log("Email:", email);
    console.log("App ID:", appId);
    console.log("OTP:", otp);

    // Check if membership already exists and is active
    const existingMembership = getMembership(email, appId);
    
    if (existingMembership && existingMembership.status === "active") {
      console.log("⚠️  Membership already active");
      console.log("Expires at:", existingMembership.expires_at);
      console.log("========================================\n");
      
      return res.status(200).json({
        success: true,
        message: "Membership already active",
        membership: existingMembership,
      });
    }

    // Verify OTP
    const verificationResult = verifyOTP(email, appId, otp);

    if (!verificationResult.valid) {
      console.log("❌ OTP verification failed:", verificationResult.error);
      console.log("========================================\n");
      
      return res.status(400).json({
        success: false,
        error: verificationResult.error,
        message: "OTP verification failed. Please check your OTP and try again.",
      });
    }

    // OTP is valid - activate membership
    const expiryDate = calculateMembershipExpiry();
    const otpRecord = verificationResult.record;

    const membership = storeMembership(
      email,
      appId,
      expiryDate,
      otpRecord.order_id
    );

    console.log("✅ OTP verified successfully");
    console.log("🎉 Membership activated");
    console.log("Activated at:", membership.activated_at);
    console.log("Expires at:", membership.expires_at);
    console.log("========================================\n");

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Membership activated successfully! Welcome aboard!",
      membership: {
        email: membership.email,
        app_id: membership.app_id,
        status: membership.status,
        activated_at: membership.activated_at,
        expires_at: membership.expires_at,
        order_id: membership.order_id,
      },
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    console.log("========================================\n");

    // Generic error response
    return res.status(500).json({
      success: false,
      error: "OTP verification failed. Please try again.",
      message: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
