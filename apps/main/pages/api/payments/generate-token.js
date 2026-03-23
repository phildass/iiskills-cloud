/**
 * /api/payments/generate-token — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * This endpoint returns 503 for all requests.
 *
 * This endpoint previously generated a short-lived signed JWT (HMAC-SHA256)
 * that was passed to aienter.in so the server-to-server callback could
 * identify the user without OTP.
 *
 * When payments are re-introduced, this handler MUST be rebuilt from scratch
 * with a full security review. DO NOT restore the old implementation from git
 * without re-verifying: authentication, admin bypass guard, JWT signing,
 * phone validation, and token expiry.
 *
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
