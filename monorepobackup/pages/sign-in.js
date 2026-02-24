import Head from "next/head";
import UniversalLogin from "../components/shared/UniversalLogin";

/**
 * Sign-In Page - Alias to Login Page
 * 
 * Per Product Requirements: /sign-in must be a real page (no 404)
 * This provides an SEO-friendly alternative to /login
 * 
 * Features:
 * - Regular Login (email/password)
 * - Google Sign-In
 * - Magic Link for Google users
 * - Recommendation to register for better experience
 */
export default function SignIn() {
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
