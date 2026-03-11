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

  // Optional props
  registrationIncomplete = false,
  primaryCta = null, // { label: string, href: string }

  // Auth link overrides — set to absolute main-site URLs for non-main apps
  loginUrl = "/login",
  registerUrl = "/register",
  profileUrl = "/profile",
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
    if (isPaid) {
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
  }, [customLinks, isPaid, registrationIncomplete]);

  const showCompleteRegistrationCta =
    !!user && registrationIncomplete && primaryCta?.href && primaryCta?.label;

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

          {/* Auth area */}
          {shouldShowAuthButtons && (
            <>
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-700">
                    {user.user_metadata?.full_name ||
                      user.user_metadata?.first_name ||
                      user.user_metadata?.name ||
                      user.user_metadata?.username ||
                      user.email?.split("@")[0] ||
                      "User"}
                    {isPaid && (
                      <span className="ml-2 inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full align-middle">
                        PAID
                      </span>
                    )}
                  </span>

                  {user.app_metadata?.provider === "google" && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Google User
                    </span>
                  )}

                  {/* Primary CTA override when registration is incomplete */}
                  {showCompleteRegistrationCta ? (
                    <Link
                      href={primaryCta.href}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                    >
                      {primaryCta.label}
                    </Link>
                  ) : (
                    isPaid && (
                      <Link href={profileUrl} className="hover:text-primary transition font-medium">
                        Profile
                      </Link>
                    )
                  )}

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href={loginUrl} className="hover:text-primary transition">
                    Login
                  </Link>
                  <Link
                    href={registerUrl}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Right side: Google Translate + Mobile Menu Button */}
        <div className="flex items-center gap-2">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          {effectiveLinks.map((link, index) =>
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

          {shouldShowAuthButtons && (
            <>
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {user.user_metadata?.full_name ||
                        user.user_metadata?.first_name ||
                        user.user_metadata?.name ||
                        user.user_metadata?.username ||
                        user.email?.split("@")[0] ||
                        "User"}
                      {isPaid && (
                        <span className="ml-2 inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full align-middle">
                          PAID
                        </span>
                      )}
                    </span>
                    {user.app_metadata?.provider === "google" && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Google User
                      </span>
                    )}
                  </div>

                  {showCompleteRegistrationCta ? (
                    <Link
                      href={primaryCta.href}
                      className="block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold"
                    >
                      {primaryCta.label}
                    </Link>
                  ) : (
                    isPaid && (
                      <Link
                        href={profileUrl}
                        className="block hover:text-primary transition font-medium px-4 py-2"
                      >
                        Profile
                      </Link>
                    )
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href={loginUrl} className="block hover:text-primary transition">
                    Login
                  </Link>
                  <Link
                    href={registerUrl}
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
