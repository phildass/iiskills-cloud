import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

/**
 * Validates a `next` redirect path to prevent open-redirect attacks.
 * Only allows relative paths starting with "/" (not "//", no scheme).
 */
function validateNextPath(next) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /^\/[a-z][a-z0-9+.-]*:/i.test(next)
  ) {
    return "/";
  }
  return next;
}

/**
 * /auth/callback — Receives the Supabase session from the centralized
 * iiskills.cloud/auth/callback after cross-subdomain token transfer.
 *
 * The main callback redirects here with session tokens in the URL hash
 * (access_token, refresh_token). Supabase's detectSessionInUrl:true picks
 * them up automatically. This page then forwards the user to `next`.
 */
export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!router.isReady) return;

    let cancelled = false;

    async function handleCallback() {
      try {
        const { supabase } = await import("../../lib/supabaseClient");

        // detectSessionInUrl:true in the supabase client automatically picks
        // up access_token / refresh_token from the URL hash.
        const { error } = await supabase.auth.getSession();

        if (error) {
          console.error("[auth/callback] Session error:", error.message);
        }

        if (!cancelled) {
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
            <p className="text-red-600 font-medium">Something went wrong. Redirecting to home…</p>
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
