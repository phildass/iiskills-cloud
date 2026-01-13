/**
 * Centralized pricing logic for iiskills.cloud
 *
 * Pricing structure:
 * - Introductory price: Rs 99 + GST (17.82) = 116.82 (until February 28, 2026)
 * - Regular price: Rs 299 + GST (53.82) = 352.82 (from February 29, 2026 midnight onwards)
 */

// Introductory pricing (until February 28, 2026)
const INTRO_BASE_PRICE = 99;
const INTRO_GST_RATE = 0.18; // 18%
const INTRO_GST_AMOUNT = 17.82; // Pre-calculated for accuracy
const INTRO_TOTAL_PRICE = 116.82;
const INTRO_END_DATE = new Date("2026-02-28T23:59:59");

// Regular pricing (from February 29, 2026 midnight)
const REGULAR_BASE_PRICE = 299;
const REGULAR_GST_AMOUNT = 53.82; // Pre-calculated for accuracy
const REGULAR_TOTAL_PRICE = 352.82;

/**
 * Get the current pricing based on the current date
 * @param {Date} currentDate - Optional date to use for calculation (defaults to now)
 * @returns {Object} Current pricing information
 */
export function getCurrentPricing(currentDate = new Date()) {
  const isIntroductoryPeriod = currentDate <= INTRO_END_DATE;

  return {
    basePrice: isIntroductoryPeriod ? INTRO_BASE_PRICE : REGULAR_BASE_PRICE,
    gstRate: INTRO_GST_RATE,
    gstAmount: isIntroductoryPeriod ? INTRO_GST_AMOUNT : REGULAR_GST_AMOUNT,
    totalPrice: isIntroductoryPeriod ? INTRO_TOTAL_PRICE : REGULAR_TOTAL_PRICE,
    isIntroductory: isIntroductoryPeriod,
    introEndDate: INTRO_END_DATE,
    currency: "INR",
    currencySymbol: "₹",
  };
}

/**
 * Format price for display
 * @param {number} amount - Amount to format
 * @param {boolean} includeSymbol - Whether to include currency symbol
 * @returns {string} Formatted price
 */
export function formatPrice(amount, includeSymbol = true) {
  const formatted = amount.toFixed(2);
  return includeSymbol ? `₹${formatted}` : formatted;
}

/**
 * Get pricing display text for UI
 * @returns {Object} Display text for pricing
 */
export function getPricingDisplay() {
  const pricing = getCurrentPricing();

  return {
    basePrice: formatPrice(pricing.basePrice),
    gstAmount: formatPrice(pricing.gstAmount),
    totalPrice: formatPrice(pricing.totalPrice),
    gstRate: `${(pricing.gstRate * 100).toFixed(0)}%`,
    isIntroductory: pricing.isIntroductory,
    introEndDate: pricing.introEndDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}

/**
 * Get the introductory offer notice text
 * @returns {string|null} Notice text or null if not in introductory period
 */
export function getIntroOfferNotice() {
  const pricing = getCurrentPricing();

  if (!pricing.isIntroductory) {
    return null;
  }

  return `🎉 Introductory fee valid till Feb 28, 2026. New fees will be effective from Feb 29, 2026 midnight. Enroll now at ₹${INTRO_TOTAL_PRICE.toFixed(2)}!`;
}

export default {
  getCurrentPricing,
  formatPrice,
  getPricingDisplay,
  getIntroOfferNotice,
  INTRO_BASE_PRICE,
  INTRO_GST_AMOUNT,
  INTRO_TOTAL_PRICE,
  INTRO_END_DATE,
  REGULAR_BASE_PRICE,
  REGULAR_GST_AMOUNT,
  REGULAR_TOTAL_PRICE,
};
