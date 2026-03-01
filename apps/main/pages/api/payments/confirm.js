import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { generateAndDispatchOTP } from '@lib/otpService';
import { APPS } from '@lib/appRegistry';

/**
 * Centralized Payment Confirmation Endpoint
 *
 * Receives a signed server-to-server POST from aienter.in after successful
 * Razorpay webhook verification on their side.
 *
 * Endpoint: POST https://iiskills.cloud/api/payments/confirm
 *
 * Security:
 * - Verifies HMAC-SHA256 signature in x-aienter-signature header
 * - Signature is computed over the RAW request body bytes
 * - Uses AIENTER_CONFIRMATION_SIGNING_SECRET shared between aienter.in and iiskills
 * - Optional replay-protection via x-aienter-timestamp (rejects requests older than 5 min)
 *
 * Idempotency:
 * - payment_confirmations table has a UNIQUE constraint on razorpay_payment_id
 * - Duplicate calls return 200 without side-effects
 *
 * On success:
 * - Stores record in payment_confirmations table
 * - Dispatches a 6-digit OTP to the customer's phone (and email if provided)
 * - User then visits /otp-gateway to verify OTP and unlock paid access
 */

// Disable Next.js body parsing so we can read raw bytes for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_TIMESTAMP_SKEW_SECONDS = 300; // 5 minutes

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
    console.error('[payments/confirm] Failed to read request body:', err);
    return res.status(400).json({ error: 'Failed to read request body' });
  }

  // ── 2. Verify HMAC-SHA256 signature ───────────────────────────────────────
  const secret = process.env.AIENTER_CONFIRMATION_SIGNING_SECRET;
  if (!secret) {
    console.error('[payments/confirm] AIENTER_CONFIRMATION_SIGNING_SECRET is not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const receivedSig = req.headers['x-aienter-signature'];
  if (!receivedSig) {
    console.error('[payments/confirm] Missing x-aienter-signature header');
    return res.status(401).json({ error: 'Missing signature' });
  }

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  let sigValid = false;
  try {
    sigValid =
      receivedSig.length === expectedSig.length &&
      crypto.timingSafeEqual(Buffer.from(receivedSig, 'hex'), Buffer.from(expectedSig, 'hex'));
  } catch {
    sigValid = false;
  }

  if (!sigValid) {
    console.error('[payments/confirm] Signature mismatch');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // ── 3. Optional replay-protection via timestamp ────────────────────────────
  const tsHeader = req.headers['x-aienter-timestamp'];
  if (tsHeader) {
    const tsSeconds = parseInt(tsHeader, 10);
    if (isNaN(tsSeconds)) {
      return res.status(400).json({ error: 'Invalid x-aienter-timestamp' });
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (Math.abs(nowSeconds - tsSeconds) > MAX_TIMESTAMP_SKEW_SECONDS) {
      console.error('[payments/confirm] Request timestamp too old or too far in future');
      return res.status(401).json({ error: 'Request timestamp out of acceptable range' });
    }
  }

  // ── 4. Parse body ──────────────────────────────────────────────────────────
  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch (err) {
    console.error('[payments/confirm] Invalid JSON body:', err);
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const {
    purchaseId,
    appId,
    courseSlug,
    amountPaise,
    currency = 'INR',
    customerPhone,
    razorpayOrderId,
    razorpayPaymentId,
    paidAt,
  } = payload;

  // ── 5. Validate required fields ────────────────────────────────────────────
  if (!purchaseId) {
    return res.status(400).json({ error: 'purchaseId is required' });
  }
  if (!appId) {
    return res.status(400).json({ error: 'appId is required' });
  }
  if (!razorpayPaymentId) {
    return res.status(400).json({ error: 'razorpayPaymentId is required' });
  }
  if (!customerPhone) {
    return res.status(400).json({ error: 'customerPhone is required' });
  }
  if (amountPaise === undefined || amountPaise === null) {
    return res.status(400).json({ error: 'amountPaise is required' });
  }

  const appConfig = APPS[appId];
  if (!appConfig) {
    console.warn(`[payments/confirm] Unknown appId: ${appId}`);
  }
  const appName = appConfig?.name || 'iiskills.cloud';

  // ── 6. Format phone to E.164 ───────────────────────────────────────────────
  let formattedPhone = customerPhone;
  if (formattedPhone && !formattedPhone.startsWith('+')) {
    formattedPhone = `+91${formattedPhone}`;
  }

  // ── 7. Store confirmation record (idempotent) ──────────────────────────────
  const supabase = getSupabaseAdmin();
  let confirmationId = null;

  if (supabase) {
    const { data: inserted, error: insertError } = await supabase
      .from('payment_confirmations')
      .insert([
        {
          purchase_id: purchaseId,
          app_id: appId,
          course_slug: courseSlug || null,
          amount_paise: amountPaise,
          currency,
          customer_phone: formattedPhone,
          razorpay_order_id: razorpayOrderId || null,
          razorpay_payment_id: razorpayPaymentId,
          paid_at: paidAt || null,
        },
      ])
      .select('id')
      .single();

    if (insertError) {
      const isDuplicate =
        insertError.code === '23505' ||
        insertError.message?.includes('duplicate') ||
        insertError.message?.includes('unique');

      if (isDuplicate) {
        console.log(
          `[payments/confirm] Duplicate razorpayPaymentId ${razorpayPaymentId} – already processed`
        );
        // Fetch the existing record id for the response
        const { data: existing } = await supabase
          .from('payment_confirmations')
          .select('id')
          .eq('razorpay_payment_id', razorpayPaymentId)
          .single();
        return res.status(200).json({
          success: true,
          confirmationId: existing?.id || null,
          message: 'Payment already confirmed (idempotent)',
        });
      }

      console.error('[payments/confirm] Failed to store confirmation record:', insertError);
      // Continue to OTP dispatch even if storage fails for non-duplicate reasons
    } else {
      confirmationId = inserted?.id || null;
    }
  } else {
    console.warn('[payments/confirm] Supabase not configured – skipping confirmation storage');
  }

  // ── 8. Dispatch OTP to customer phone ─────────────────────────────────────
  try {
    // generateAndDispatchOTP requires an email field for OTP record-keeping.
    // This endpoint receives phone-only confirmations from aienter.in, so we
    // synthesize a deterministic internal email address. No email is actually
    // sent to this address; OTP delivery goes to the customerPhone via SMS.
    const otpEmail = `${razorpayPaymentId}@payment.iiskills.cloud`;

    const otpResult = await generateAndDispatchOTP({
      email: otpEmail,
      phone: formattedPhone,
      appId,
      appName,
      paymentTransactionId: razorpayPaymentId,
      reason: 'payment_verification',
      adminGenerated: false,
    });

    console.log('[payments/confirm] OTP dispatched:', {
      razorpayPaymentId,
      appId,
      deliveryChannel: otpResult.deliveryChannel,
      smsSent: otpResult.smsSent,
    });

    return res.status(200).json({
      success: true,
      confirmationId,
      message: 'confirmed',
    });
  } catch (otpErr) {
    console.error('[payments/confirm] OTP dispatch failed:', otpErr);
    return res.status(500).json({
      success: false,
      confirmationId,
      error: 'Payment confirmed but OTP dispatch failed',
    });
  }
}
