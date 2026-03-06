/**
 * Phone validation utilities shared between the payment flow and tests.
 *
 * Exported functions:
 *   isValidIndianPhone(raw) — client-side check for 10-digit Indian mobile numbers
 */

/**
 * Validate a raw phone input as an Indian mobile number.
 * Accepts 10-digit numbers (with optional +91 or 91 prefix).
 * The local 10 digits must start with 6–9.
 *
 * @param {string} raw
 * @returns {boolean}
 */
export function isValidIndianPhone(raw) {
  if (!raw) return false;
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  let local = digits;
  if (local.length === 12 && local.startsWith("91")) local = local.slice(2);
  return /^[6-9]\d{9}$/.test(local);
}
