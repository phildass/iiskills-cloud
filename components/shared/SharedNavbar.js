import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Shared Navigation Bar Component
 *
 * This component is designed to be used across multiple iiskills applications
 * (main app, learn-apt, etc.) and displays both the iiskills and AI Cloud Enterprise logos.
 *
 * Props:
 * - user: Current user object (null if not logged in)
 * - onLogout: Callback function to handle logout
 * - appName: Name of the current app (e.g., 'iiskills.cloud', 'Learn Your Aptitude')
 * - homeUrl: URL for the home link (default: '/')
 * - showAuthButtons: Whether to show login/register buttons (default: true)
 */
export default function SharedNavbar({
  user = null,
  onLogout = null,
  appName = "iiskills.cloud",
  homeUrl = "/",
  showAuthButtons = true,
  customLinks = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <nav className="bg-white text-gray-800 px-4 sm:px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-6">
        {/* Logo and Brand - Enhanced version */}
        <Link
          href={homeUrl}
          className="flex items-center hover:opacity-90 transition gap-3 flex-shrink-0"
        >
          {/* AI Cloud Enterprises Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                src="/images/ai-cloud-logo.png"
                alt="AI Cloud Enterprises Logo"
                fill
                className="object-contain"
                sizes="56px"
              />
            </div>
            <span className="text-[8px] sm:text-[9px] text-gray-600 text-center leading-tight mt-1 hidden sm:block">
              AI Cloud
              <br />
              Enterprises
            </span>
          </div>

          {/* iiskills Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src="/images/iiskills-logo.png"
                alt="IISKILLS Logo"
                fill
                className="object-contain"
                sizes="48px"
              />
            </div>
            <span className="text-[8px] sm:text-[9px] text-gray-600 text-center leading-tight mt-1 max-w-[60px] hidden sm:block">
              Indian Institute of Professional Skills Development
            </span>
          </div>

          <span className="font-bold text-xl sm:text-2xl text-gray-800">{appName}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-wrap gap-4 xl:gap-6 font-medium items-center justify-end flex-1">
          {customLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={link.className || "hover:text-primary transition text-base"}
              target={link.target}
              rel={link.rel}
            >
              {link.label}
            </Link>
          ))}

          {/* Show Sign In/Register or User Info based on authentication */}
          {showAuthButtons && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <span className="text-base text-gray-600 whitespace-nowrap">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition font-bold text-base whitespace-nowrap shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link
                    href="/login"
                    className="hover:text-primary transition text-base whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-bold text-base whitespace-nowrap shadow-sm"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
          {customLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={
                link.mobileClassName || "block hover:text-primary transition text-base py-2"
              }
              target={link.target}
              rel={link.rel}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Show Sign In/Register or User Info based on authentication */}
          {showAuthButtons && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <div className="text-base text-gray-600 px-4 py-2 bg-gray-50 rounded">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-bold text-base shadow-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link
                    href="/login"
                    className="block hover:text-primary transition text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-bold text-base text-center shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
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
