import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "@lib/supabaseClient";

/**
 * Protected Route Component for Admin Pages
 *
 * This component ensures only authenticated users with admin role can access admin pages.
 * Uses Supabase backend authentication and checks admin status from public.profiles table.
 *
 * Security:
 * - Backend validation via Supabase
 * - Role-based access control via profiles.is_admin
 * - Automatic redirect to login if not authenticated
 */
export default function ProtectedRoute({ children, requireAdmin = true }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      // TEMPORARY AUTH DISABLE - PR: feature/disable-auth-temporary
      // Bypass all auth checks when flag is enabled for debugging/maintenance
      const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
      if (isAuthDisabled) {
        console.log("⚠️ AUTH DISABLED: ProtectedRoute bypassed - granting access");
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
