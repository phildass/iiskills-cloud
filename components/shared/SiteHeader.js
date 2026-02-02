import Header from "@iiskills/ui/src/Header";

/**
 * Shared site header used across all apps.
 * Provides consistent navigation and branding across the entire platform.
 * 
 * This is a simplified wrapper that uses the shared Header component
 * with a basic set of navigation links.
 */
export default function SiteHeader() {
  const defaultLinks = [
    { href: "/", label: "Home", className: "hover:text-primary transition" },
    { href: "/apps", label: "All Apps", className: "hover:text-primary transition" },
    { href: "/about", label: "About", className: "hover:text-primary transition" },
    { href: "/contact", label: "Contact", className: "hover:text-primary transition" },
  ];

  return (
    <Header
      appName="iiskills.cloud"
      homeUrl="/"
      customLinks={defaultLinks}
      showAuthButtons={true}
    />
  );
}
