/**
 * Protected Route Component for Admin Pages
 *
 * Supports three access modes:
 * 1. Local Dev (NEXT_PUBLIC_DISABLE_AUTH=true): Full access to everyone
 * 2. Online with Secret Password: Access via secret password 'iiskills123'
 * 3. Online with Auth: Standard authentication and admin role check
 *
 * The secret password feature provides a backdoor for demo/testing purposes.
 * ⚠️ SECURITY WARNING: Disable secret password feature for production!
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "@lib/supabaseClient";
import SecretPasswordPrompt, { hasSecretAdminAccess } from "./SecretPasswordPrompt";

export default function ProtectedRoute({ children, requireAdmin = true }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

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
        console.log("✅ Secret password verified - admin access granted");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Mode 3: Standard Authentication - Check Supabase auth
      const user = await getCurrentUser();

      if (!user) {
        // Not logged in - show secret password prompt
        console.log("🔐 No authentication found - showing secret password prompt");
        setShowPasswordPrompt(true);
        setIsLoading(false);
        return;
      }

      if (requireAdmin) {
        // Check if user has admin role in profiles table
        const hasAdminAccess = await isAdmin(user);

        if (!hasAdminAccess) {
          // User is logged in but not an admin - show secret password prompt
          console.log("❌ User is not admin - showing secret password prompt");
          setShowPasswordPrompt(true);
          setIsLoading(false);
          return;
        }
      }

      // User is authenticated (and admin if required)
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking auth:", error);
      // On error, show secret password prompt as fallback
      setShowPasswordPrompt(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handlePasswordSuccess = () => {
    setShowPasswordPrompt(false);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Verifying credentials...</div>
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
export default function ProtectedRoute({ children, requireAdmin = true }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      // OPEN ACCESS MODE - Check for OPEN_ACCESS or legacy NEXT_PUBLIC_DISABLE_AUTH
      // Bypass all authentication, login, signup, registration, and paywall logic
      const isOpenAccess = process.env.NEXT_PUBLIC_OPEN_ACCESS === 'true' || 
                           process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
      if (isOpenAccess) {
        console.log("⚠️ OPEN ACCESS MODE: All authentication bypassed - granting access");
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
*/
