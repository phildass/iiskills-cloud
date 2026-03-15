import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import GoogleTranslate from "./GoogleTranslate";

/**
 * Shared Header Component
 *
 * Centralized header for all iiskills.cloud apps
 * Features:
 * - Dual logo display (AI Cloud + iiskills)
 * - Navigation links (supports canonicalLinks)
 * - Google Translate widget for 12+ Indian languages
 * - Auth buttons (Login / Register)
 * - Mobile responsive menu
 * - Sticky positioning with high z-index
 *
 * CONTEXTUAL NAV DEMOTION:
 * - If registrationIncomplete === true:
 *   - Primary CTA becomes "Complete Registration →" (from primaryCta prop)
 *   - Demote links that allow bypassing registration (course/learn/app links, and optionally payments)
 * - If isPaid === true:
 *   - Demote payment/enroll links (since payment is not relevant anymore)
 */
export default function Header({
  appName = "iiskills.cloud",
  homeUrl = "/",
  customLinks = [],
  user = null,
  onLogout = null,
  showAuthButtons = true,
  isPaid = false,
  isAdmin = false,

  // Optional props
  registrationIncomplete = false,
  primaryCta = null, // { label: string, href: string }

  // Auth link overrides — set to absolute main-site URLs for non-main apps
  loginUrl = "/login",
  registerUrl = "/register",
  profileUrl = "/profile",

  // Dashboard URL — shown in the personal info strip when user is logged in
  dashboardUrl = "/dashboard",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shouldShowAuthButtons = showAuthButtons;

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  /**
   * Decide whether a nav link should be visually demoted.
   * Demote = reduce emphasis (opacity), but still clickable.
   *
   * Patterns you can tune based on your canonicalNavLinks.
   */
  const shouldDemoteLink = (link) => {
    if (!link || link.isNonClickable) return false;

    const href = String(link.href || "");
    const label = String(link.label || "").toLowerCase();

    const isPaymentLink =
      href.includes("/payments") ||
      href.includes("/payment") ||
      href.includes("/enroll") ||
      label.includes("pay") ||
      label.includes("payment") ||
      label.includes("enroll");

    const isCourseOrAppEntry =
      href.includes("learn-") ||
      label.includes("course") ||
      label.includes("learn") ||
      label.includes("start learning");

    // 1) Registration incomplete: demote things that let user skip finishing registration.
    //    (You can choose to demote payment links too; I am demoting them here to force completion first.)
    if (registrationIncomplete) {
      if (isCourseOrAppEntry) return true;
      if (isPaymentLink) return true;
      return false;
    }

    // 2) Paid users: payment links should be demoted (not relevant anymore)
    // Note: isAdmin users are also set as isPaid (see SiteHeader.js), so checking
    // isAdmin here is explicit insurance in case that coupling changes in the future.
    if (isPaid || isAdmin) {
      if (isPaymentLink) return true;
      return false;
    }

    // 3) Not paid + registration complete: do not demote payment
    return false;
  };

  const effectiveLinks = useMemo(() => {
    return customLinks.map((link) => {
      if (!shouldDemoteLink(link)) return link;

      return {
        ...link,
        className: `${link.className || "hover:text-primary transition"} opacity-60 hover:opacity-100`,
        mobileClassName: `${link.mobileClassName || "block hover:text-primary transition"} opacity-70 hover:opacity-100`,
      };
    });
  }, [customLinks, isPaid, isAdmin, registrationIncomplete]);

  const showCompleteRegistrationCta =
    !!user && registrationIncomplete && primaryCta?.href && primaryCta?.label;

  const isGoogleUser =
    user?.app_metadata?.provider === "google" ||
    (user?.identities || []).some((i) => i.provider === "google");

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.first_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <nav className="bg-white text-gray-800 shadow-md sticky top-0 z-[9999]">
      {/* ── Main nav row ── */}
      <div className="px-6 py-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Logo and Brand */}
          <Link
            href={homeUrl}
            className="flex items-center hover:opacity-90 transition gap-3 flex-shrink-0 mr-4"
          >
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

          {/* Desktop Navigation – main links */}
          <div className="hidden md:flex gap-4 xl:gap-6 font-medium items-center flex-1">
            {effectiveLinks.map((link, index) =>
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

            {/* Login / Register when NOT logged in */}
            {shouldShowAuthButtons && !user && (
              <div className="flex items-center gap-4 ml-auto">
                <Link href={loginUrl} className="hover:text-primary transition">
                  Login
                </Link>
                <Link
                  href={registerUrl}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Right side: Google Translate + Mobile Menu Button */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            <GoogleTranslate />

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
        </div>
      </div>

      {/* ── Secondary strip: personal info (logged-in users only) ── */}
      {shouldShowAuthButtons && user && (
        <div className="hidden md:block bg-gray-50 border-b border-gray-300 px-6 py-1.5">
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

            {/* ADMIN badge */}
            {isAdmin && (
              <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                ADMIN
              </span>
            )}

            {/* PAID badge — only shown for non-admin paid users.
                Admin users are set as isPaid in SiteHeader.js, but show ADMIN badge instead. */}
            {isPaid && !isAdmin && (
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

            {/* Complete Profile CTA or Profile link */}
            {showCompleteRegistrationCta ? (
              <Link
                href={primaryCta.href}
                className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition font-bold text-xs"
              >
                {primaryCta.label}
              </Link>
            ) : (
              <Link href={profileUrl} className="hover:text-primary transition font-medium">
                Profile
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="ml-auto bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3 px-4">
          {effectiveLinks.map((link, index) =>
            link.isNonClickable ? (
              <span key={index} className={link.mobileClassName || link.className || "block"}>
                {link.label}
              </span>
            ) : (
              <Link
                key={index}
                href={link.href}
                className={link.mobileClassName || "block hover:text-primary transition py-2"}
                target={link.target}
                rel={link.rel}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}

          {shouldShowAuthButtons && (
            <>
              {user ? (
                <>
                  {/* Mobile personal info strip */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">{displayName}</span>

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

                      {isAdmin && (
                        <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                          ADMIN
                        </span>
                      )}

                      {isPaid && !isAdmin && (
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

                    {showCompleteRegistrationCta ? (
                      <Link
                        href={primaryCta.href}
                        className="block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {primaryCta.label}
                      </Link>
                    ) : (
                      <Link
                        href={profileUrl}
                        className="block hover:text-primary transition font-medium py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={loginUrl}
                    className="block hover:text-primary transition py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href={registerUrl}
                    className="block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
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
