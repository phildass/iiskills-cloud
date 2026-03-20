"use client"; // This component uses React hooks and interactive UI - must run on client side

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import GoogleTranslate from "../common/GoogleTranslate";
import { DASHBOARD_URL } from "@iiskills/access-control";

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
  isPaid = false,
  dashboardUrl = DASHBOARD_URL,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const isGoogleUser =
    user?.app_metadata?.provider === "google" ||
    (user?.identities || []).some((i) => i.provider === "google");

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.first_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    user?.email;

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      {/* ── Main nav row ── */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo and Brand - Enhanced version */}
          <Link
            href={homeUrl}
            className="flex items-center hover:opacity-90 transition gap-3 flex-shrink-0 mr-4"
          >
            {/* AI Cloud Enterprises Logo */}
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                <Image
                  src="/images/ai-cloud-logo.png"
                  alt="AI Cloud Enterprises Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, 56px"
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
                  sizes="(max-width: 640px) 44px, 48px"
                />
              </div>
              <span className="text-[8px] sm:text-[9px] text-gray-600 text-center leading-tight mt-1 max-w-[60px] hidden sm:block">
                Indian Institute of Professional Skills Development
              </span>
            </div>

            <span className="font-bold text-xl sm:text-2xl text-gray-800">{appName}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-wrap gap-4 xl:gap-6 font-medium items-center flex-1">
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

            {/* Login/Register when NOT logged in */}
            {showAuthButtons && !user && (
              <div className="flex items-center gap-4 ml-auto">
                <Link
                  href="/login"
                  className="hover:text-primary transition text-base whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-bold text-base whitespace-nowrap shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Right side: Google Translate (always visible) + Mobile Menu Button */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Google Translate widget – rendered once here, visible on both desktop and mobile */}
            <GoogleTranslate />

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
        </div>
      </div>

      {/* ── Secondary strip: personal info (logged-in users only) ── */}
      {showAuthButtons && user && (
        <div className="hidden md:block bg-gray-50 border-b border-gray-300 px-4 sm:px-6 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center gap-4 text-sm">
            {/* User display name */}
            <span className="font-medium text-gray-700">{displayName}</span>

            {/* Google User badge */}
            {isGoogleUser && (
              <span className="inline-flex items-center gap-1 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google User
              </span>
            )}

            {/* PAID badge */}
            {isPaid && (
              <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                PAID
              </span>
            )}

            {/* My Dashboard link */}
            <Link
              href={dashboardUrl}
              className="font-semibold text-blue-700 hover:text-primary transition"
            >
              My Dashboard
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-auto bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition font-bold text-sm shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-0 pb-4 space-y-2 border-t border-gray-200 pt-4 px-4">
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

          {/* Show Login/Register or User Info based on authentication */}
          {showAuthButtons && (
            <>
              {user ? (
                // User is logged in - show personal info strip + logout
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-2 mt-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-medium text-gray-700">{displayName}</span>

                      {isGoogleUser && (
                        <span className="inline-flex items-center gap-0.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Google User
                        </span>
                      )}

                      {isPaid && (
                        <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          PAID
                        </span>
                      )}
                    </div>

                    <Link
                      href={dashboardUrl}
                      className="block font-semibold text-blue-700 hover:text-primary transition py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Dashboard
                    </Link>
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
                    Login
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
