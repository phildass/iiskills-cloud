/**
 * /api/payments/purchase-details — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * This endpoint returns 503 for all requests.
 *
 * This endpoint previously returned course_slug and status for a purchaseId.
 * It was used by /payments/recover to look up the course for a failed payment.
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
