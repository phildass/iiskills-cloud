import Head from "next/head";
import UniversalLogin from "../components/shared/UniversalLogin";

/**
 * Login Page - Re-enabled per Product Requirements 14.2
 * 
 * Provides two options for user login:
 * 1. Regular Login (email/password)
 * 2. Google Sign-In
 * 
 * Displays recommendation: "Though we have Google sign in, we suggest you 
 * register here for a more streamlined experience."
 */
export default function Login() {
  return (
    <>
      <Head>
        <title>Login - iiskills.cloud</title>
        <meta
          name="description"
          content="Login to iiskills.cloud - Universal access to all apps and learning modules"
        />
      </Head>

      <div className="min-h-screen bg-neutral py-12">
        <div className="max-w-md mx-auto">
          {/* Recommendation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 mx-4">
            <p className="text-sm text-blue-800">
              Though we have Google login, we suggest you register here for a more streamlined experience.
            </p>
          </div>

          <UniversalLogin
            redirectAfterLogin="/dashboard"
            appName="iiskills.cloud"
            showMagicLink={true}
            showGoogleAuth={true}
          />
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
