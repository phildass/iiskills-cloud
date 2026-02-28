/**
 * App-Specific OTP Service
 *
 * Centralized service for generating, dispatching, and verifying OTPs
 * that are bound to specific apps/courses after payment.
 *
 * Key Features:
 * - OTPs are app/course-specific and cannot be reused across apps
 * - Supports SMS (via Vonage) and Email (via SendGrid)
 * - Secure storage with expiration tracking — plain OTP is NEVER stored in DB
 * - OTP hashed via HMAC-SHA256 using OTP_SECRET before storage
 * - Rate limiting and verification attempt tracking
 * - No OTP values returned in API responses (security)
 *
 * Required env vars:
 *   OTP_SECRET — long random string used as HMAC key for OTP hashing
 *
 * @module lib/otpService
 */

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';
import { Vonage } from '@vonage/server-sdk';

// Vonage SMS status codes
const VONAGE_SUCCESS_STATUS = '0';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Vonage (optional - may not be configured in all environments)
let vonageClient = null;
if (process.env.VONAGE_API_KEY && process.env.VONAGE_API_SECRET) {
  try {
    vonageClient = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
  } catch (error) {
    console.error('Failed to initialize Vonage client:', error);
  }
}

/**
 * Retrieve the OTP_SECRET, erroring loudly in non-development if missing.
 * @returns {string} The OTP secret key
 */
function getOtpSecret() {
  const secret = process.env.OTP_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('OTP_SECRET environment variable is required');
    }
    console.warn('[otpService] OTP_SECRET not set — using insecure fallback for development only');
    return 'dev-insecure-fallback-key-do-not-use-in-production';
  }
  return secret;
}

/**
 * Compute an HMAC-SHA256 hash of the OTP bound to its context fields.
 *
 * Message format: `${otp}|${appId}|${paymentTransactionId}|${email}|${phone}`
 * All fields are normalised (lowercase email, trimmed phone, empty string for nulls).
 *
 * @param {Object} params
 * @param {string} params.otp                    - Raw 6-digit OTP
 * @param {string} params.appId                  - App/course identifier
 * @param {string} [params.paymentTransactionId] - Payment transaction ID (empty string when not applicable)
 * @param {string} [params.email]                - User email (normalised to lowercase)
 * @param {string} [params.phone]                - User phone (trimmed)
 * @returns {string} Hex-encoded HMAC-SHA256 hash
 */
export function hashOtp({ otp, appId, paymentTransactionId, email, phone }) {
  const secret = getOtpSecret();
  const normalizedEmail = (email || '').toLowerCase().trim();
  const normalizedPhone = (phone || '').trim();
  const normalizedTxnId = paymentTransactionId || '';
  const message = `${otp}|${appId}|${normalizedTxnId}|${normalizedEmail}|${normalizedPhone}`;
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

/**
 * Generate a secure 6-digit OTP
 * @returns {string} 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
function isValidPhone(phone) {
  // Basic validation: must have at least 10 digits and start with +
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Send OTP via email using SendGrid
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} appId - App identifier
 * @param {string} appName - Human-readable app name
 * @returns {Promise<boolean>} True if email sent successfully
 */
async function sendOTPViaEmail(email, otp, appId, appName) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SendGrid not configured - skipping email send');
    return false;
  }

  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'info@iiskills.cloud',
      subject: `Your OTP for ${appName}`,
      text: `Your OTP is: ${otp}. Valid for 10 minutes. This OTP is specific to ${appName}.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">iiskills.cloud</h1>
          </div>
          
          <div style="background: #f9fafb; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Payment Verification</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Thank you for your payment! Your OTP for <strong>${appName}</strong> is:
            </p>
            
            <div style="background: white; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>⏱ Valid for 10 minutes</strong>
            </p>
            
            <p style="color: #6b7280; font-size: 14px;">
              ⚠️ This OTP is specific to <strong>${appName}</strong> and cannot be used for other apps or courses.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              If you didn't request this OTP or make a payment, please ignore this email or contact support.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
              © ${new Date().getFullYear()} iiskills.cloud - All rights reserved
            </p>
          </div>
        </div>
      `,
    });
    
    console.log(`OTP email sent successfully to ${email} for app ${appId}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

/**
 * Send OTP via SMS using Vonage
 * @param {string} phone - Recipient phone number (E.164 format)
 * @param {string} otp - OTP code
 * @param {string} appId - App identifier
 * @param {string} appName - Human-readable app name
 * @returns {Promise<boolean>} True if SMS sent successfully
 */
async function sendOTPViaSMS(phone, otp, appId, appName) {
  if (!vonageClient || !process.env.VONAGE_BRAND_NAME) {
    console.warn('Vonage not configured - skipping SMS send');
    return false;
  }

  try {
    const response = await vonageClient.sms.send({
      to: phone,
      from: process.env.VONAGE_BRAND_NAME,
      text: `Your iiskills.cloud OTP for ${appName}: ${otp}. Valid for 10 minutes. Do not share this code.`,
    });
    
    // Vonage returns an object with messages array
    // Check if any message was sent successfully (status '0' means success)
    if (response && response.messages && response.messages.length > 0) {
      const message = response.messages[0];
      if (message.status === VONAGE_SUCCESS_STATUS) {
        console.log(`OTP SMS sent successfully to ${phone} for app ${appId}`);
        return true;
      } else {
        console.error(`Vonage SMS failed with status ${message.status}: ${message['error-text']}`);
        return false;
      }
    }
    
    console.error('Vonage SMS: No messages in response');
    return false;
  } catch (error) {
    console.error('Vonage SMS error:', error);
    return false;
  }
}

/**
 * Generate and dispatch OTP after payment
 * 
 * @param {Object} params - OTP generation parameters
 * @param {string} params.email - User's email address (required)
 * @param {string} [params.phone] - User's phone number (optional, E.164 format)
 * @param {string} params.appId - App/course identifier (required)
 * @param {string} params.appName - Human-readable app name (required)
 * @param {string} [params.userId] - User ID if available (optional)
 * @param {string} [params.paymentTransactionId] - Payment transaction ID (optional)
 * @param {string} [params.reason='payment_verification'] - Reason for OTP generation
 * @param {boolean} [params.adminGenerated=false] - Whether OTP was admin-generated
 * @returns {Promise<Object>} Result object with delivery status
 */
export async function generateAndDispatchOTP({
  email,
  phone,
  appId,
  appName,
  userId,
  paymentTransactionId,
  reason = 'payment_verification',
  adminGenerated = false,
}) {
  // Validate required fields
  if (!email || !appId || !appName) {
    throw new Error('Email, appId, and appName are required');
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate phone format if provided
  if (phone && !isValidPhone(phone)) {
    throw new Error('Invalid phone format. Phone must be in E.164 format (e.g., +1234567890)');
  }

  // Normalize identity fields consistently
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone ? phone.trim() : null;

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Compute hash — plain OTP is never stored in DB
  const otpHash = hashOtp({ otp, appId, paymentTransactionId, email: normalizedEmail, phone: normalizedPhone });

  // Determine delivery channel
  let deliveryChannel = 'email';
  if (normalizedPhone && isValidPhone(normalizedPhone)) {
    deliveryChannel = normalizedEmail ? 'both' : 'sms';
  }

  // Invalidate previous unverified OTPs for same user+app to reduce confusion
  const { error: invalidateError } = await supabase
    .from('otps')
    .update({ expires_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('email', normalizedEmail)
    .eq('app_id', appId)
    .is('verified_at', null);

  if (invalidateError) {
    console.error('[otpService] Failed to invalidate previous OTPs:', invalidateError);
  }

  // Send OTP via available channels
  let emailSent = false;
  let smsSent = false;

  if (normalizedEmail) {
    emailSent = await sendOTPViaEmail(normalizedEmail, otp, appId, appName);
  }

  if (normalizedPhone && isValidPhone(normalizedPhone)) {
    smsSent = await sendOTPViaSMS(normalizedPhone, otp, appId, appName);
  }

  // Store only the hash — never the raw OTP
  const { error: dbError } = await supabase.from('otps').insert([
    {
      user_id: userId || null,
      email: normalizedEmail,
      phone: normalizedPhone,
      app_id: appId,
      otp_hash: otpHash,
      expires_at: expiresAt.toISOString(),
      delivery_channel: deliveryChannel,
      email_sent: emailSent,
      sms_sent: smsSent,
      reason,
      payment_transaction_id: paymentTransactionId || null,
      admin_generated: adminGenerated,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  if (dbError) {
    console.error('Database error storing OTP:', dbError);
    throw new Error(`Failed to store OTP: ${dbError.message}`);
  }

  // Return success (NO OTP value for security)
  return {
    success: true,
    deliveryChannel,
    emailSent,
    smsSent,
    expiresAt: expiresAt.toISOString(),
    appId,
    message: `OTP sent successfully via ${deliveryChannel}`,
  };
}

/**
 * Verify OTP for a specific app/course
 *
 * Looks up the most recent eligible OTP row for the given identity + app,
 * then verifies by comparing hashes (never comparing plain OTP values).
 * If paymentTransactionId is provided it must match the stored value.
 *
 * @param {Object} params - Verification parameters
 * @param {string} params.email - User's email address
 * @param {string} params.otp - OTP code to verify
 * @param {string} params.appId - App/course identifier (must match OTP's app)
 * @param {string} [params.paymentTransactionId] - Payment transaction ID (required for payment flow)
 * @returns {Promise<Object>} Verification result
 */
export async function verifyOTP({ email, otp, appId, paymentTransactionId }) {
  // Validate required fields
  if (!email || !otp || !appId) {
    return {
      success: false,
      error: 'Email, OTP, and appId are required',
    };
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format',
    };
  }

  try {
    // Fetch the most recent eligible OTP row for this identity + app
    let query = supabase
      .from('otps')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('app_id', appId)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .lt('verification_attempts', 5)
      .order('created_at', { ascending: false })
      .limit(1);

    // When paymentTransactionId is provided, restrict to that payment's OTP
    if (paymentTransactionId) {
      query = query.eq('payment_transaction_id', paymentTransactionId);
    }

    const { data: otpRecords, error: fetchError } = await query;

    if (fetchError) {
      console.error('Database error fetching OTP:', fetchError);
      return {
        success: false,
        error: 'Failed to verify OTP',
      };
    }

    // Check if an eligible OTP row exists
    if (!otpRecords || otpRecords.length === 0) {
      return {
        success: false,
        error: 'Invalid OTP or OTP not found for this app',
      };
    }

    const otpRecord = otpRecords[0];

    // Hash the user-provided OTP using the same context values that were used when it was
    // stored — crucially, payment_transaction_id comes from the DB row to ensure consistency
    // with the original hash. The DB lookup already enforces the payment_transaction_id
    // match (when provided by the caller), so this is safe.
    const inputHash = hashOtp({
      otp,
      appId,
      paymentTransactionId: otpRecord.payment_transaction_id,
      email: otpRecord.email,
      phone: otpRecord.phone,
    });

    if (inputHash !== otpRecord.otp_hash) {
      // Increment attempt counter on failed verification
      await supabase
        .from('otps')
        .update({
          verification_attempts: otpRecord.verification_attempts + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', otpRecord.id);

      return {
        success: false,
        error: 'Invalid OTP',
      };
    }

    // Hash matches — mark as verified
    const { error: updateError } = await supabase
      .from('otps')
      .update({
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id)
      .is('verified_at', null); // Guard against double-verification

    if (updateError) {
      console.error('Database error updating OTP:', updateError);
      return {
        success: false,
        error: 'Failed to verify OTP',
      };
    }

    // Success!
    return {
      success: true,
      message: 'OTP verified successfully',
      appId: otpRecord.app_id,
      userId: otpRecord.user_id,
      email: otpRecord.email,
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      error: 'An error occurred during verification',
    };
  }
}

/**
 * Check if a valid OTP exists for a user and app
 * 
 * @param {string} email - User's email address
 * @param {string} appId - App/course identifier
 * @returns {Promise<boolean>} True if valid unverified OTP exists
 */
export async function hasValidOTP(email, appId) {
  try {
    const { data: otpRecords, error } = await supabase
      .from('otps')
      .select('expires_at')
      .eq('email', email)
      .eq('app_id', appId)
      .is('verified_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error checking for valid OTP:', error);
      return false;
    }

    return otpRecords && otpRecords.length > 0;
  } catch (error) {
    console.error('Error checking for valid OTP:', error);
    return false;
  }
}

/**
 * Get OTP statistics for monitoring
 * 
 * @param {string} email - User's email address
 * @param {string} appId - App/course identifier
 * @returns {Promise<Object>} OTP statistics
 */
export async function getOTPStats(email, appId) {
  try {
    const { data: otpRecords, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .eq('app_id', appId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching OTP stats:', error);
      return null;
    }

    const total = otpRecords.length;
    const verified = otpRecords.filter(r => r.verified_at).length;
    const expired = otpRecords.filter(r => new Date(r.expires_at) < new Date()).length;
    const pending = total - verified - expired;

    return {
      total,
      verified,
      expired,
      pending,
      recentOTPs: otpRecords,
    };
  } catch (error) {
    console.error('Error fetching OTP stats:', error);
    return null;
  }
}

/**
 * Send a welcome email to a user after their first successful OTP verification.
 *
 * @param {Object} params
 * @param {string} params.email   - Recipient email (normalised)
 * @param {string} params.appId  - App/course identifier
 * @param {string} params.appName - Human-readable app name
 * @returns {Promise<boolean>} True if email sent successfully
 */
export async function sendWelcomeEmail({ email, appId, appName }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('[otpService] SendGrid not configured — skipping welcome email');
    return false;
  }

  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'info@iiskills.cloud',
      subject: `Welcome to ${appName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Welcome to iiskills.cloud</h1>
          </div>
          <div style="background: #f9fafb; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">🎉 You're all set!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Your access to <strong>${appName}</strong> has been verified. Start learning today!
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              If you have any questions, our support team is here to help.
            </p>
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} iiskills.cloud - All rights reserved
            </p>
          </div>
        </div>
      `,
      text: `Welcome to ${appName}! Your access has been verified. Start learning today at iiskills.cloud.`,
    });

    console.log(`[otpService] Welcome email sent to ${email} for app ${appId}`);
    return true;
  } catch (error) {
    console.error('[otpService] Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send a thank-you email to a user after a successful payment.
 *
 * @param {Object} params
 * @param {string} params.email              - Recipient email
 * @param {string} params.appId             - App/course identifier
 * @param {string} params.appName           - Human-readable app name
 * @param {string} params.paymentTransactionId - Payment ID for reference
 * @returns {Promise<boolean>} True if email sent successfully
 */
export async function sendThankYouEmail({ email, appId, appName, paymentTransactionId }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('[otpService] SendGrid not configured — skipping thank-you email');
    return false;
  }

  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'info@iiskills.cloud',
      subject: `Thank you for your payment — Welcome to ${appName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">iiskills.cloud</h1>
          </div>
          <div style="background: #f9fafb; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">🙏 Thank you for your payment!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Your payment for <strong>${appName}</strong> has been received successfully.
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              You will shortly receive a separate email with your OTP to verify your access.
            </p>
            ${paymentTransactionId ? `
            <p style="color: #6b7280; font-size: 14px;">
              Payment reference: <code>${paymentTransactionId}</code>
            </p>
            ` : ''}
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} iiskills.cloud - All rights reserved
            </p>
          </div>
        </div>
      `,
      text: `Thank you for your payment for ${appName}! You will receive an OTP shortly to verify your access. Payment reference: ${paymentTransactionId || 'N/A'}.`,
    });

    console.log(`[otpService] Thank-you email sent to ${email} for app ${appId} (txn: ${paymentTransactionId})`);
    return true;
  } catch (error) {
    console.error('[otpService] Failed to send thank-you email:', error);
    return false;
  }
}

export default {
  hashOtp,
  generateAndDispatchOTP,
  verifyOTP,
  hasValidOTP,
  getOTPStats,
  sendWelcomeEmail,
  sendThankYouEmail,
};
