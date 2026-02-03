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
 */

export const canonicalLinks = [
  { href: "/", label: "Home", className: "hover:text-primary transition" },
  { href: "/courses", label: "Courses", className: "hover:text-primary transition" },
  { href: "/certification", label: "Certification", className: "hover:text-primary transition" },
  { href: "/newsletter", label: "Newsletter", className: "hover:text-primary transition" },
  { href: "https://aienter.in/payments", label: "Payments", className: "hover:text-primary transition", target: "_blank", rel: "noopener noreferrer" },
  { href: "/about", label: "About", className: "hover:text-primary transition" },
  { href: "/terms", label: "Terms and Conditions", className: "hover:text-primary transition" },
  { href: "/register", label: "Register", className: "hover:text-primary transition" }
];
