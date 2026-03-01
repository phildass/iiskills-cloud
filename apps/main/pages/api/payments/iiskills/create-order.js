import Razorpay from 'razorpay';
import { getCurrentPricing } from '../../../../utils/pricing';

/**
 * POST /api/payments/iiskills/create-order
 *
 * Creates a Razorpay order for an iiskills.cloud course enrollment.
 *
 * Request body:
 *   { course: string, name: string, phone: string }
 *
 * Response (200):
 *   { order: { id, amount, currency, ... }, keyId: string }
 *
 * The amount is always derived from the server-side pricing module so the
 * client cannot tamper with it.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('[create-order] Razorpay credentials not configured');
    return res.status(500).json({ error: 'Payment service not configured' });
  }

  const { course, name, phone } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'name and phone are required' });
  }

  // Derive amount server-side to prevent client-side tampering
  const pricing = getCurrentPricing();
  const amountPaise = Math.round(pricing.totalPrice * 100); // e.g. 11682 paise

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `iiskills_${course || 'course'}_${Date.now()}`,
      notes: {
        app_id: course || 'iiskills',
        buyer_name: name,
        buyer_phone: phone,
      },
    });

    return res.status(200).json({ order, keyId });
  } catch (err) {
    console.error('[create-order] Razorpay order creation failed:', err);
    return res.status(500).json({
      error: 'Failed to create payment order',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    });
  }
}
