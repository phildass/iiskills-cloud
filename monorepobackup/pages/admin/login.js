// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This admin login page has been disabled. Authentication is no longer required.
// All admin pages are now publicly accessible without login.
// ============================================================================

import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Admin Login Page - DISABLED
 *
 * This page previously provided admin authentication.
 * Admin login is no longer required - all admin pages are publicly accessible.
 * Users visiting this page will be redirected to the admin dashboard.
 */
export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard since login is no longer needed
    router.push("/admin");
  }, [router]);

  return (
    <>
      <Head>
        <title>Admin Login Disabled - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Login No Longer Required</h1>
          <p className="text-gray-600 mb-4">All admin pages are now publicly accessible.</p>
          <p className="text-gray-600">Redirecting to admin dashboard...</p>
        </div>
      </div>
    </>
  );
}

/*
// ORIGINAL ADMIN LOGIN PAGE - DISABLED
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import UniversalLogin from "../../components/shared/UniversalLogin";
import { getCurrentUser, isAdmin } from "../../lib/supabaseClient";

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    const checkExistingAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        const hasAdminAccess = await isAdmin(user);
        if (hasAdminAccess) {
          router.push("/admin");
        }
      }
    };
    checkExistingAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>Admin Login - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/admin"
        appName="iiskills.cloud Admin"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
*/
