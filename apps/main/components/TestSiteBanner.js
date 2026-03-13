/**
 * TestSiteBanner Component
 *
 * Displays a highly visible "Test Site Only" banner at the top of every page
 * when NEXT_PUBLIC_IS_TEST_SITE=true is set.
 *
 * The banner:
 *   - Is fixed at the very top of the viewport (above the sticky nav)
 *   - Uses a prominent red/orange colour so it cannot be missed
 *   - Adds padding-top to <body> via a CSS class so the nav does not overlap it
 */

import { IS_TEST_SITE } from "../lib/testSiteConfig";

export default function TestSiteBanner() {
  if (!IS_TEST_SITE) return null;

  return (
    <div
      className="w-full bg-red-600 text-white text-center py-2 px-4 text-sm font-bold tracking-wide z-[99999] sticky top-0"
      role="alert"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2">
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        TEST SITE ONLY &mdash; This is a read-only demo. No real actions are performed.
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
}
