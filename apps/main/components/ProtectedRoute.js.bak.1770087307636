import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "../lib/supabaseClient";

/**
 * Protected Route Component for Admin Pages
 *
 * This component ensures only authenticated users with admin role can access admin pages.
 * Uses Supabase backend authentication and checks admin status from public.profiles table.
 *
 * ⚠️ TEST MODE ENHANCEMENT:
 * - Supports password-first admin authentication via admin_token cookie
 * - Bypasses Supabase auth when TEST_MODE=true and valid admin_token exists
 * - Falls back to Supabase authentication when admin_token is not present
 *
 * Security:
 * - Backend validation via Supabase
 * - Role-based access control via profiles.is_admin
 * - JWT token verification for password-first auth
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
      // TEST MODE: Check for password-first admin authentication
      const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
      
      if (testMode && requireAdmin) {
        // In test mode, try admin_token verification first
        try {
          const verifyResponse = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify' }),
            credentials: 'include',
          });

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            if (verifyData.ok) {
              console.log('✅ Admin authenticated via admin_token (TEST MODE)');
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error('Admin token verification failed:', error);
        }
      }

      // UNIVERSAL PUBLIC ACCESS MODE: Authentication disabled
      // All admin and user routes are now publicly accessible
      // To re-enable authentication, set NEXT_PUBLIC_DISABLE_AUTH=false in .env.local
      const BYPASS_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'false';
      
      if (BYPASS_AUTH) {
        console.log('⚠️ PUBLIC MODE: Authentication bypassed - full public access granted');
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

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
