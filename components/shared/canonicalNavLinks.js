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
 * Note: Links are currently inactive as this is a test site
 */

export const canonicalLinks = [
  { href: "#", label: "Home", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" },
  { href: "#", label: "Courses", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" },
  { href: "#", label: "Certification", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" },
  { href: "#", label: "Newsletter", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" },
  { href: "#", label: "Payments", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" },
  { href: "#", label: "About", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" },
  { href: "#", label: "Terms and Conditions", className: "hover:text-gray-400 transition cursor-not-allowed opacity-60" }
];
