import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

/**
 * Admin OTP Generation API
 * 
 * Per Product Requirements: Admin must be able to generate any number 
 * of OTP codes for any course.
 * 
 * This endpoint allows admins to:
 * - Generate OTPs for any course
 * - Send OTPs via email and SMS
 * - Specify reason for generation (free access, error compensation, etc.)
 * - Track admin-generated OTPs in database
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, phone, course, reason, adminGenerated } = req.body;

  // Validate required fields
  if (!email || !phone || !course) {
    return res.status(400).json({ 
      error: 'Email, phone, and course are required!' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to Supabase with metadata
    const { error: dbError } = await supabase.from('otps').insert([
      {
        email,
        phone,
        otp,
        expires_at: expiresAt,
        course,
        reason: reason || 'admin_generated',
        admin_generated: adminGenerated || false,
        created_at: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ 
        error: `Database error: ${dbError.message}` 
      });
    }

    // Send OTP via email (SendGrid)
    let emailSent = false;
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL || 'info@iiskills.cloud',
          subject: `Your OTP for ${course}`,
          text: `Your OTP is: ${otp}. Valid for 10 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">iiskills.cloud OTP Verification</h2>
              <p>Your OTP for <strong>${course}</strong> is:</p>
              <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #6b7280;">This OTP is valid for 10 minutes.</p>
              <p style="color: #6b7280; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (emailErr) {
        console.error('SendGrid error:', emailErr);
        // Continue even if email fails
      }
    }

    // Send OTP via SMS (Twilio)
    let smsSent = false;
    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your iiskills.cloud OTP for ${course}: ${otp}. Valid for 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });
        smsSent = true;
      } catch (smsErr) {
        console.error('Twilio error:', smsErr);
        // Continue even if SMS fails
      }
    }

    // Return success with delivery status
    return res.status(200).json({
      message: 'OTP generated successfully',
      otp, // Include OTP in response for admin visibility
      emailSent,
      smsSent,
      expiresAt: expiresAt.toISOString(),
      course,
    });
  } catch (error) {
    console.error('OTP generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate OTP',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
