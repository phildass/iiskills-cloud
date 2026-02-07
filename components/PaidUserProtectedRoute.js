"use client"; // This component uses React hooks and authentication checks - must run on client side

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "@lib/supabaseClient";
import Link from "next/link";

// Configuration for access denied message
const ACCESS_DENIED_CONFIG = {
  title: "Registration Required",
  message:
    "Please register or log in to access this content. Registration is free and allows you to save your progress and personalize your experience.",
};

/**
 * PaidUserProtectedRoute Component
 *
 * This component protects pages that require authentication (free registration).
 * All registered users get full access - no payment required.
 *
 * Usage:
 * import PaidUserProtectedRoute from '../components/PaidUserProtectedRoute'
 *
 * export default function MyProtectedPage() {
 *   return (
 *     <PaidUserProtectedRoute>
 *       <div>This content is visible to all registered users</div>
 *     </PaidUserProtectedRoute>
 *   )
 * }
 *
 * How it works:
 * 1. Checks if user is authenticated via Supabase
 * 2. Shows registration/login message if user is not authenticated
 * 3. Renders children if user is authenticated (all features are free)
 */
export default function PaidUserProtectedRoute({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Check if user is authenticated
     */
    const checkAccess = async () => {
      try {
        // OPEN ACCESS MODE - Check for OPEN_ACCESS or legacy NEXT_PUBLIC_DISABLE_AUTH
        // Bypass all authentication, login, signup, registration, and paywall logic
        const isOpenAccess = process.env.NEXT_PUBLIC_OPEN_ACCESS === 'true' || 
                             process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
        
        if (isOpenAccess) {
          console.log('⚠️ OPEN ACCESS MODE: All authentication bypassed - granting full access');
          // Set mock user with full permissions
          setUser({
            id: 'open-access-user',
            email: 'open-access@iiskills.cloud',
            user_metadata: {
              full_name: 'Open Access User',
              firstName: 'Open',
              lastName: 'Access',
              is_admin: true,
              payment_status: 'paid'
            }
          });
          setIsLoading(false);
          return; // Skip all auth checks
        }
        
        // GUEST MODE: Allow temporary guest access via URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('guest') === 'true') {
          console.log('👤 GUEST MODE: Granting read-only access');
          setUser({
            id: 'guest-user',
            email: 'guest@iiskills.cloud',
            user_metadata: {
              full_name: 'Guest User',
              firstName: 'Guest',
              lastName: 'User',
              is_admin: false,
              payment_status: 'guest'
            }
          });
          setIsLoading(false);
          return;
        }
        // END TEMPORARY AUTH DISABLE

        // Get current user from Supabase session
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking access:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // Show loading state while checking access
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg text-charcoal">
          <div className="animate-pulse">Checking access permissions...</div>
        </div>
      </div>
    );
  }

  // Show access denied message if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-primary mb-4">{ACCESS_DENIED_CONFIG.title}</h1>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">{ACCESS_DENIED_CONFIG.message}</p>
          </div>

          <div className="space-y-4">
            {/* Continue as Guest Button - Temporary for Testing */}
            <button
              onClick={() => {
                // Set temporary flag and reload to enable guest access
                if (typeof window !== 'undefined') {
                  window.location.href = `${router.asPath}?guest=true`;
                }
              }}
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition text-center"
            >
              🌟 Continue as Guest (Browse Only)
            </button>
            
            <div className="text-center text-gray-500 text-sm">
              <span>or create a free account</span>
            </div>
            
            <div className="text-center text-gray-700 mb-4">
              <p className="font-medium text-lg">New to iiskills.cloud?</p>
              <p className="text-sm text-gray-600 mt-2">Create a free account to get started</p>
            </div>
            <Link
              href={`/register?redirect=${encodeURIComponent(router.asPath)}`}
              className="block w-full bg-primary text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition text-center"
            >
              Register Free Account
            </Link>
            <div className="text-center text-gray-600 my-2">
              <span className="text-sm">Already have an account?</span>
            </div>
            <Link
              href={`/login?redirect=${encodeURIComponent(router.asPath)}`}
              className="block w-full bg-charcoal text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-700 transition text-center"
            >
              Log In
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              href="/"
              className="block text-center text-primary hover:text-blue-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated - render the protected content (all features are free)
  return <>{children}</>;
}
