/**
 * /api/payments/iiskills/create-order — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * This endpoint is also deprecated (Razorpay order creation moved to aienter.in).
 *
 * When payments are re-introduced, the full payment flow must be rebuilt
 * from scratch. See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function handler(req, res) {
  return res.status(503).json({
    error: "payment_system_disabled",
    message:
      "The payment system is temporarily unavailable. This endpoint is also deprecated.",
  });
}
