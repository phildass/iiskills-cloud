// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This component previously enforced admin authentication for protected pages.
// All authentication logic has been commented out to make content publicly accessible.
// All admin pages are now open to all users without login/admin verification.
// ============================================================================

/*
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "@lib/supabaseClient";
*/

/**
 * Protected Route Component for Admin Pages - AUTHENTICATION DISABLED
 *
 * OPEN ACCESS MODE: This component now grants full access to all users without authentication.
 * All authentication and admin role checking has been removed.
 *
 * Previous functionality (now disabled):
 * - Checked if user is authenticated via Supabase
 * - Verified admin role from public.profiles table
 * - Redirected to login if not authenticated
 * - Showed access denied if not admin
 */
export default function ProtectedRoute({ children, requireAdmin = true }) {
  // OPEN ACCESS: Bypass all authentication - grant full access to everyone
  // No loading state, no auth checks, no redirects
  return <>{children}</>;
}

/*
// ALL AUTHENTICATION LOGIC BELOW HAS BEEN DISABLED FOR OPEN ACCESS
export default function ProtectedRoute({ children, requireAdmin = true }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      // OPEN ACCESS MODE - Check for OPEN_ACCESS or legacy NEXT_PUBLIC_DISABLE_AUTH
      // Bypass all authentication, login, signup, registration, and paywall logic
      const isOpenAccess = process.env.NEXT_PUBLIC_OPEN_ACCESS === 'true' || 
                           process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
      if (isOpenAccess) {
        console.log("⚠️ OPEN ACCESS MODE: All authentication bypassed - granting access");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // GUEST MODE: Allow temporary guest access via URL parameter (non-admin only)
      if (!requireAdmin) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('guest') === 'true') {
          console.log('👤 GUEST MODE: Granting read-only access');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      // END TEMPORARY AUTH DISABLE

      const user = await getCurrentUser();

      if (!user) {
        // Not logged in - redirect to login with return URL
        // Universal Redirect: Preserve current path for post-auth redirect
        // Only allow relative paths for security (prevent open redirect)
        const returnUrl = router.asPath.startsWith("/") ? router.asPath : "/";
        router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
        setIsLoading(false);
        return;
      }

      if (requireAdmin) {
        // Check if user has admin role in profiles table
        const hasAdminAccess = await isAdmin(user);

        if (!hasAdminAccess) {
          // User is logged in but not an admin
          router.push("/?error=access_denied");
          setIsLoading(false);
          return;
        }
      }

      // User is authenticated (and admin if required)
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking auth:", error);
      // Universal Redirect: Preserve current path even on error
      const returnUrl = router.asPath.startsWith("/") ? router.asPath : "/";
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Verifying credentials...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
*/
