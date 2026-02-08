import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GoogleTranslate from "./GoogleTranslate";

/**
 * Shared Header Component
 *
 * Centralized header for all iiskills.cloud apps
 * Features:
 * - Dual logo display (AI Cloud + iiskills)
 * - Navigation links (supports canonicalLinks)
 * - Google Translate widget for 12+ Indian languages
 * - Auth buttons (Sign In / Register)
 * - Mobile responsive menu
 * - Sticky positioning with high z-index
 */
export default function Header({
  appName = "iiskills.cloud",
  homeUrl = "/",
  customLinks = [],
  user = null,
  onLogout = null,
  showAuthButtons = true,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if open access mode is enabled
  // In open access mode, hide all authentication UI elements
  const isOpenAccess = 
    process.env.NEXT_PUBLIC_OPEN_ACCESS === "true" ||
    process.env.NEXT_PUBLIC_DISABLE_AUTH === "true" ||
    process.env.NEXT_PUBLIC_TEST_MODE === "true";

  // Override showAuthButtons if in open access mode
  const shouldShowAuthButtons = showAuthButtons && !isOpenAccess;

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <nav className="bg-white text-gray-800 px-6 py-3 shadow-md sticky top-0 z-[9999]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href={homeUrl} className="flex items-center hover:opacity-90 transition gap-3">
          {/* AI Cloud Enterprises Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/ai-cloud-logo.png"
                alt="AI Cloud Enterprises Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[8px] text-gray-600 text-center leading-tight mt-0.5">
              AI Cloud
              <br />
              Enterprises
            </span>
          </div>

          {/* iiskills Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/iiskills-logo.png"
                alt="IISKILLS Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[7px] text-gray-600 text-center leading-tight mt-0.5 max-w-[60px]">
              Indian Institute of Professional Skills Development
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          {customLinks.map((link, index) =>
            link.isNonClickable ? (
              <span key={index} className={link.className || ""}>
                {link.label}
              </span>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={link.className || "hover:text-primary transition"}
                target={link.target}
                rel={link.rel}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Show Sign In/Register or User Info based on authentication */}
          {shouldShowAuthButtons && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <span className="text-sm text-gray-600">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/login" className="hover:text-primary transition">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}

          {/* Google Translate Widget - Multi-language support - Moved to far right */}
          <div className="flex items-center gap-2 px-2 py-1 border-l border-gray-200">
            <span
              className="text-sm text-gray-600 whitespace-nowrap hidden lg:inline"
              aria-label="Language Selector"
            >
              🌐 Language | भाषा
            </span>
            <GoogleTranslate />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          {customLinks.map((link, index) =>
            link.isNonClickable ? (
              <span key={index} className={link.mobileClassName || link.className || "block"}>
                {link.label}
              </span>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={link.mobileClassName || "block hover:text-primary transition"}
                target={link.target}
                rel={link.rel}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Google Translate Widget for Mobile */}
          <div className="flex items-center gap-2 px-2 py-2 border-t border-gray-200 mt-2 pt-4">
            <span className="text-sm text-gray-600 whitespace-nowrap">🌐 Language | भाषा:</span>
            <GoogleTranslate />
          </div>

          {/* Show Sign In/Register or User Info based on authentication */}
          {shouldShowAuthButtons && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <div className="text-sm text-gray-600 px-4 py-2">{user.email}</div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/login" className="block hover:text-primary transition">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
