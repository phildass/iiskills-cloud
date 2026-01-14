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
    <nav className="bg-white text-gray-800 px-6 py-3 shadow-md sticky top-0 z-50">
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

          <span className="font-bold text-xl text-gray-800 ml-2 hidden lg:inline">{appName}</span>
          <span className="font-bold text-sm text-gray-800 ml-2 lg:hidden">iiskills</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 font-medium flex-wrap">
          {customLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={link.className || "hover:text-primary transition whitespace-nowrap"}
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
                  <span className="text-sm text-gray-600 truncate max-w-[150px]" title={user.email}>{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/login" className="hover:text-primary transition whitespace-nowrap">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold whitespace-nowrap"
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
          className="lg:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
        <div className="lg:hidden mt-4 pb-4 space-y-3">
          {customLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={link.mobileClassName || "block hover:text-primary transition"}
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
