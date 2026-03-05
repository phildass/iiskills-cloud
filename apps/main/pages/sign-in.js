import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UniversalLogin } from "@iiskills/ui/authentication";

/**
 * Login Page - Main App (Route: /sign-in)
 * 
 * Per Product Requirements: /sign-in must be a real page (no 404)
 * This provides an SEO-friendly alternative to /login in the main app
 * 
 * Features:
 * - Regular Login (email/password)
 * - Google Login
 * - Magic Link for Google users
 * - Recommendation to register for better experience
 * 
 * Already-authenticated guard: on mount we check for an existing Supabase
 * session and immediately redirect to the `next` param (or /dashboard) so
 * that users who are already logged in — including those arriving here right
 * after an OAuth callback — are never stuck on the login form.
 *
 * Allowlisted public paths that should NEVER be used as a `next` destination
 * (they would cause a redirect loop):
 *   /sign-in, /login, /register, /auth/callback
 */

/**
 * Validates the `next` redirect path to prevent open-redirect attacks and
 * redirect loops back to the sign-in page itself.
 */
function safeNextPath(next) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /^\/[a-z][a-z0-9+.-]*:/i.test(next) ||
    /[\r\n\t]/.test(next)
  ) {
    return "/dashboard";
  }
  // Prevent redirect loops: if `next` points back to an auth page, fall
  // through to the default dashboard.
  // Allowlist of paths that must never be used as a redirect destination:
  //   /sign-in, /login, /register, /auth/callback
  const lower = next.toLowerCase();
  if (
    lower.startsWith("/sign-in") ||
    lower.startsWith("/login") ||
    lower.startsWith("/register") ||
    lower.startsWith("/auth/callback")
  ) {
    return "/dashboard";
  }
  return next;
}

export default function SignIn() {
  const router = useRouter();
  const { next } = router.query;
  const [checking, setChecking] = useState(true);

  // ── Already-authenticated guard ───────────────────────────────────────────
  // Check for an existing session on mount.  If one is found we skip the
  // login form entirely and redirect the user to their intended destination.
  // This stops the "login loop" where users who just finished Google OAuth
  // land back on /sign-in even though their session is already established.
  useEffect(() => {
    if (!router.isReady) return;

    let cancelled = false;

    async function checkSession() {
      try {
        const { supabase } = await import("../lib/supabaseClient");
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data?.session) {
          const destination = safeNextPath(
            Array.isArray(next) ? next[0] : next
          );
          router.replace(destination);
          return;
        }
      } catch {
        // Supabase unavailable — fall through and show login form
      }
      if (!cancelled) setChecking(false);
    }

    checkSession();
    return () => { cancelled = true; };
  }, [router.isReady, next, router]);

  // Show nothing while we check the session to avoid a flash of the login form
  // for already-authenticated users.
  if (checking) return null;

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
            redirectAfterLogin={next || "/dashboard"}
            nextUrl={next}
            appName="iiskills.cloud"
            showMagicLink={true}
            showGoogleAuth={true}
          />
        </div>
      </div>
    </>
  );
}
