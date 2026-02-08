// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This component previously enforced authentication and payment for paid content.
// All authentication logic has been commented out to make content publicly accessible.
// All pages are now open to all users without login/registration/payment requirements.
// ============================================================================

/*
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, checkUserPaymentStatus } from "../lib/supabaseClient";
import Link from "next/link";
*/

/*
// Configuration for access denied message
const ACCESS_DENIED_CONFIG = {
  title: "Access Restricted",
  message:
    "Only registered and paid users can access this page. Please log in if you are already registered. Or make payment here. This will lead you to our parent organisation AI Cloud Enterprises (aienter.in).",
  paymentUrl: "https://www.aienter.in/payments",
  paymentButtonText: "Make Payment (AI Cloud Enterprises)",
};
*/

/**
 * PaidUserProtectedRoute Component - AUTHENTICATION DISABLED
 *
 * OPEN ACCESS MODE: This component now grants full access to all users without authentication.
 * All authentication, login, registration, payment, and paywall logic has been removed.
 *
 * Previous functionality (now disabled):
 * - Checked if user is authenticated via Supabase
 * - Verified payment status
 * - Showed access denied message if user is not authenticated or hasn't paid
 * - Rendered children only if user is authenticated and has paid
 */
export default function PaidUserProtectedRoute({ children }) {
  // OPEN ACCESS: Bypass all authentication - grant full access to everyone
  // No loading state, no auth checks, no payment checks, no redirects
  return <>{children}</>;
}

/*
// ALL AUTHENTICATION LOGIC BELOW HAS BEEN DISABLED FOR OPEN ACCESS
export default function PaidUserProtectedRoute({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const isOpenAccess = process.env.NEXT_PUBLIC_OPEN_ACCESS === 'true' || 
                             process.env.NEXT_PUBLIC_TEST_MODE === 'true' ||
                             process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
        
        if (isOpenAccess) {
          console.log('⚠️ OPEN ACCESS MODE: All authentication and paywalls bypassed - granting full access');
          setUser({ email: 'open-access@iiskills.cloud' });
          setHasPaid(true);
          setIsLoading(false);
          return;
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('guest') === 'true') {
          console.log('👤 GUEST MODE: Granting read-only access');
          setUser({ email: 'guest@iiskills.cloud' });
          setHasPaid(true);
          setIsLoading(false);
          return;
        }

        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg text-charcoal">
          <div className="animate-pulse">Checking access permissions...</div>
        </div>
      </div>
    );
  }

  if (!user || !hasPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary">
          ... access denied UI ...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
*/
