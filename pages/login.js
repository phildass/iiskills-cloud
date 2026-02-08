// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This login page has been disabled. Authentication is no longer required.
// All content is now publicly accessible without login.
// ============================================================================

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Login Page - DISABLED
 *
 * This page previously provided user authentication.
 * Login is no longer required - all content is publicly accessible.
 * Users visiting this page will be redirected to the homepage.
 */
export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage since login is no longer needed
    router.push("/");
  }, [router]);

  return (
    <>
      <Head>
        <title>Login Disabled - iiskills.cloud</title>
        <meta
          name="description"
          content="Login is no longer required. All content is publicly accessible."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login No Longer Required</h1>
          <p className="text-gray-600 mb-4">All content is now publicly accessible.</p>
          <p className="text-gray-600">Redirecting to homepage...</p>
        </div>
      </div>
    </>
  );
}

/*
// ORIGINAL LOGIN PAGE - DISABLED
import Head from "next/head";
import UniversalLogin from "../components/shared/UniversalLogin";

export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - iiskills.cloud</title>
        <meta
          name="description"
          content="Sign in to iiskills.cloud - Universal access to all apps and learning modules"
        />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/dashboard"
        appName="iiskills.cloud"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
*/
