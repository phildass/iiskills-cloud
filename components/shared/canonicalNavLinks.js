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
  const baseLinks = [
    { href: "/", label: "Home", className: "hover:text-primary transition" },
    { href: "/courses", label: "Courses", className: "hover:text-primary transition" },
    { href: "/certification", label: "Certification", className: "hover:text-primary transition" },
  ];

  // Add special links only for Learn-Govt-Jobs
  if (appId === "learn-govt-jobs") {
    baseLinks.push(
      { href: "/opportunity-feed", label: "Opportunities", className: "hover:text-primary transition" },
      { href: "/daily-brief", label: "Daily Brief", className: "hover:text-primary transition" },
      { href: "/exam-countdown", label: "Exam Alerts", className: "hover:text-primary transition" }
    );
  }

  baseLinks.push(
    { href: "/newsletter", label: "Newsletter", className: "hover:text-primary transition" }
  );

  // Payment logic: show Payments link for paid apps, "Free" label for free apps
  // Free apps: learn-apt, learn-physics, learn-math, learn-chemistry, learn-geography
  if (appId !== "main") {
    if (isFreeApp) {
      // Non-clickable "Free" label for free apps
      baseLinks.push({
        href: "#",
        label: "Free",
        className: "text-green-600 font-bold cursor-default pointer-events-none"
      });
    } else {
      // Payments link for paid apps
      baseLinks.push({
        href: "/payments",
        label: "Payments",
        className: "hover:text-primary transition"
      });
    }
  }

  baseLinks.push(
    { href: "/about", label: "About", className: "hover:text-primary transition" },
    { href: "/terms", label: "Terms and Conditions", className: "hover:text-primary transition" }
  );

  return baseLinks;
}

// Default canonical links for backward compatibility (Main site)
export const canonicalLinks = getCanonicalLinks("main");
