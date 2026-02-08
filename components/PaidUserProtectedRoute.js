/**
 * PaidUserProtectedRoute Component
 *
 * Supports three access modes:
 * 1. Local Dev (NEXT_PUBLIC_DISABLE_AUTH=true): Full access to everyone
 * 2. Online with Secret Password: Access via secret password 'iiskills123'
 * 3. Online with Auth: Standard authentication check
 *
 * The secret password feature provides a backdoor for demo/testing purposes.
 * ⚠️ SECURITY WARNING: Disable secret password feature for production!
 */

"use client"; // This component uses React hooks and authentication checks - must run on client side

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "@lib/supabaseClient";
import SecretPasswordPrompt, {
  hasSecretAdminAccess,
  createSecretAdminUser,
} from "./SecretPasswordPrompt";

export default function PaidUserProtectedRoute({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Mode 1: Local Dev - Check for DISABLE_AUTH flag
        const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
        if (isAuthDisabled) {
          console.log("⚠️ LOCAL DEV MODE: Authentication bypassed - full access granted");
          // Set mock user with full permissions
          setUser(createSecretAdminUser());
          setIsLoading(false);
          return;
        }

        // Mode 2: Secret Password - Check if user has entered secret password
        if (hasSecretAdminAccess()) {
          console.log("✅ Secret password verified - full access granted");
          // Set mock user with full permissions
          setUser(createSecretAdminUser());
          setIsLoading(false);
          return;
        }

        // Mode 3: Standard Authentication - Check Supabase auth
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // No user session found - show secret password prompt
          console.log("🔐 No authentication found - showing secret password prompt");
          setShowPasswordPrompt(true);
        }
      } catch (error) {
        console.error("Error checking access:", error);
        // On error, show secret password prompt as fallback
        setShowPasswordPrompt(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  const handlePasswordSuccess = () => {
    setShowPasswordPrompt(false);
    // Set mock user with full permissions
    setUser(createSecretAdminUser());
  };

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

  if (showPasswordPrompt) {
    return <SecretPasswordPrompt onSuccess={handlePasswordSuccess} />;
  }

  // User is authenticated - render the protected content (all features are free)
  return <>{children}</>;
}

/*
// ALL AUTHENTICATION LOGIC BELOW HAS BEEN DISABLED FOR OPEN ACCESS
export default function PaidUserProtectedRoute({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
*/
