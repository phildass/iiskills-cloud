/**
 * UserProtectedRoute Component
 *
 * Supports three access modes:
 * 1. Local Dev (NEXT_PUBLIC_DISABLE_AUTH=true): Full access to everyone
 * 2. Online with Secret Password: Access via secret password 'iiskills123'
 * 3. Online with Auth: Standard authentication check
 *
 * The secret password feature provides a backdoor for demo/testing purposes.
 * ⚠️ SECURITY WARNING: Disable secret password feature for production!
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/supabaseClient";
import SecretPasswordPrompt, { hasSecretAdminAccess } from "../../../components/SecretPasswordPrompt";

export default function UserProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Mode 1: Local Dev - Check for DISABLE_AUTH flag
        const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
        if (isAuthDisabled) {
          console.log("⚠️ LOCAL DEV MODE: Authentication bypassed - full access granted");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Mode 2: Secret Password - Check if user has entered secret password
        if (hasSecretAdminAccess()) {
          console.log("✅ Secret password verified - access granted");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Mode 3: Standard Authentication - Check Supabase auth
        const user = await getCurrentUser();

        if (user) {
          // User is authenticated - allow access
          setIsAuthenticated(true);
        } else {
          // No user session found - show secret password prompt
          console.log("🔐 No authentication found - showing secret password prompt");
          setShowPasswordPrompt(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // On error, show secret password prompt as fallback
        setShowPasswordPrompt(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handlePasswordSuccess = () => {
    setShowPasswordPrompt(false);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg text-charcoal">
          <div className="animate-pulse">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (showPasswordPrompt) {
    return <SecretPasswordPrompt onSuccess={handlePasswordSuccess} />;
  }

  if (!isAuthenticated) {
    return null;
  }

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
