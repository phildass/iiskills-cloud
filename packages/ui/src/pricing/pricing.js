/**
 * Canonical pricing module for iiskills.cloud
 *
 * Single source of truth – import from @iiskills/ui/pricing.
 *
 * Pricing rules:
 *  - Until 2026-03-31 (inclusive, local date):
 *      Base: Rs 99 · GST 18% (Rs 17.82) · Total: Rs 116.82
 *      Display: "Effective till March 31, 2026"
 *  - From 2026-04-01 onward:
 *      Base: Rs 299 · GST 18% (Rs 53.82) · Total: Rs 352.82
 *      Display: "New prices effective from April 01, 2026"
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const GST_RATE = 0.18;

export const OLD_PRICE = 99;
export const NEW_PRICE = 299;

/**
 * Last calendar date (local) on which introductory pricing applies.
 * Comparison is done as "YYYY-MM-DD" strings to be timezone-safe.
 */
export const CUTOFF_DATE = "2026-03-31";

// Pre-calculated for accuracy (avoids floating-point drift)
const OLD_GST = 17.82;
const OLD_TOTAL = 116.82;
const NEW_GST = 53.82;
const NEW_TOTAL = 352.82;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a YYYY-MM-DD string for the supplied date (local calendar).
 */
function toLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Returns true when date falls within the introductory pricing window
 * (i.e. local calendar date ≤ CUTOFF_DATE).
 */
function isIntroPeriod(date) {
  return toLocalDateStr(date) <= CUTOFF_DATE;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Format an amount as INR with 2 decimal places, e.g. "Rs 116.82".
 */
export function formatINR(amount) {
  return `Rs ${amount.toFixed(2)}`;
}

/**
 * @deprecated Use formatINR instead.
 * Kept for backward-compatibility; now returns "Rs X.XX" (not "₹X.XX").
 */
export function formatPrice(amount, includeSymbol = true) {
  const formatted = amount.toFixed(2);
  return includeSymbol ? `Rs ${formatted}` : formatted;
}

/**
 * Compute GST amount given a base price and rate (default GST_RATE).
 */
export function computeGst(base, rate = GST_RATE) {
  return parseFloat((base * rate).toFixed(2));
}

/**
 * Return the effective base price for the given date.
 */
export function getEffectiveBasePrice(date = new Date()) {
  return isIntroPeriod(date) ? OLD_PRICE : NEW_PRICE;
}

/**
 * Full pricing breakdown for the given date.
 *
 * @param {Date} [date]
 * @returns {{
 *   base: number,
 *   gst: number,
 *   total: number,
 *   gstRate: number,
 *   phase: 'intro' | 'standard',
 *   messages: string[]
 * }}
 */
export function getEffectivePricingBreakdown(date = new Date()) {
  const intro = isIntroPeriod(date);
  return {
    base:    intro ? OLD_PRICE  : NEW_PRICE,
    gst:     intro ? OLD_GST    : NEW_GST,
    total:   intro ? OLD_TOTAL  : NEW_TOTAL,
    gstRate: GST_RATE,
    phase:   intro ? "intro" : "standard",
    messages: [
      "Effective till March 31, 2026",
      "New prices effective from April 01, 2026",
    ],
  };
}

/**
 * Get the current pricing (backward-compatible alias for getEffectivePricingBreakdown).
 */
export function getCurrentPricing(date = new Date()) {
  const bd = getEffectivePricingBreakdown(date);
  return {
    basePrice:     bd.base,
    gstRate:       bd.gstRate,
    gstAmount:     bd.gst,
    totalPrice:    bd.total,
    isIntroductory: bd.phase === "intro",
    introEndDate:  new Date(`${CUTOFF_DATE}T23:59:59`),
    currency:      "INR",
    currencySymbol: "Rs",
  };
}

/**
 * Convenience display object (backward-compatible).
 */
export function getPricingDisplay(date = new Date()) {
  const p = getCurrentPricing(date);
  return {
    basePrice:   formatINR(p.basePrice),
    gstAmount:   formatINR(p.gstAmount),
    totalPrice:  formatINR(p.totalPrice),
    gstRate:     `${(p.gstRate * 100).toFixed(0)}%`,
    isIntroductory: p.isIntroductory,
    introEndDate: p.introEndDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

/**
 * Returns the introductory-offer notice text, or null if not in intro period.
 */
export function getIntroOfferNotice(date = new Date()) {
  const p = getCurrentPricing(date);
  if (!p.isIntroductory) return null;
  return `🎉 Introductory fee Rs ${OLD_TOTAL.toFixed(2)} effective till March 31, 2026. New prices Rs ${NEW_TOTAL.toFixed(2)} effective from April 01, 2026. Enroll now!`;
}

export default {
  GST_RATE,
  OLD_PRICE,
  NEW_PRICE,
  CUTOFF_DATE,
  formatINR,
  formatPrice,
  computeGst,
  getEffectiveBasePrice,
  getEffectivePricingBreakdown,
  getCurrentPricing,
  getPricingDisplay,
  getIntroOfferNotice,
  // legacy aliases
  INTRO_BASE_PRICE:  OLD_PRICE,
  INTRO_GST_AMOUNT:  OLD_GST,
  INTRO_TOTAL_PRICE: OLD_TOTAL,
  INTRO_END_DATE:    new Date(`${CUTOFF_DATE}T23:59:59`),
  REGULAR_BASE_PRICE:  NEW_PRICE,
  REGULAR_GST_AMOUNT:  NEW_GST,
  REGULAR_TOTAL_PRICE: NEW_TOTAL,
};

// AI + Developer bundle offer: Buy one, get one free — valid until March 31, 2026
const BUNDLE_OFFER_END_DATE_STR = "2026-03-31";
const BUNDLE_APPS = ["learn-ai", "learn-developer"];

/**
 * Check if the AI + Developer bundle buy-one-get-one offer is still active
 * @param {Date} [currentDate] - Date to check (defaults to now)
 * @returns {boolean}
 */
export function isBundleOfferActive(currentDate = new Date()) {
  const dateStr = currentDate.toISOString().slice(0, 10);
  return dateStr <= BUNDLE_OFFER_END_DATE_STR;
}

/**
 * Get the bundle offer notice text
 * @returns {string|null} Notice text or null if offer is not active
 */
export function getBundleOfferNotice() {
  if (!isBundleOfferActive()) return null;
  return `🎁 LIMITED OFFER: Buy Learn AI OR Learn Developer — get BOTH for the price of ONE! Offer valid until 31 March 2026.`;
}

export { BUNDLE_APPS };
