/**
 * StickyOfferBanner Component
 *
 * Displays the Inaugural Offer promotional banner fixed at the bottom of every
 * page during the introductory pricing window (≤ 2026-04-20).
 *
 * Behaviour:
 *   - Rendered only when `pricing.isIntroductory === true`.
 *   - Fixed at `bottom-0` so it is always visible regardless of scroll position,
 *     matching the visual confirmed in the production QA screenshot.
 *   - A close (×) button persists the dismissal in `sessionStorage` so the banner
 *     stays hidden for the rest of the browser session after the user closes it.
 *   - `_app.js` wraps page content in `pb-20` to prevent the banner from covering
 *     the last line of page content.
 *
 * @see apps/main/pages/_app.js   — renders this component globally
 * @see apps/main/utils/pricing.js — re-exports getPricingDisplay() from @iiskills/ui/pricing
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPricingDisplay } from "../utils/pricing";

const DISMISSED_KEY = "stickyOfferBannerDismissed";

export default function StickyOfferBanner() {
  const [visible, setVisible] = useState(false);
  const pricing = getPricingDisplay();

  useEffect(() => {
    // Only show during the introductory pricing window
    if (!pricing.isIntroductory) return;

    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, [pricing.isIntroductory]);

  if (!visible) return null;

  function handleDismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-4 shadow-lg"
      role="banner"
      aria-label="Inaugural offer announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm sm:text-base font-bold flex-1 text-center">
          🎉 Inaugural Offer: {pricing.basePrice} (+ {pricing.gstRate} GST ={" "}
          {pricing.totalPrice}) valid from March 21, 2026 to April 20, 2026 —{" "}
          <Link
            href="/register"
            className="underline underline-offset-2 hover:no-underline font-extrabold"
          >
            Enroll now!
          </Link>
        </p>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded"
          aria-label="Dismiss offer banner"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
