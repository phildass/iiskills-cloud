import { generateAndDispatchOTP } from '@lib/otpService';
import { APPS } from '@lib/appRegistry';
import { validateAdminRequest } from '../../../lib/adminAuth';

/**
 * Admin OTP Generation API
 * 
 * Per Product Requirements: Admin must be able to generate any number 
 * of OTP codes for any course.
 * 
 * This endpoint allows admins to:
 * - Generate OTPs for any app/course using name + phone (email optional)
 * - Send OTPs via SMS always; email only when provided
 * - Specify reason for generation (free access, error compensation, etc.)
 * - Track admin-generated OTPs in database (including lead_name for auditability)
 * 
 * Security: Requires a valid admin session (admin_session cookie or x-admin-secret header).
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Server-side admin authentication
  const authResult = validateAdminRequest(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { name, email, phone, course, reason, adminGenerated } = req.body;

  // Validate required fields
  if (!name || !phone || !course) {
    return res.status(400).json({ 
      error: 'Name, phone, and course are required!' 
    });
  }

  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }

  // Validate course exists
  const appConfig = APPS[course];
  if (!appConfig) {
    return res.status(400).json({ 
      error: `Unknown course/app: ${course}`,
      availableCourses: Object.keys(APPS),
    });
  }

  // Normalize phone to E.164 — assume India (+91) if no country code
  let formattedPhone = phone.trim();
  if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+91${formattedPhone}`;
  }

  try {
    // Generate and dispatch OTP using centralized service
    const result = await generateAndDispatchOTP({
      email: email || null,
      phone: formattedPhone,
      appId: course,
      appName: appConfig.name,
      reason: reason || 'admin_free_access',
      adminGenerated: adminGenerated !== false, // Default to true for admin generation
      leadName: name,
    });

    // Return success with delivery status
    return res.status(200).json({
      message: 'OTP generated successfully',
      // OTP is not returned for security - only sent via SMS/email
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
