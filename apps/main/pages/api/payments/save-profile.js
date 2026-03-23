/**
 * /api/payments/save-profile — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * This endpoint returns 503 for all requests.
 *
 * This endpoint previously saved first_name, last_name, and phone to the user
 * profile as a pre-payment step on the /payments/iiskills page.
 *
 * Helper exports (normalizePhone, isValidE164) are retained as stubs below
 * for any code that may import them.
 *
 * When payments are re-introduced, this handler MUST be rebuilt from scratch.
 * See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// PAYMENT_STUB: phone normalization helpers — preserved as reintroduction markers.
// These helpers were used by generate-token.js.
export function normalizePhone(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  if (hasLeadingPlus) return "+" + digits;
  if (digits.length === 10) return "+91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  return "+91" + digits;
}

export function isValidE164(e164) {
  if (!e164) return false;
  return /^\+[1-9]\d{7,14}$/.test(e164);
}

export default async function handler(req, res) {
  // PAYMENT_STUB: All payment functionality is currently disabled.
  return res.status(503).json({
    error: "payment_system_disabled",
    message: "The payment system is temporarily unavailable. All courses are currently free.",
  });
}
