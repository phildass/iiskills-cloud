import Header from "@iiskills/ui/src/Header";
import { canonicalLinks } from "./canonicalNavLinks";

/**
 * Shared site header used across all apps.
 * Provides consistent navigation and branding across the entire platform.
 * 
 * This is a simplified wrapper that uses the shared Header component
 * with the canonical set of navigation links.
 */
export default function SiteHeader() {
  return (
    <Header
      appName="" // Removed to create more space in navigation
      homeUrl="/"
      customLinks={canonicalLinks}
      showAuthButtons={true}
    />
  );
}
