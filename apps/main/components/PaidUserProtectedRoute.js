/**
 * PaidUserProtectedRoute Component
 *
 * Supports three access modes:
 * 1. Local Dev (NEXT_PUBLIC_DISABLE_AUTH=true): Full access to everyone
 * 2. Online with Secret Password: Access via secret password 'iiskills123'
 * 3. Online with Auth: Standard authentication and payment check
 *
 * The secret password feature provides a backdoor for demo/testing purposes.
 * ⚠️ SECURITY WARNING: Disable secret password feature for production!
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/supabaseClient";
import SecretPasswordPrompt, { hasSecretAdminAccess } from "../../../components/SecretPasswordPrompt";

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
          setUser({
            id: "open-access-user",
            email: "open-access@iiskills.cloud",
            user_metadata: {
              full_name: "Open Access User",
              firstName: "Open",
              lastName: "Access",
              is_admin: true,
              payment_status: "paid"
            }
          });
          setIsLoading(false);
          return;
        }

        // Mode 2: Secret Password - Check if user has entered secret password
        if (hasSecretAdminAccess()) {
          console.log("✅ Secret password verified - full access granted");
          // Set mock user with full permissions
          setUser({
            id: "secret-admin-user",
            email: "secret-admin@iiskills.cloud",
            user_metadata: {
              full_name: "Secret Admin User",
              firstName: "Secret",
              lastName: "Admin",
              is_admin: true,
              payment_status: "paid"
            }
          });
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
    setUser({
      id: "secret-admin-user",
      email: "secret-admin@iiskills.cloud",
      user_metadata: {
        full_name: "Secret Admin User",
        firstName: "Secret",
        lastName: "Admin",
        is_admin: true,
        payment_status: "paid"
      }
    });
  };

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
