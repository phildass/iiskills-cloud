import "../styles/globals.css";
import Head from "next/head";
import { SiteHeader, AppSecondaryNavbar } from "@iiskills/ui/navigation";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import { AIAssistant } from "@iiskills/ui/ai";
import TestingModeBanner from "../components/TestingModeBanner";
import TestSiteBanner from "../components/TestSiteBanner";
import TestSiteModal from "../components/TestSiteModal";
import { UserProgressProvider } from "../contexts/UserProgressContext";
import { AdminWrapper } from "@iiskills/ui/components/AdminProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IS_TEST_SITE } from "../lib/testSiteConfig";

/**
 * Paths that are allowed to navigate to even in test-site mode.
 * These are read-only / informational pages that do not perform any action.
 */
const ALLOWED_NAVIGATION_PATHS = [
  "/",
  "/courses",
  "/about",
  "/terms",
  "/privacy",
  "/help",
  "/newsletter",
  "/certification",
  "/solutions",
  "/apps",
];

function isAllowedNavigation(href) {
  if (!href) return false;
  try {
    // isAllowedNavigation is only called inside useEffect (client-side only).
    const url = new URL(href, window.location.origin);
    const path = url.pathname;
    return ALLOWED_NAVIGATION_PATHS.some(
      (allowed) => path === allowed || path.startsWith(allowed + "/")
    );
  } catch {
    return false;
  }
}

export default function App({ Component, pageProps }) {
  const [showTestModal, setShowTestModal] = useState(false);
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  useEffect(() => {
    if (!IS_TEST_SITE) return;

    function handleClick(e) {
      const target = e.target.closest("a, button, [role='button'], input[type='submit']");
      if (!target) return;

      const tag = target.tagName.toLowerCase();

      if (tag === "a") {
        const href = target.getAttribute("href") || "";
        // Allow relative hash links and clearly safe read-only navigation
        if (href.startsWith("#") || href === "") return;
        // Allow explicitly safe navigation paths
        if (isAllowedNavigation(href)) return;
        // Block all other link navigations that lead to action pages
        e.preventDefault();
        e.stopPropagation();
        setShowTestModal(true);
        return;
      }

      // Block all button clicks, role=button, and submit inputs
      e.preventDefault();
      e.stopPropagation();
      setShowTestModal(true);
    }

    // Use capture phase so we intercept before any component handler
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <AdminWrapper>
      <ErrorBoundary>
        <UserProgressProvider>
          <Head>
            <link rel="icon" href="/images/favicon-iiskills.svg" />
            <link rel="apple-touch-icon" href="/images/favicon-iiskills.svg" />
          </Head>

          {/* Test Site banner renders ABOVE the sticky nav */}
          <TestSiteBanner />

          <SiteHeader />
          {!isHomePage && (
            <AppSecondaryNavbar
              appId="main"
              appName="iiskills.cloud"
              showBadge={false}
              showCurriculum={true}
              curriculumPath="/courses"
              continueButtonLabel="Browse Courses"
              firstLessonPath="/courses"
            />
          )}
          <div className="pb-20">
            <Component {...pageProps} />
          </div>
          <Footer />

          {/* AI Assistant - always visible */}
          <AIAssistant />

          {/* Testing Mode Banner - shows when feature flags are enabled */}
          <TestingModeBanner />

          {/* Test Site modal - shown when visitor tries to perform any action */}
          {showTestModal && <TestSiteModal onClose={() => setShowTestModal(false)} />}
        </UserProgressProvider>
      </ErrorBoundary>
    </AdminWrapper>
  );
}
