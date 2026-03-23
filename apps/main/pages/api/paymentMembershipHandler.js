/**
 * /api/paymentMembershipHandler — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * This endpoint returns 503 for all requests.
 *
 * This endpoint previously created Razorpay orders for membership purchases.
 *
 * When payments are re-introduced, this handler MUST be rebuilt from scratch.
 * See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default async function handler(req, res) {
  // PAYMENT_STUB: All payment functionality is currently disabled.
  return res.status(503).json({
    error: "payment_system_disabled",
    message: "The payment system is temporarily unavailable. All courses are currently free.",
  });
}
