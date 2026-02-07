import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "@lib/supabaseClient";

/**
 * UserProtectedRoute Component
 *
 * This component protects pages that require authentication.
 * If a user is not logged in, they will be redirected to the login page.
 *
 * Usage:
 * import UserProtectedRoute from '../components/UserProtectedRoute'
 *
 * export default function MyProtectedPage() {
 *   return (
 *     <UserProtectedRoute>
 *       <div>This content is only visible to logged-in users</div>
 *     </UserProtectedRoute>
 *   )
 * }
 *
 * How it works:
 * 1. On mount, checks if user is authenticated via Supabase
 * 2. If not authenticated, redirects to /login
 * 3. Shows loading state while checking authentication
 * 4. Only renders children if user is authenticated
 */
export default function UserProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Check if user is authenticated
     * Uses Supabase session to verify authentication
     */
    const checkAuth = async () => {
      try {
        // OPEN ACCESS MODE - Check for OPEN_ACCESS or legacy NEXT_PUBLIC_DISABLE_AUTH
        // Bypass all authentication, login, signup, registration, and paywall logic
        const isOpenAccess = process.env.NEXT_PUBLIC_OPEN_ACCESS === 'true' || 
                             process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
        
        if (isOpenAccess) {
          console.log('⚠️ OPEN ACCESS MODE: All authentication bypassed - granting full access');
          setIsAuthenticated(true);
          setIsLoading(false);
          return; // Skip all auth checks
        }
        
        // GUEST MODE: Allow temporary guest access via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('guest') === 'true') {
          console.log('👤 GUEST MODE: Granting read-only access');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        // END TEMPORARY AUTH DISABLE

        // Get current user from Supabase session
        const user = await getCurrentUser();

        if (user) {
          // User is authenticated - allow access
          setIsAuthenticated(true);
        } else {
          // No user session found - redirect to register (registration-first workflow)
          // Universal Redirect: Store the current path so we can redirect back after registration/login
          // This ensures users return to the exact page where they started the auth flow
          const currentPath = router.asPath;
          router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // On error, redirect to register for safety (registration-first workflow)
        // Universal Redirect: Preserve current path for post-auth redirect
        const currentPath = router.asPath;
        router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg text-charcoal">
          <div className="animate-pulse">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated - render the protected content
  return <>{children}</>;
}
