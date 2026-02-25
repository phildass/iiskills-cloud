/**
 * Manual tests for pricing utility
 * Run with: node utils/__tests__/pricing.manual.test.js
 */

const pricing = require("../pricing");

console.log("\n=== Pricing Utility Manual Tests ===\n");

// Test 1: Current pricing
console.log("Test 1: Current Pricing");
const currentPricing = pricing.getCurrentPricing();
console.log("Current Date:", new Date().toLocaleDateString("en-IN"));
console.log("Is Introductory:", currentPricing.isIntroductory);
console.log("Base Price:", pricing.formatPrice(currentPricing.basePrice));
console.log("GST Amount:", pricing.formatPrice(currentPricing.gstAmount));
console.log("Total Price:", pricing.formatPrice(currentPricing.totalPrice));
console.log("");

// Test 2: Introductory period pricing (before cutoff)
console.log("Test 2: Introductory Period (March 31, 2026)");
const introPricing = pricing.getCurrentPricing(new Date("2026-03-31"));
console.log("Is Introductory:", introPricing.isIntroductory);
console.log("Base Price:", pricing.formatPrice(introPricing.basePrice));
console.log("GST Amount:", pricing.formatPrice(introPricing.gstAmount));
console.log("Total Price:", pricing.formatPrice(introPricing.totalPrice));
console.log("Expected: Rs 116.82 total");
console.log("Match:", introPricing.totalPrice === 116.82 ? "✓ PASS" : "✗ FAIL");
console.log("");

// Test 3: Last day of introductory period (March 31, 2026, 23:59:59)
console.log("Test 3: Last Day of Intro (March 31, 2026, 23:59:59)");
const lastDayPricing = pricing.getCurrentPricing(new Date("2026-03-31T23:59:59"));
console.log("Is Introductory:", lastDayPricing.isIntroductory);
console.log("Total Price:", pricing.formatPrice(lastDayPricing.totalPrice));
console.log("Expected: Rs 116.82 total");
console.log("Match:", lastDayPricing.totalPrice === 116.82 ? "✓ PASS" : "✗ FAIL");
console.log("");

// Test 4: Regular pricing period (April 01, 2026)
console.log("Test 4: Regular Period (April 01, 2026)");
const regularPricing = pricing.getCurrentPricing(new Date("2026-04-01"));
console.log("Is Introductory:", regularPricing.isIntroductory);
console.log("Base Price:", pricing.formatPrice(regularPricing.basePrice));
console.log("GST Amount:", pricing.formatPrice(regularPricing.gstAmount));
console.log("Total Price:", pricing.formatPrice(regularPricing.totalPrice));
console.log("Expected: Rs 352.82 total");
console.log("Match:", regularPricing.totalPrice === 352.82 ? "✓ PASS" : "✗ FAIL");
console.log("");

// Test 5: Pricing display
console.log("Test 5: Pricing Display Formatting");
const display = pricing.getPricingDisplay();
console.log("Base Price:", display.basePrice);
console.log("GST Amount:", display.gstAmount);
console.log("Total Price:", display.totalPrice);
console.log("GST Rate:", display.gstRate);
console.log("Intro End Date:", display.introEndDate);
console.log("");

// Test 6: Intro offer notice
console.log("Test 6: Introductory Offer Notice");
const introNotice = pricing.getIntroOfferNotice(new Date("2026-03-01"));
if (introNotice) {
  console.log("Notice:", introNotice);
  console.log("Contains Rs 116.82:", introNotice.includes("Rs 116.82") ? "✓ PASS" : "✗ FAIL");
  console.log("Contains Rs 352.82:", introNotice.includes("Rs 352.82") ? "✓ PASS" : "✗ FAIL");
  console.log("Contains March 31:", introNotice.includes("March 31") ? "✓ PASS" : "✗ FAIL");
  console.log("Contains April 01:", introNotice.includes("April 01") ? "✓ PASS" : "✗ FAIL");
} else {
  console.log("No notice (regular pricing period active)");
}
console.log("");

// Test 7: GST calculation accuracy
console.log("Test 7: GST Calculation Accuracy");
const testIntro = pricing.getCurrentPricing(new Date("2026-03-31"));
const testRegular = pricing.getCurrentPricing(new Date("2026-04-01"));
const introGSTCalc = testIntro.basePrice * 0.18;
const regularGSTCalc = testRegular.basePrice * 0.18;
console.log("Intro GST calculated:", introGSTCalc.toFixed(2));
console.log("Intro GST expected:", testIntro.gstAmount.toFixed(2));
console.log("Match:", Math.abs(introGSTCalc - testIntro.gstAmount) < 0.01 ? "✓ PASS" : "✗ FAIL");
console.log("Regular GST calculated:", regularGSTCalc.toFixed(2));
console.log("Regular GST expected:", testRegular.gstAmount.toFixed(2));
console.log(
  "Match:",
  Math.abs(regularGSTCalc - testRegular.gstAmount) < 0.01 ? "✓ PASS" : "✗ FAIL"
);
console.log("");

console.log("=== Tests Complete ===\n");
