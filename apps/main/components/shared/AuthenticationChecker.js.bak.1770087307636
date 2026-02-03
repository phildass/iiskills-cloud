import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../lib/supabaseClient";

/**
 * AuthenticationChecker Component
 *
 * Checks if the user is authenticated when opening an installed PWA app.
 * On first open (in standalone mode), if the user is not authenticated,
 * redirects them to the registration page.
 *
 * This component should be included in the _app.js of all subdomain apps
 * (but NOT the main domain).
 */
export default function AuthenticationChecker() {
  const router = useRouter();

  const checkAuthenticationOnFirstOpen = useCallback(async () => {
    // Only check if app is running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    if (!isStandalone) {
      // Not in standalone mode, no need to check
      return;
    }

    // Check if we've already prompted for authentication in this session
    const hasCheckedAuth = sessionStorage.getItem("hasCheckedAuth");
    if (hasCheckedAuth) {
      // Already checked in this session, don't check again
      return;
    }

    // Mark that we've checked auth in this session
    sessionStorage.setItem("hasCheckedAuth", "true");

    // Don't check on login/register pages to avoid redirect loops
    const currentPath = router.pathname;
    if (
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath.startsWith("/admin")
    ) {
      return;
    }

    // Check if user is authenticated
    const user = await getCurrentUser();

    if (!user) {
      // User is not authenticated, redirect to registration
      // Pass the current path as a query parameter to redirect back after registration
      const redirectUrl = `/register?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [router]);

  useEffect(() => {
    // Run the check
    checkAuthenticationOnFirstOpen();
  }, [checkAuthenticationOnFirstOpen]);

  // This component doesn't render anything
  return null;
}
