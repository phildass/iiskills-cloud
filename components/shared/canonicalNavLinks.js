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

export const canonicalLinks = [
  { href: "/", label: "Home", className: "hover:text-primary transition" },
  { href: "/courses", label: "Courses", className: "hover:text-primary transition" },
  { href: "/certification", label: "Certification", className: "hover:text-primary transition" },
  { href: "/opportunity-feed", label: "Opportunities", className: "hover:text-primary transition" },
  { href: "/daily-brief", label: "Daily Brief", className: "hover:text-primary transition" },
  { href: "/exam-countdown", label: "Exam Alerts", className: "hover:text-primary transition" },
  { href: "/newsletter", label: "Newsletter", className: "hover:text-primary transition" },
  { href: "/payments", label: "Payments", className: "hover:text-primary transition" },
  { href: "/about", label: "About", className: "hover:text-primary transition" },
  { href: "/terms", label: "Terms and Conditions", className: "hover:text-primary transition" }
];
