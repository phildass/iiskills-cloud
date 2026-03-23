/**
 * /api/payments/ai-enter/callback — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * DEPRECATED — ai-enter Payment Callback (Legacy Endpoint)
 * The payment system has been intentionally DISABLED.
 *
 * This endpoint was previously the callback from aienter.in after payment.
 * It was superseded by /api/payments/confirm.  Both are now disabled.
 *
 * When payments are re-introduced, the full callback flow must be rebuilt
 * from scratch. See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function handler(req, res) {
  res.setHeader("Link", '<https://iiskills.cloud/api/payments/confirm>; rel="successor-version"');
  return res.status(410).json({
    error: "payment_system_disabled",
    message:
      "The payment system is temporarily unavailable. This endpoint is also deprecated; use /api/payments/confirm.",
    successor: "https://iiskills.cloud/api/payments/confirm",
  });
}
