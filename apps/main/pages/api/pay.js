import Razorpay from 'razorpay';

/**
 * Payment Order Creation Endpoint
 *
 * Creates a Razorpay order for payment processing.
 * Supports both TEST mode (rzp_test_*) and LIVE mode (rzp_live_*) keys.
 *
 * Test mode:
 *   Set RAZORPAY_MODE=test in your environment. The endpoint will validate
 *   that the RAZORPAY_KEY_ID starts with "rzp_test_" and refuse to create
 *   an order if live keys are accidentally configured, preventing unintended
 *   real charges during production-test runs.
 *
 * Environment variables:
 *   RAZORPAY_KEY_ID      — Razorpay key ID (rzp_test_* or rzp_live_*)
 *   RAZORPAY_KEY_SECRET  — Razorpay secret key
 *   RAZORPAY_MODE        — "test" | "live" (default: derived from key prefix)
 *
 * POST /api/pay
 * Body: { email, name, phone, appId, appName, amount }
 * Returns: { success, order, key_id, mode, user, app }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, phone, appId, appName, amount, currency = 'INR', receipt } = req.body;

    // Validate required fields
    if (!email || !appId || !amount) {
      return res.status(400).json({
        error: 'Missing required fields: email, appId, and amount are required',
      });
    }

    // Validate Razorpay credentials
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('[pay] Missing Razorpay credentials');
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    // Detect mode from env or key prefix
    const configuredMode = process.env.RAZORPAY_MODE;
    const keyMode = keyId.startsWith('rzp_test_') ? 'test' : 'live';
    const effectiveMode = configuredMode || keyMode;

    // Safety guard: when RAZORPAY_MODE=test, reject live keys
    if (effectiveMode === 'test' && keyMode !== 'test') {
      console.error('[pay] RAZORPAY_MODE=test but a live key is configured. Refusing order creation.');
      return res.status(500).json({
        error: 'Payment configuration mismatch: test mode requires rzp_test_* keys',
      });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const amountPaise = Math.round(Number(amount)); // round to nearest integer paise
    if (!Number.isInteger(amountPaise) || amountPaise <= 0) {
      return res.status(400).json({ error: 'Invalid amount: must be a positive number (in paise)' });
    }

    const effectiveReceipt = receipt || `receipt_${appId}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt: effectiveReceipt,
      notes: {
        app_id: appId,
        app_name: appName || appId,
        user_email: email,
        mode: effectiveMode,
      },
    });

    return res.status(200).json({
      success: true,
      order,
      key_id: keyId,
      mode: effectiveMode,
      user: { email, name: name || '', phone: phone || '' },
      app: { id: appId, name: appName || appId },
    });
  } catch (error) {
    console.error('[pay] Order creation error:', error?.description || error?.message || error);
    return res.status(500).json({
      error: 'Failed to create payment order',
      ...(process.env.NODE_ENV === 'development' && { details: error?.description || error?.message }),
    });
  }
}
