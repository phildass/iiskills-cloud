import { generateAndDispatchOTP } from '../../../lib/otpService';
import { APPS } from '../../../lib/appRegistry';

/**
 * Admin OTP Generation API
 * 
 * Per Product Requirements: Admin must be able to generate any number 
 * of OTP codes for any course.
 * 
 * This endpoint allows admins to:
 * - Generate OTPs for any app/course
 * - Send OTPs via email (required) and SMS (optional)
 * - Specify reason for generation (free access, error compensation, etc.)
 * - Track admin-generated OTPs in database
 * 
 * Note: This uses the centralized OTP service which ensures app-specific
 * OTP binding and proper security. Email is required as it's the primary
 * delivery channel and used for user identification.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phone, course, reason, adminGenerated } = req.body;

  // Validate required fields
  if (!email || !course) {
    return res.status(400).json({ 
      error: 'Email and course are required!' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate course exists
  const appConfig = APPS[course];
  if (!appConfig) {
    return res.status(400).json({ 
      error: `Unknown course/app: ${course}`,
      availableCourses: Object.keys(APPS),
    });
  }

  // Format phone to E.164 if provided
  let formattedPhone = phone;
  if (phone && !phone.startsWith('+')) {
    // Assume Indian number if no country code
    formattedPhone = `+91${phone}`;
  }

  try {
    // Generate and dispatch OTP using centralized service
    const result = await generateAndDispatchOTP({
      email,
      phone: formattedPhone || null,
      appId: course,
      appName: appConfig.name,
      reason: reason || 'admin_generated',
      adminGenerated: adminGenerated !== false, // Default to true for admin generation
    });

    // Return success with delivery status
    return res.status(200).json({
      message: 'OTP generated successfully',
      // OTP is not returned for security - only sent via email/SMS
      emailSent: result.emailSent,
      smsSent: result.smsSent,
      deliveryChannel: result.deliveryChannel,
      expiresAt: result.expiresAt,
      course,
      appName: appConfig.name,
    });
  } catch (error) {
    console.error('Admin OTP generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate OTP',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
