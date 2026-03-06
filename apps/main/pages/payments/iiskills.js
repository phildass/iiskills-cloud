import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getPaymentReturnToUrl } from "@lib/appRegistry";

const AIENTER_PAYMENT_URL = "https://aienter.in/payments/iiskills";

/**
 * /payments/iiskills — Redirect to centralized payment portal (Option A)
 *
 * Flow:
 * 1. User must be authenticated on iiskills.cloud (Supabase session).
 *    If not, they are redirected to /sign-in with a ?next= param so they
 *    return here after login.
 * 2. A short-lived signed JWT is generated via POST /api/payments/generate-token.
 *    The token carries the user's identity (user_id, name, phone, email),
 *    the chosen course slug, and the returnTo URL.
 * 3. The user is redirected to aienter.in with the token embedded, so aienter
 *    can return it in the server-to-server callback and iiskills can grant
 *    entitlement without an OTP.
 *
 * Query params accepted:
 *   - course : app-id of the course being purchased (e.g. "learn-management")
 *
 * Route: /payments/iiskills
 */
export default function IiskillsCheckout() {
  const router = useRouter();
  const { course } = router.query;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    let cancelled = false;

    async function initPayment() {
      // ── 1. Check authentication ───────────────────────────────────────────
      // Use a short retry loop to handle the window right after an OAuth
      // redirect where the Supabase client may still be exchanging the PKCE
      // code for a session token.  3 attempts over ~1 s is enough to cover
      // typical token-exchange latency without noticeably delaying users who
      // genuinely are not authenticated.
      let session = null;
      const MAX_SESSION_ATTEMPTS = 3;
      const SESSION_RETRY_DELAY_MS = 400;

      for (let attempt = 1; attempt <= MAX_SESSION_ATTEMPTS; attempt++) {
        try {
          const { supabase } = await import("../../lib/supabaseClient");
          const { data } = await supabase.auth.getSession();
          session = data?.session ?? null;
        } catch {
          // Supabase unavailable — treat as unauthenticated after retries
        }

        if (session) break;

        if (attempt < MAX_SESSION_ATTEMPTS) {
          // Wait before retrying to give the client time to establish the session
          await new Promise((resolve) => setTimeout(resolve, SESSION_RETRY_DELAY_MS));
        }
      }

      if (cancelled) return;

      if (!session) {
        // Redirect to sign-in; after login the user returns to this page
        const next = encodeURIComponent(`/payments/iiskills${course ? `?course=${course}` : ""}`);
        router.replace(`/sign-in?next=${next}`);
        return;
      }

      // ── 2. Generate a signed payment token ────────────────────────────────
      let token = null;
      try {
        const resp = await fetch("/api/payments/generate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ courseSlug: course || "iiskills" }),
        });
        const data = await resp.json();
        if (!resp.ok || !data.token) {
          throw new Error(data.error || "Token generation failed");
        }
        token = data.token;
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not prepare payment. Please try again.");
        }
        return;
      }

      if (cancelled) return;

      // ── 3. Redirect to aienter with token ─────────────────────────────────
      const returnTo = getPaymentReturnToUrl(course);
      const params = new URLSearchParams({
        ...(course && { course }),
        token,
        returnTo,
      });

      window.location.href = `${AIENTER_PAYMENT_URL}?${params.toString()}`;
    }

    initPayment();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, course, router]); // router is stable but included for completeness

  return (
    <>
      <Head>
        <title>Redirecting to Payment — iiskills.cloud</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          {error ? (
            <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-8">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Link
                href={course ? `/payments/iiskills?course=${course}` : "/payments/iiskills"}
                className="text-blue-600 underline text-sm"
              >
                Try again
              </Link>
            </div>
          ) : (
            <>
              <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-700 font-medium">Preparing your payment…</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
