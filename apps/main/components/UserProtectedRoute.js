// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This component previously enforced user authentication for protected pages.
// All authentication logic has been commented out to make content publicly accessible.
// All pages are now open to all users without login/registration requirements.
// ============================================================================

/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/supabaseClient";
*/

/**
 * UserProtectedRoute Component - AUTHENTICATION DISABLED
 *
 * OPEN ACCESS MODE: This component now grants full access to all users without authentication.
 * All authentication, login, and registration logic has been removed.
 *
 * Previous functionality (now disabled):
 * - Checked if user is authenticated via Supabase
 * - Redirected to login/register if not authenticated
 * - Only rendered children if user is authenticated
 */
export default function UserProtectedRoute({ children }) {
  // OPEN ACCESS: Bypass all authentication - grant full access to everyone
  // No loading state, no auth checks, no redirects
  return <>{children}</>;
}

/*
// ALL AUTHENTICATION LOGIC BELOW HAS BEEN DISABLED FOR OPEN ACCESS
export default function UserProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isOpenAccess = process.env.NEXT_PUBLIC_OPEN_ACCESS === 'true' || 
                             process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
        
        if (isOpenAccess) {
          console.log('⚠️ OPEN ACCESS MODE: All authentication bypassed - granting full access');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        const user = await getCurrentUser();

        if (user) {
          setIsAuthenticated(true);
        } else {
          const currentPath = router.asPath;
          router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        const currentPath = router.asPath;
        router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg text-charcoal">
          <div className="animate-pulse">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
*/
