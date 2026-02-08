// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This registration page has been disabled. Authentication is no longer required.
// All content is now publicly accessible without registration.
// ============================================================================

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Register Page - DISABLED
 *
 * This page previously provided user registration.
 * Registration is no longer required - all content is publicly accessible.
 * Users visiting this page will be redirected to the homepage.
 */
export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage since registration is no longer needed
    router.push("/");
  }, [router]);

  return (
    <>
      <Head>
        <title>Registration Disabled - iiskills.cloud</title>
        <meta
          name="description"
          content="Registration is no longer required. All content is publicly accessible."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Registration No Longer Required</h1>
          <p className="text-gray-600 mb-4">All content is now publicly accessible.</p>
          <p className="text-gray-600">Redirecting to homepage...</p>
        </div>
      </div>
    </>
  );
}

/*
// ORIGINAL REGISTRATION PAGE - DISABLED
import Head from "next/head";
import UniversalRegister from "../components/shared/UniversalRegister";

export default function Register() {
  return (
    <>
      <Head>
        <title>Register - iiskills.cloud</title>
        <meta
          name="description"
          content="Create your account - Access all iiskills.cloud apps and learning modules"
        />
      </Head>

      <UniversalRegister
        simplified={false}
        redirectAfterRegister="/login"
        appName="iiskills.cloud"
        showGoogleAuth={true}
      />
    </>
  );
}
*/
