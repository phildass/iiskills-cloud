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
 * Validates that an origin is an allowed iiskills.cloud domain.
 * Prevents open-redirect attacks when doing cross-subdomain token transfer.
 */
function isAllowedOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      url.hostname === "iiskills.cloud" ||
      url.hostname.endsWith(".iiskills.cloud") ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

/**
 * /auth/callback — Supabase magic-link / OAuth callback handler
 *
 * After Supabase redirects the user here with session tokens in the URL,
 * this page:
 * 1. Waits for the Supabase client to detect and exchange the session
 *    (detectSessionInUrl handles the PKCE code / implicit token).
 * 2. Reads the `origin` and `next` query-string params (set by the caller).
 * 3. If `origin` is a different (allowed) iiskills.cloud subdomain, transfers
 *    the session tokens to that subdomain via a URL-hash redirect so the
 *    subdomain's Supabase client can pick them up (detectSessionInUrl).
 * 4. Otherwise redirects to the validated `next` path on this domain.
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

        if (cancelled) return;

        // Validate and resolve the `next` destination
        const rawNext = router.query.next;
        const rawNextValue = Array.isArray(rawNext) ? rawNext[0] || undefined : rawNext;
        const destination = validateNextPath(rawNextValue);

        // Check if we need to redirect to a different origin (subdomain)
        const rawOrigin = router.query.origin;
        const originValue = Array.isArray(rawOrigin) ? rawOrigin[0] || undefined : rawOrigin;

        if (
          originValue &&
          isAllowedOrigin(originValue) &&
          originValue !== window.location.origin
        ) {
          // Transfer the session to the target subdomain by appending the tokens
          // to the URL hash. The subdomain's auth/callback page (with
          // detectSessionInUrl: true) will automatically pick them up.
          const session = data?.session;
          if (session) {
            const targetUrl = new URL(`${originValue}/auth/callback`);
            if (destination !== "/") {
              targetUrl.searchParams.set("next", destination);
            }
            const hashParams = new URLSearchParams({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              token_type: "bearer",
              type: "recovery",
            });
            setStatus("redirecting");
            window.location.href = `${targetUrl.toString()}#${hashParams.toString()}`;
            return;
          }
        }

        setStatus("redirecting");
        router.replace(destination);
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
