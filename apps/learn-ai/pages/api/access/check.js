/**
 * /api/access/check — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * All apps are now FREE — this endpoint returns hasAccess: true for all users.
 *
 * This endpoint previously checked the database for active entitlement records
 * and was used by TriLevelLandingPage to determine whether to show the payment CTA.
 *
 * When payments are re-introduced, this handler MUST be rebuilt from scratch.
 * See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default async function handler(req, res) {
  // PAYMENT_STUB: All apps are currently free — return hasAccess: true for everyone.
  return res.status(200).json({
    hasAccess: true,
    isAdmin: false,
    freeAccess: true,
    // PAYMENT_STUB: When payments are re-introduced, replace with real entitlement check.
  });
}
