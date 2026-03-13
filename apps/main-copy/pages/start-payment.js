import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

/**
 * /start-payment — Payment Entry Gateway
 *
 * Every "Pay Now" button on iiskills.cloud and sub-apps links here.
 *
 * The page presents an explicit choice to the user on every purchase attempt,
 * preventing the payment gateway (Razorpay / PhonePe) from silently recognising
 * the device and skipping steps.  Every visit to this page results in a fresh
 * purchaseId being generated downstream (in /payments/iiskills), so old links
 * cannot be reused.
 *
 * Flow:
 *   "Yes, I'm a Registered User"
 *     → Checks for an active Supabase session.
 *       • If a session exists: proceeds directly to /payments/iiskills.
 *       • If no session:       redirects to /sign-in?next=/payments/iiskills.
 *     In either case /payments/iiskills always creates a NEW purchaseId and
 *     generates a fresh signed token before redirecting to aienter.in.
 *
 *   "No, I'm New Here"
 *     → Redirects to /register?next=/start-payment so that after registration
 *       the user is returned here to make their explicit choice again.
 *
 * Query params accepted:
 *   course — app-id of the course being purchased (e.g. "learn-management")
 *            forwarded to /payments/iiskills.
 *
 * Route: /start-payment
 */
export default function StartPayment() {
  const router = useRouter();
  const { course } = router.query;

  const [checking, setChecking] = useState(false);
  const [sessionEmail, setSessionEmail] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  // The downstream payment path — /payments/iiskills creates a fresh purchaseId
  // and signed token on every visit, so this URL is safe to follow repeatedly.
  const paymentPath = course
    ? `/payments/iiskills?course=${encodeURIComponent(course)}`
    : "/payments/iiskills";

  // Check for an existing Supabase session (informational only — used to show
  // the user's email so they can verify they are on the right account).
  useEffect(() => {
    if (!router.isReady) return;

    async function checkSession() {
      try {
        const { supabase } = await import("../lib/supabaseClient");
        const { data } = await supabase.auth.getSession();
        const s = data?.session;
        if (s?.user?.email) {
          setSessionEmail(s.user.email);
        }
      } catch {
        // Supabase unavailable — treat as no session
      }
      setSessionChecked(true);
    }

    checkSession();
  }, [router.isReady]);

  /**
   * "Yes, I'm a Registered User" handler.
   *
   * /payments/iiskills will:
   *   1. Verify the Supabase session (redirect to /sign-in if absent).
   *   2. Create a brand-new purchaseId for this attempt.
   *   3. Generate a fresh signed JWT.
   *   4. Redirect to aienter.in.
   */
  async function handleRegisteredUser() {
    setChecking(true);

    console.log(
      `[start-payment] Registered user entry. course=${course || "none"}. ` +
        "Proceeding to /payments/iiskills (fresh purchaseId will be created)."
    );

    // Check session: if no active session send user to /sign-in so they
    // authenticate explicitly rather than arriving at the payment page as a
    // "ghost" session from a prior login.
    let hasSession = false;
    try {
      const { supabase } = await import("../lib/supabaseClient");
      const { data } = await supabase.auth.getSession();
      hasSession = Boolean(data?.session);
    } catch {
      // Treat Supabase errors as no session — /payments/iiskills will handle
      // the redirect to /sign-in gracefully.
      hasSession = false;
    }

    if (hasSession) {
      // Session exists — go directly to /payments/iiskills which will create
      // a fresh purchaseId for this attempt.
      console.log(
        `[start-payment] Active session found (${sessionEmail || "unknown"}). ` +
          `Redirecting to ${paymentPath}`
      );
      router.push(paymentPath);
    } else {
      // No session — send to /sign-in; after login the user is returned to
      // /payments/iiskills (not back to /start-payment) to complete payment.
      const signInNext = encodeURIComponent(paymentPath);
      console.log(`[start-payment] No active session. Redirecting to /sign-in?next=${paymentPath}`);
      router.push(`/sign-in?next=${signInNext}`);
    }
  }

  /**
   * "No, I'm New Here" handler.
   *
   * Sends the user to /register.  After successful registration the user is
   * returned to /start-payment so they can make the explicit "registered" choice.
   */
  function handleNewUser() {
    console.log(
      `[start-payment] New user entry. course=${course || "none"}. Redirecting to /register.`
    );

    // Return here after registration so the user can click "Yes, I'm Registered"
    // and get a fresh purchaseId.
    const returnPath = course
      ? `/start-payment?course=${encodeURIComponent(course)}`
      : "/start-payment";

    router.push(`/register?next=${encodeURIComponent(returnPath)}`);
  }

  return (
    <>
      <Head>
        <title>Start Payment — iiskills.cloud</title>
        <meta
          name="description"
          content="Begin your enrollment — choose whether you are a registered user or new to iiskills.cloud"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
          {/* Logo / brand */}
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              iiskills.cloud
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Start Your Enrollment</h1>
            {course && (
              <p className="text-sm text-gray-500 mt-1">
                Course:{" "}
                <span className="font-medium text-indigo-700">
                  {course.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </p>
            )}
          </div>

          {/* Session notice — shown only when a session is already active */}
          {sessionChecked && sessionEmail && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6 text-sm text-blue-800">
              <strong>Currently signed in as:</strong> {sessionEmail}
              <br />
              <span className="text-blue-600">
                Click &quot;Yes&quot; below to proceed with this account, or sign out and register a
                new account to use a different identity.
              </span>
            </div>
          )}

          {/* Main question */}
          <div className="text-center mb-8">
            <p className="text-lg font-semibold text-gray-800 mb-1">Are you a Registered User?</p>
            <p className="text-sm text-gray-500">
              This helps us verify your account before processing payment.
            </p>
          </div>

          {/* Choice buttons */}
          <div className="space-y-4">
            {/* YES — Registered user */}
            <button
              onClick={handleRegisteredUser}
              disabled={checking || !sessionChecked}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-xl text-base transition-colors shadow-sm"
            >
              {checking ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Checking…
                </span>
              ) : (
                "✅ Yes, I'm a Registered User"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-gray-300">
              <hr className="flex-1 border-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {/* NO — New user */}
            <button
              onClick={handleNewUser}
              disabled={checking}
              className="w-full bg-white border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 font-semibold py-3.5 rounded-xl text-base transition-colors"
            >
              🆕 No, I&apos;m New Here
            </button>
          </div>

          {/* Security note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            🔒 Every payment attempt creates a fresh, unique session.
            <br />
            Secure payment via Razorpay · AI Cloud Enterprises
          </p>
        </div>
      </div>
    </>
  );
}
