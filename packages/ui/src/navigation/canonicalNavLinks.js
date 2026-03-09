/**
 * Canonical Navigation Links
 *
 * This module exports the universal set of navigation links used across all iiskills apps.
 * By centralizing navigation links here, we ensure consistency and make it easy to update
 * navigation across the entire platform.
 *
 * Usage:
 *   import { canonicalLinks } from '@/components/shared/canonicalNavLinks';
 *   <Header customLinks={canonicalLinks} showAuthButtons={true} />
 *
 * All links are now fully operational for testing
 */

/**
 * Get canonical navigation links for a specific app
 * @param {string} appId - The app identifier (e.g., 'main', 'learn-govt-jobs', 'learn-ai')
 * @param {boolean} isFreeApp - Whether this is a free app (for payment logic)
 * @returns {Array} Array of navigation link objects
 */
export function getCanonicalLinks(appId = "main", isFreeApp = false) {
  // For non-main apps, links to main-site-only pages use absolute URLs so
  // they resolve correctly regardless of which subdomain the user is on.
  const isSubApp = appId !== "main";
  const mainUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud";
  const mainHref = (path) => (isSubApp ? `${mainUrl}${path}` : path);

  const baseLinks = [
    { href: "/", label: "Home", className: "hover:text-primary transition" },
    { href: mainHref("/courses"), label: "Courses", className: "hover:text-primary transition" },
    {
      href: mainHref("/certification"),
      label: "Certification",
      className: "hover:text-primary transition",
    },
  ];

  // MOVED TO apps-backup as per cleanup requirements
  // Add special links only for Learn-Govt-Jobs
  // if (appId === "learn-govt-jobs") {
  //   baseLinks.push(
  //     {
  //       href: "/opportunity-feed",
  //       label: "Opportunities",
  //       className: "hover:text-primary transition",
  //     },
  //     { href: "/daily-brief", label: "Daily Brief", className: "hover:text-primary transition" },
  //     { href: "/exam-countdown", label: "Exam Alerts", className: "hover:text-primary transition" }
  //   );
  // }

  baseLinks.push({
    href: mainHref("/newsletter"),
    label: "Newsletter",
    className: "hover:text-primary transition",
  });

  // Payment logic: show Payments link for paid apps only
  // Free apps: learn-apt, learn-physics, learn-math, learn-chemistry, learn-geography
  // Per requirement: Remove "Free" label from universal nav bar
  if (isSubApp && !isFreeApp) {
    // Payments link for paid apps only — stays app-local (each paid app has /payments)
    baseLinks.push({
      href: "/payments",
      label: "Payments",
      className: "hover:text-primary transition",
    });
  }

  baseLinks.push(
    { href: mainHref("/about"), label: "About", className: "hover:text-primary transition" },
    {
      href: mainHref("/terms"),
      label: "Terms and Conditions",
      className: "hover:text-primary transition",
    }
  );

  return baseLinks;
}

// Default canonical links for backward compatibility (Main site)
export const canonicalLinks = getCanonicalLinks("main");
