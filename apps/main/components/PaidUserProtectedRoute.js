import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, checkUserPaymentStatus } from "../lib/supabaseClient";
import Link from "next/link";

// Configuration for access denied message
const ACCESS_DENIED_CONFIG = {
  title: "Access Restricted",
  message:
    "Only registered and paid users can access this page. Please log in if you are already registered. Or make payment here. This will lead you to our parent organisation AI Cloud Enterprises (aienter.in).",
  paymentUrl: "https://www.aienter.in/payments",
  paymentButtonText: "Make Payment (AI Cloud Enterprises)",
};

/**
 * PaidUserProtectedRoute Component
 *
 * This component protects pages that require both authentication AND payment/registration.
 * If a user is not logged in or hasn't paid, they will see a message with options to login or pay.
 *
 * ⚠️ TEST MODE ENHANCEMENT:
 * - When NEXT_PUBLIC_TEST_MODE=true, all paywall checks are bypassed
 * - This allows admin to access and test all paid content
 * - WARNING: This should NEVER be enabled in production
 *
 * Usage:
 * import PaidUserProtectedRoute from '../components/PaidUserProtectedRoute'
 *
 * export default function MyPaidPage() {
 *   return (
 *     <PaidUserProtectedRoute>
 *       <div>This content is only visible to registered and paid users</div>
 *     </PaidUserProtectedRoute>
 *   )
 * }
 *
 * How it works:
 * 1. Checks if TEST_MODE is enabled - if yes, bypass all checks
 * 2. Checks if user is authenticated via Supabase
 * 3. If authenticated, checks if user has paid/registered status
 * 4. Shows access denied message if user is not authenticated or hasn't paid
 * 5. Only renders children if user is authenticated and has paid
 */
export default function PaidUserProtectedRoute({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Check if user is authenticated and has paid
     */
    const checkAccess = async () => {
      try {
        // TEST MODE: Bypass all paywall and authentication checks
        // This allows admin to access and test all content
        // ⚠️ WARNING: NEVER enable in production
        const TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
        
        if (TEST_MODE) {
          console.log('🧪 TEST MODE: Paywall bypassed - full access to all paid content');
          setUser({ email: 'test-mode-admin@iiskills.cloud' });
          setHasPaid(true);
          setIsLoading(false);
          return;
        }

        // UNIVERSAL PUBLIC ACCESS MODE: Authentication and paywall disabled
        // All paid content is now publicly accessible
        // To re-enable paywall, set NEXT_PUBLIC_DISABLE_AUTH=false in .env.local
        const BYPASS_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'false';
        
        if (BYPASS_AUTH) {
          console.log('⚠️ PUBLIC MODE: Paywall bypassed - full public access to all content');
          // Mock authenticated paid user
          setUser({ email: 'public-access@iiskills.cloud' });
          setHasPaid(true);
          setIsLoading(false);
          return;
        }

        // Get current user from Supabase session
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          // User is authenticated - check payment status
          const paymentStatus = await checkUserPaymentStatus(currentUser);
          setHasPaid(paymentStatus);
        }
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

  // Show access denied message if user is not authenticated or hasn't paid
  if (!user || !hasPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-primary mb-4">{ACCESS_DENIED_CONFIG.title}</h1>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-800 leading-relaxed">{ACCESS_DENIED_CONFIG.message}</p>
          </div>

          <div className="space-y-4">
            {!user && (
              <>
                <div className="text-center text-gray-700 mb-4">
                  <p className="font-medium text-lg">New to iiskills.cloud?</p>
                  <p className="text-sm text-gray-600 mt-2">Create an account to get started</p>
                </div>
                <Link
                  href={`/register?redirect=${encodeURIComponent(router.asPath)}`}
                  className="block w-full bg-primary text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition text-center"
                >
                  Register New Account
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
              </>
            )}

            <a
              href={ACCESS_DENIED_CONFIG.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-accent text-white px-6 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-purple-700 transition text-center"
            >
              {ACCESS_DENIED_CONFIG.paymentButtonText}
            </a>

            {user && (
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600 text-sm">
                  Logged in as: <strong>{user.email}</strong>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Please complete your payment to access this content.
                </p>
              </div>
            )}
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

  // User is authenticated and has paid - render the protected content
  return <>{children}</>;
}
