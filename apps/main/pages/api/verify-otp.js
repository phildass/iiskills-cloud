import { verifyOTP } from '../../lib/otpService';

/**
 * OTP Verification Endpoint
 * 
 * This endpoint verifies that an OTP is:
 * 1. Correct (matches stored OTP)
 * 2. Not expired (within 10-minute validity window)
 * 3. App-specific (matches the app/course for which it was issued)
 * 
 * An OTP issued for one app cannot be used to access another app.
 * This ensures strict app/course isolation and prevents misuse.
 * 
 * Usage:
 * POST /api/verify-otp
 * Body: { email, otp, appId }
 * 
 * Returns:
 * - success: true if OTP is valid
 * - error: description of why verification failed
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, otp, appId } = req.body;

    // Validate required fields
    if (!email || !otp || !appId) {
      return res.status(400).json({
        success: false,
        error: 'Email, OTP, and appId are required',
      });
    }

    // Verify OTP
    const result = await verifyOTP({
      email,
      otp,
      appId,
    });

    if (result.success) {
      // OTP verified successfully
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        appId: result.appId,
        email: result.email,
        // Additional data can be added here if needed
      });
    } else {
      // Verification failed
      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('OTP verification endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred during verification',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}