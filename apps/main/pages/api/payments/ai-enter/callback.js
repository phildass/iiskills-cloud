import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { generateAndDispatchOTP, sendThankYouEmail } from '@lib/otpService';
import { APPS } from '@lib/appRegistry';

/**
 * ai-enter Payment Callback Handler
 *
 * Receives a server-to-server POST from ai-enter after a successful payment
 * at https://aienter.in/payments/iiskills.
 *
 * Security:
 * - Verifies HMAC-SHA256 signature in X-AI-ENTER-SIGNATURE header
 * - Signature is computed over the RAW request body bytes (not re-stringified JSON)
 * - Uses ORIGIN_WEBHOOK_SECRET shared between ai-enter and iiskills
 *
 * Idempotency:
 * - The payments table has a UNIQUE constraint on payment_id
 * - Duplicate razorpay_payment_id values are rejected gracefully
 *
 * On success:
 * - Stores payment record in the payments table
 * - Dispatches a 6-digit OTP to the user's phone (and email if provided)
 * - User then visits /otp-gateway to verify OTP and unlock paid access
 */

// Disable Next.js body parsing so we can read raw bytes for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── 1. Read raw body ───────────────────────────────────────────────────────
  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('[ai-enter callback] Failed to read request body:', err);
    return res.status(400).json({ error: 'Failed to read request body' });
  }

  // ── 2. Verify HMAC-SHA256 signature ───────────────────────────────────────
  const secret = process.env.ORIGIN_WEBHOOK_SECRET;
  if (secret) {
    const receivedSig = req.headers['x-ai-enter-signature'];
    if (!receivedSig) {
      console.error('[ai-enter callback] Missing X-AI-ENTER-SIGNATURE header');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (
      receivedSig.length !== expectedSig.length ||
      !crypto.timingSafeEqual(Buffer.from(receivedSig, 'hex'), Buffer.from(expectedSig, 'hex'))
    ) {
      console.error('[ai-enter callback] Signature mismatch');
      return res.status(401).json({ error: 'Invalid signature' });
    }
  } else {
    console.warn('[ai-enter callback] ORIGIN_WEBHOOK_SECRET not set – skipping signature check');
  }

  // ── 3. Parse body ──────────────────────────────────────────────────────────
  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    console.error('[ai-enter callback] Invalid JSON body:', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const {
    event,
    origin,
    razorpay_payment_id,
    razorpay_order_id,
    amount,
    phone,
    email,
    app_id,
  } = payload;

  // ── 4. Validate required fields ────────────────────────────────────────────
  if (event !== 'payment.success') {
    console.log(`[ai-enter callback] Ignoring event: ${event}`);
    return res.status(200).json({ message: 'Event not processed' });
  }

  if (!razorpay_payment_id) {
    return res.status(400).json({ error: 'razorpay_payment_id is required' });
  }

  if (!phone && !email) {
    return res
      .status(400)
      .json({ error: 'At least one of phone or email is required for OTP delivery' });
  }

  // Determine app; default to a generic paid access token when app_id is absent
  const effectiveAppId = app_id || 'iiskills';
  const appConfig = APPS[effectiveAppId];
  if (!appConfig) {
    // Unknown app_id — still record but log a warning
    console.warn(`[ai-enter callback] Unknown app_id: ${effectiveAppId}`);
  }
  const appName = appConfig?.name || 'iiskills.cloud';

  // ── 5. Idempotency check + store payment record ────────────────────────────
  const supabase = getSupabaseAdmin();
  if (supabase) {
    // Attempt insert; the UNIQUE constraint on payment_id makes this idempotent
    const { error: insertError } = await supabase.from('payments').insert([
      {
        payment_id: razorpay_payment_id,
        payment_gateway: 'aienter',
        app_id: effectiveAppId,
        user_email: email || null,
        user_phone: phone || null,
        amount: amount ? amount / 100 : 0,
        currency: 'INR',
        status: 'captured',
        payment_notes: { razorpay_order_id, origin },
      },
    ]);

    if (insertError) {
      if (
        insertError.code === '23505' ||
        insertError.message?.includes('duplicate') ||
        insertError.message?.includes('unique')
      ) {
        // Already processed – idempotent response
        console.log(
          `[ai-enter callback] Duplicate payment_id ${razorpay_payment_id} – already processed`
        );
        return res.status(200).json({
          success: true,
          message: 'Payment already processed (idempotent)',
          razorpay_payment_id,
        });
      }
      // Non-duplicate DB error — log but continue to OTP dispatch
      console.error('[ai-enter callback] Failed to store payment record:', insertError);
    } else {
      // Newly stored payment — send thank-you email (fire-and-forget)
      const thankYouEmail = email || null;
      if (thankYouEmail) {
        sendThankYouEmail({
          email: thankYouEmail,
          appId: effectiveAppId,
          appName,
          paymentTransactionId: razorpay_payment_id,
        }).catch((err) => console.error('[ai-enter callback] Thank-you email error:', err));
      }
    }
  } else {
    console.warn('[ai-enter callback] Supabase not configured – skipping payment storage');
  }

  // ── 6. Format phone to E.164 ───────────────────────────────────────────────
  let formattedPhone = phone || null;
  if (formattedPhone && !formattedPhone.startsWith('+')) {
    formattedPhone = `+91${formattedPhone}`;
  }

  // ── 7. Generate & dispatch OTP ─────────────────────────────────────────────
  try {
    // generateAndDispatchOTP requires email; use a synthetic one when absent
    const otpEmail = email || `${razorpay_payment_id}@payment.iiskills.cloud`;

    const otpResult = await generateAndDispatchOTP({
      email: otpEmail,
      phone: formattedPhone,
      appId: effectiveAppId,
      appName,
      paymentTransactionId: razorpay_payment_id,
      reason: 'payment_verification',
      adminGenerated: false,
    });

    console.log('[ai-enter callback] OTP dispatched:', {
      razorpay_payment_id,
      effectiveAppId,
      deliveryChannel: otpResult.deliveryChannel,
      emailSent: otpResult.emailSent,
      smsSent: otpResult.smsSent,
    });

    return res.status(200).json({
      success: true,
      message: 'Payment received and OTP sent',
      razorpay_payment_id,
      deliveryChannel: otpResult.deliveryChannel,
    });
  } catch (otpErr) {
    console.error('[ai-enter callback] OTP dispatch failed:', otpErr);
    return res.status(500).json({
      success: false,
      error: 'Payment recorded but OTP dispatch failed',
      razorpay_payment_id,
    });
  }
}
