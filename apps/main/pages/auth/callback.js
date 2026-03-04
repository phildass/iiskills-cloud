import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

/**
 * Validates a `next` redirect path to prevent open-redirect attacks.
 * Only allows same-origin relative paths that start with "/" but not
 * "//" (protocol-relative) or any scheme like "http"/"https".
 *
 * @param {string} next - The redirect path to validate
 * @returns {string} A safe path — the validated path or "/" as fallback
 */
function validateNextPath(next) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /^\/[a-z][a-z0-9+.-]*:/i.test(next) // catches /http:, /https:, /javascript:, etc.
  ) {
    return "/";
  }
  return next;
}

/**
 * /auth/callback — Supabase magic-link / OAuth callback handler
 *
 * After Supabase redirects the user here with session tokens in the URL,
 * this page:
 * 1. Waits for the Supabase client to detect and exchange the session
 *    (detectSessionInUrl handles the PKCE code / implicit token).
 * 2. Reads the `next` query-string param (set by the caller, e.g. /sign-in).
 * 3. Validates `next` to prevent open-redirect attacks.
 * 4. Redirects the user to the validated destination (or "/" as fallback).
 */
export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!router.isReady) return;

    let cancelled = false;

    async function handleCallback() {
      try {
        // Dynamically import to avoid SSR issues with supabaseClient
        const { supabase } = await import("../../lib/supabaseClient");

        // Give Supabase client time to detect the session from the URL
        // (it handles PKCE code exchange and implicit token automatically)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[auth/callback] Session error:", error.message);
        }

        if (!cancelled) {
          // Validate and redirect to the `next` destination
          const raw = router.query.next;
          const rawValue = Array.isArray(raw) ? raw[0] || undefined : raw;
          const destination = validateNextPath(rawValue);
          setStatus("redirecting");
          router.replace(destination);
        }
      } catch (err) {
        console.error("[auth/callback] Unexpected error:", err);
        if (!cancelled) {
          setStatus("error");
          router.replace("/");
        }
      }
    }

    handleCallback();
    return () => {
      cancelled = true;
    };
  }, [router.isReady, router]);

  return (
    <>
      <Head>
        <title>Signing you in… — iiskills.cloud</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          {status === "error" ? (
            <p className="text-red-600 font-medium">
              Something went wrong. Redirecting to home…
            </p>
          ) : (
            <>
              <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Signing you in…</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
