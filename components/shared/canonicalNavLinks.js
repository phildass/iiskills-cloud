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
  { href: "/apps", label: "All Apps", className: "hover:text-primary transition" },
  { href: "/about", label: "About", className: "hover:text-primary transition" },
  { href: "/contact", label: "Contact", className: "hover:text-primary transition" }
];
