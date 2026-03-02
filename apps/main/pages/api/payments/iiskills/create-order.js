/**
 * POST /api/payments/iiskills/create-order
 *
 * This endpoint is disabled. Razorpay order creation is now handled
 * exclusively by aienter.in. Users are redirected to
 * https://aienter.in/payments/iiskills for all payment processing.
 */
export default function handler(req, res) {
  return res.status(410).json({
    error:
      'This endpoint is no longer available. Payments are processed at https://aienter.in/payments/iiskills',
  });
}
