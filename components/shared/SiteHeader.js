import Header from "@iiskills/ui/src/Header";
import { getCanonicalLinks } from "./canonicalNavLinks";

/**
 * Shared site header used across all apps.
 * Provides consistent navigation and branding across the entire platform.
 *
 * This is a simplified wrapper that uses the shared Header component
 * with the canonical set of navigation links.
 *
 * OPEN ACCESS REFACTOR: Authentication buttons (Sign In/Register) are hidden
 * to provide fully open-access navigation. All content is publicly accessible.
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
      showAuthButtons={false} // OPEN ACCESS: Auth buttons hidden - all content is public
    />
  );
}
