import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const AIENTER_PAYMENT_URL = 'https://aienter.in/payments/iiskills';
const RETURN_TO_URL = 'https://iiskills.cloud/otp-gateway';

/**
 * /payments/iiskills — Redirect to centralized payment portal
 *
 * All Razorpay order creation is handled by aienter.in.
 * This page immediately redirects the user to aienter.in/payments/iiskills
 * with the course and returnTo query parameters.
 *
 * Query params accepted:
 *   - course : app-id of the course being purchased (e.g. "learn-ai")
 *
 * Route: /payments/iiskills
 */
export default function IiskillsCheckout() {
  const router = useRouter();
  const { course } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    const params = new URLSearchParams({
      ...(course && { course }),
      returnTo: RETURN_TO_URL,
    });

    window.location.href = `${AIENTER_PAYMENT_URL}?${params.toString()}`;
  }, [router.isReady, course]);

  return (
    <>
      <Head>
        <title>Redirecting to Payment — iiskills.cloud</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-700 font-medium">Redirecting to payment portal…</p>
        </div>
      </div>
    </>
  );
}
