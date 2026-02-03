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
  { 
    href: "/", 
    label: "Home", 
    className: "hover:text-primary transition" 
  },
  { 
    href: "/courses", 
    label: "Courses", 
    className: "hover:text-primary transition" 
  },
  {
    href: "/certification",
    label: "Certification",
    className: "hover:text-primary transition",
  },
  {
    href: "/newsletter",
    label: "📧 Newsletter",
    className: "hover:text-primary transition",
  },
  {
    href: "https://www.aienter.in/payments",
    label: "Payments",
    className:
      "bg-accent text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-bold shadow-sm",
    mobileClassName:
      "block bg-accent text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition font-bold text-center shadow-sm",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  { 
    href: "/about", 
    label: "About", 
    className: "hover:text-primary transition" 
  },
];
