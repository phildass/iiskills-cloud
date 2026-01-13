import Link from "next/link";

/**
 * NewsletterNavLink Component
 *
 * A navigation link for the newsletter that can be used in any navbar.
 * Handles proper routing for both main domain and subdomains.
 *
 * Props:
 * - className: Additional CSS classes for styling
 * - onClick: Optional click handler
 */
export default function NewsletterNavLink({ className = "", onClick = null }) {
  return (
    <Link
      href="/newsletter"
      className={className || "hover:text-primary transition"}
      onClick={onClick}
    >
      📧 Newsletter
    </Link>
  );
}
