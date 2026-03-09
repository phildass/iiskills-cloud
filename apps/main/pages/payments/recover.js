import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

/**
 * /payments/recover — Payment Recovery Page
 *
 * Shown when a user's payment authentication (3DS / bank auth) fails or is
 * not completed on aienter.in. The user is redirected here with their
 * purchaseId so they can re-initiate the authorization flow.
 *
 * Flow:
 * 1. aienter.in redirects user here after a failed 3DS / bank auth attempt.
 * 2. This page shows a clear message explaining what happened.
 * 3. A "Continue to Authorization Page" CTA re-initiates the payment flow:
 *    - The user is sent back to /payments/iiskills?course=<courseSlug>
 *    - The existing purchase record is reused (deduplication in create-purchase)
 *    - A fresh payment token is generated for the re-attempt
 *
 * Query params accepted:
 *   - purchaseId : UUID of the purchase that failed authentication
 *   - course     : (optional) course slug — if provided, skips the API lookup
 *
 * Route: /payments/recover
 */
export default function PaymentRecover() {
  const router = useRouter();
  const { purchaseId, course: courseFromQuery } = router.query;

  /**
   * step:
   *   'loading'   — looking up purchase details
   *   'ready'     — course slug resolved, CTA available
   *   'error'     — could not resolve purchase / not authenticated
   *   'no-id'     — purchaseId missing from URL
   */
  const [step, setStep] = useState("loading");
  const [courseSlug, setCourseSlug] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (!purchaseId) {
      setStep("no-id");
      return;
    }

    // If course was provided in the URL (e.g. passed by aienter.in), use it directly.
    if (courseFromQuery) {
      setCourseSlug(courseFromQuery);
      setStep("ready");
      return;
    }

    // Otherwise, look up the purchase to find the course slug.
    let cancelled = false;

    async function lookupPurchase() {
      try {
        const { supabase } = await import("../../lib/supabaseClient");
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session ?? null;

        if (!session) {
          // Not authenticated — redirect to sign-in, returning here after login.
          const next = encodeURIComponent(`/payments/recover?purchaseId=${purchaseId}`);
          router.replace(`/sign-in?next=${next}`);
          return;
        }

        const resp = await fetch(
          `/api/payments/purchase-details?purchaseId=${encodeURIComponent(purchaseId)}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        if (cancelled) return;

        if (resp.status === 401) {
          const next = encodeURIComponent(`/payments/recover?purchaseId=${purchaseId}`);
          router.replace(`/sign-in?next=${next}`);
          return;
        }

        const data = await resp.json();

        if (!resp.ok) {
          setErrorMsg(data.error || "Could not retrieve payment details.");
          setStep("error");
          return;
        }

        setCourseSlug(data.courseSlug);
        setStep("ready");
      } catch {
        if (!cancelled) {
          setErrorMsg("Could not retrieve payment details. Please try again.");
          setStep("error");
        }
      }
    }

    lookupPurchase();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, purchaseId, courseFromQuery]);

  const continueUrl = courseSlug
    ? `/payments/iiskills?course=${encodeURIComponent(courseSlug)}`
    : "/payments";

  return (
    <>
      <Head>
        <title>Complete Payment Authorization — iiskills.cloud</title>
        <meta
          name="description"
          content="Your payment authorization was not completed. Continue to the authorization page to finish your purchase."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {step === "loading" && (
            <>
              <div className="inline-block w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Loading your payment details…</p>
            </>
          )}

          {step === "no-id" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <span className="text-3xl">❓</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-3">No Purchase Found</h1>
              <p className="text-gray-600 mb-6 text-sm">
                No purchase ID was provided. Please return to the checkout page to start your
                payment.
              </p>
              <Link
                href="/payments"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-md"
              >
                Go to Payments →
              </Link>
            </>
          )}

          {step === "error" && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-3">Something Went Wrong</h1>
              <p className="text-gray-600 mb-6 text-sm">{errorMsg}</p>
              <Link
                href="/payments"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-md"
              >
                Return to Payments →
              </Link>
            </>
          )}

          {step === "ready" && (
            <>
              {/* Warning icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
                <svg
                  className="w-10 h-10 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">Authorization Not Completed</h1>
              <p className="text-gray-600 mb-5 text-sm">
                Your bank&apos;s authentication step (3D Secure / OTP) was not completed. Your
                payment has <strong>not</strong> been charged. Click the button below to return to
                the payment page and complete your authorization.
              </p>

              {/* Info box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-amber-800 text-sm font-medium mb-1">💡 What happened?</p>
                <ul className="text-amber-700 text-sm space-y-1 list-disc list-inside">
                  <li>Your bank requires additional authentication (3DS / OTP).</li>
                  <li>The authentication was not completed in time.</li>
                  <li>No money has been deducted from your account.</li>
                  <li>Click below to try again — your order is saved.</li>
                </ul>
              </div>

              {/* Primary CTA */}
              <a
                href={continueUrl}
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl text-center transition-all shadow-lg mb-4 text-lg"
              >
                Continue to Authorization Page →
              </a>

              <div className="space-y-2">
                <Link href="/profile" className="block text-sm text-blue-600 hover:underline">
                  View your profile &amp; orders
                </Link>
                <Link href="/" className="block text-sm text-gray-500 hover:text-gray-700">
                  Return to iiskills.cloud
                </Link>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                Purchase reference: {purchaseId}
                <br />
                If you keep seeing this error, please contact our support team.
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
