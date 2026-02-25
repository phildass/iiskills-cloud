/**
 * Pricing utility for apps/main – re-exports from the canonical
 * @iiskills/ui/pricing module so there is a single source of truth.
 *
 * Pricing rules:
 *  - Until 2026-03-31 inclusive: Rs 99 + 18% GST = Rs 116.82
 *    Display: "Effective till March 31, 2026"
 *  - From 2026-04-01 onward: Rs 299 + 18% GST = Rs 352.82
 *    Display: "New prices effective from April 01, 2026"
 */

export {
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
} from "@iiskills/ui/pricing";
