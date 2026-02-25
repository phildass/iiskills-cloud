/**
 * Centralized pricing logic for iiskills.cloud
 *
 * Pricing structure:
 * - Introductory price: Rs 99 + GST (17.82) = 116.82 (until March 31, 2026 inclusive)
 * - Regular price: Rs 299 + GST (53.82) = 352.82 (from April 01, 2026 onwards)
 *
 * NOTE: This module is used by root-level utilities and tests.
 * For React components, import from @iiskills/ui/pricing instead.
 */

// Introductory pricing (until end of March 31, 2026)
const INTRO_BASE_PRICE = 99;
const INTRO_GST_RATE = 0.18; // 18%
const INTRO_GST_AMOUNT = 17.82; // Pre-calculated for accuracy
const INTRO_TOTAL_PRICE = 116.82;
const INTRO_END_DATE = new Date("2026-03-31T23:59:59");

// Regular pricing (from April 01, 2026 onwards)
const REGULAR_BASE_PRICE = 299;
const REGULAR_GST_AMOUNT = 53.82; // Pre-calculated for accuracy
const REGULAR_TOTAL_PRICE = 352.82;

// AI + Developer bundle offer: Buy one, get one free — valid until March 31, 2026
const BUNDLE_OFFER_END_DATE = new Date("2026-03-31T23:59:59");
const BUNDLE_APPS = ["learn-ai", "learn-developer"];

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
    currencySymbol: "Rs",
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
  return includeSymbol ? `Rs ${formatted}` : formatted;
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

  return `🎉 Introductory fee Rs ${INTRO_TOTAL_PRICE.toFixed(2)} effective till March 31, 2026. New prices Rs ${REGULAR_TOTAL_PRICE.toFixed(2)} effective from April 01, 2026. Enroll now!`;
}

/**
 * Check if the AI + Developer bundle buy-one-get-one offer is still active
 * @param {Date} currentDate - Optional date to use for calculation (defaults to now)
 * @returns {boolean} True if the bundle offer is active
 */
export function isBundleOfferActive(currentDate = new Date()) {
  return currentDate <= BUNDLE_OFFER_END_DATE;
}

/**
 * Get the bundle offer notice text
 * @returns {string|null} Notice text or null if offer is not active
 */
export function getBundleOfferNotice() {
  if (!isBundleOfferActive()) {
    return null;
  }
  return `🎁 LIMITED OFFER: Buy Learn AI OR Learn Developer — get BOTH for the price of ONE! Offer valid until 31 March 2026.`;
}

export default {
  getCurrentPricing,
  formatPrice,
  getPricingDisplay,
  getIntroOfferNotice,
  isBundleOfferActive,
  getBundleOfferNotice,
  INTRO_BASE_PRICE,
  INTRO_GST_AMOUNT,
  INTRO_TOTAL_PRICE,
  INTRO_END_DATE,
  REGULAR_BASE_PRICE,
  REGULAR_GST_AMOUNT,
  REGULAR_TOTAL_PRICE,
  BUNDLE_OFFER_END_DATE,
  BUNDLE_APPS,
};
