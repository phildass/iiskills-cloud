// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This authentication checker component has been disabled.
// Authentication is no longer required - all content is publicly accessible.
// ============================================================================

/*
"use client"; // This component uses React hooks and browser navigation - must run on client side

import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "@lib/supabaseClient";
*/

/**
 * AuthenticationChecker Component - DISABLED
 *
 * This component previously checked if the user was authenticated when opening a PWA app.
 * Authentication checking has been disabled - all content is now publicly accessible.
 */
export default function AuthenticationChecker() {
  // OPEN ACCESS: No authentication checking - component does nothing
  return null;
}

/*
// ORIGINAL AUTHENTICATION CHECKER - DISABLED
export default function AuthenticationChecker() {
  const router = useRouter();

  const checkAuthenticationOnFirstOpen = useCallback(async () => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

    if (!isStandalone) {
      return;
    }

    const hasCheckedAuth = sessionStorage.getItem("hasCheckedAuth");
    if (hasCheckedAuth) {
      return;
    }

    sessionStorage.setItem("hasCheckedAuth", "true");

    const currentPath = router.pathname;
    if (
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath.startsWith("/admin")
    ) {
      return;
    }

    const user = await getCurrentUser();

    if (!user) {
      const redirectUrl = `/register?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [router]);

  useEffect(() => {
    checkAuthenticationOnFirstOpen();
  }, [checkAuthenticationOnFirstOpen]);

  return null;
}
*/
