/**
 * /api/payments/confirm — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * This endpoint returns 503 for all requests.
 *
 * This endpoint previously received a signed server-to-server POST from
 * aienter.in after successful Razorpay webhook verification, then:
 *  - Verified the HMAC-SHA256 signature
 *  - Updated the purchases row (status='paid')
 *  - Granted an entitlement in public.entitlements
 *  - Marked profiles.is_paid_user=true
 *  - Sent a confirmation email
 *  - Invalidated the entitlement cache
 *
 * When payments are re-introduced, this handler MUST be rebuilt from scratch
 * with full security review: signature verification, replay protection,
 * idempotency, entitlement granting, and email notification.
 *
 * See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Disable Next.js body parsing (preserved for when this endpoint is re-implemented).
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // PAYMENT_STUB: All payment functionality is currently disabled.
  return res.status(503).json({
    error: "payment_system_disabled",
    message: "The payment system is temporarily unavailable.",
  });
}
