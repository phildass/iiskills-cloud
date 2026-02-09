import Header from "@iiskills/ui/src/Header";
import { getCanonicalLinks } from "./canonicalNavLinks";

/**
 * Shared site header used across all apps.
 * Provides consistent navigation and branding across the entire platform.
 *
 * This is a simplified wrapper that uses the shared Header component
 * with the canonical set of navigation links.
 *
 * UNIVERSAL NAV REQUIREMENT: Register and Sign In links MUST be visible
 * to ALL users on ALL deployed sites (desktop and mobile).
 *
 * @param {string} appId - The app identifier (e.g., 'learn-ai', 'main')
 * @param {boolean} isFreeApp - Whether this is a free app (affects payment link display)
 */
export default function SiteHeader({ appId = "main", isFreeApp = false }) {
  return (
    <Header
      appName="" // Removed to create more space in navigation
      homeUrl="/"
      customLinks={getCanonicalLinks(appId, isFreeApp)}
      showAuthButtons={true} // UNIVERSAL NAV: Register and Sign In links visible to ALL users
    />
  );
}
