import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const AIENTER_PAYMENT_URL = 'https://aienter.in/payments/iiskills';
const RETURN_TO_URL = 'https://iiskills.cloud/payments/success';

/**
 * /payments/iiskills — Redirect to centralized payment portal (Option A)
 *
 * Flow:
 * 1. User must be authenticated on iiskills.cloud (Supabase session).
 *    If not, they are redirected to /sign-in with a ?next= param so they
 *    return here after login.
 * 2. A short-lived signed JWT is generated via POST /api/payments/generate-token.
 *    The token carries the user's identity (user_id, name, phone, email) and
 *    the chosen course slug.
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    let cancelled = false;

    async function initPayment() {
      // ── 1. Check authentication ───────────────────────────────────────────
      let session = null;
      try {
        const { supabase } = await import('../../lib/supabaseClient');
        const { data } = await supabase.auth.getSession();
        session = data?.session;
      } catch {
        // Supabase unavailable — treat as unauthenticated
      }

      if (!session) {
        // Redirect to sign-in; after login the user returns to this page
        const next = encodeURIComponent(
          `/payments/iiskills${course ? `?course=${course}` : ''}`
        );
        router.replace(`/sign-in?next=${next}`);
        return;
      }

      // ── 2. Generate a signed payment token ────────────────────────────────
      let token = null;
      try {
        const resp = await fetch('/api/payments/generate-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ courseSlug: course || 'iiskills' }),
        });
        const data = await resp.json();
        if (!resp.ok || !data.token) {
          throw new Error(data.error || 'Token generation failed');
        }
        token = data.token;
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not prepare payment. Please try again.');
        }
        return;
      }

      if (cancelled) return;

      // ── 3. Redirect to aienter with token ─────────────────────────────────
      const params = new URLSearchParams({
        ...(course && { course }),
        token,
        returnTo: RETURN_TO_URL,
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
                href={course ? `/payments/iiskills?course=${course}` : '/payments/iiskills'}
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
