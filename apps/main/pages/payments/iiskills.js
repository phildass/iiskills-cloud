import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getPaymentReturnToUrl } from "@lib/appRegistry";

import { isValidIndianPhone } from "@lib/phoneValidation";



const AIENTER_PAYMENT_URL = "https://aienter.in/payments/iiskills";

/**
 * /payments/iiskills — Redirect to centralized payment portal (Option A)
 *
 * Flow:
 * 1. User must be authenticated on iiskills.cloud (Supabase session).
 *    If not, they are redirected to /sign-in with a ?next= param so they
 *    return here after login.
 * 2. User's profile is checked for minimum required details (first_name + phone).
 *    If incomplete, an inline form is shown to collect them before proceeding.
 * 3. A short-lived signed JWT is generated via POST /api/payments/generate-token.
 *    The token carries the user's identity (user_id, name, phone, email),
 *    the chosen course slug, and the returnTo URL.
 * 4. The user is redirected to aienter.in with the token embedded, so aienter
 *    can return it in the server-to-server callback and iiskills can grant
 *    entitlement without relying on an OTP.
 *
 * Query params accepted:
 *   - course : app-id of the course being purchased (e.g. "learn-management")
 *
 * Route: /payments/iiskills
 */
export default function IiskillsCheckout() {
  const router = useRouter();
  const { course } = router.query;


  /**
   * step:
   *   'loading'      — initial auth + profile check in progress
   *   'registration' — profile incomplete, show inline form
   *   'paying'       — profile complete, token being generated / redirect pending
   *   'error'        — unrecoverable error
   */
  const [step, setStep] = useState("loading");
  const [error, setError] = useState("");

  // Pre-payment registration form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Store the current session so the form submit can reuse it
  const [session, setSession] = useState(null);

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
      let currentSession = null;
      const MAX_SESSION_ATTEMPTS = 3;
      const SESSION_RETRY_DELAY_MS = 400;

      for (let attempt = 1; attempt <= MAX_SESSION_ATTEMPTS; attempt++) {
        try {
          const { supabase } = await import("../../lib/supabaseClient");
          const { data } = await supabase.auth.getSession();
          currentSession = data?.session ?? null;
        } catch {
          // Supabase unavailable — treat as unauthenticated after retries
        }

        if (currentSession) break;

        if (attempt < MAX_SESSION_ATTEMPTS) {
          // Wait before retrying to give the client time to establish the session
          await new Promise((resolve) => setTimeout(resolve, SESSION_RETRY_DELAY_MS));
        }
      }

      if (cancelled) return;

      if (!currentSession) {
        // Redirect to sign-in; after login the user returns to this page
        const next = encodeURIComponent(`/payments/iiskills${course ? `?course=${course}` : ""}`);
        router.replace(`/sign-in?next=${next}`);
        return;
      }

      setSession(currentSession);

      // ── 2. Check profile completeness ─────────────────────────────────────
      let profileComplete = false;
      try {

        const { supabase } = await import("../../lib/supabaseClient");
        const { data: profileData } = await supabase
          .from("profiles")
          .select("first_name, last_name, phone")
          .eq("id", currentSession.user.id)
          .single();

        profileComplete = Boolean(profileData?.first_name && profileData?.phone);

        // Pre-fill the form with any existing values to reduce re-entry
        if (profileData?.first_name) setFirstName(profileData.first_name);
        if (profileData?.last_name) setLastName(profileData.last_name);
        if (profileData?.phone) {
          // Display the stored phone stripped of +91 prefix for the 10-digit input
          const stored = profileData.phone;
          const local = stored.startsWith("+91") && stored.length === 13 ? stored.slice(3) : stored;
          setPhone(local);

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
      } catch {
        // If we can't fetch the profile, require registration to be safe
        profileComplete = false;
      }

      if (cancelled) return;

      if (!profileComplete) {
        setStep("registration");
        return;
      }

      // ── 3. Profile complete → proceed to payment ──────────────────────────
      await proceedToPayment(currentSession);
    }

    initPayment();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, course]);

  /**
   * Generate the payment token and redirect to aienter.in.
   * @param {object} currentSession — Supabase session object
   */
  async function proceedToPayment(currentSession) {
    setStep("paying");
    let token = null;
    try {
      const resp = await fetch("/api/payments/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession.access_token}`,
        },
        body: JSON.stringify({ courseSlug: course || "iiskills" }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.token) {
        // If the server reports that the profile is incomplete, send the user
        // back to the registration form rather than showing a dead-end error.
        if (data.code === "profile_incomplete") {
          setStep("registration");
          setFormError("Please complete your details before proceeding to payment.");
          return;
        }
        throw new Error(data.error || "Token generation failed");
      }
      token = data.token;
    } catch (err) {
      setStep("error");
      setError(err.message || "Could not prepare payment. Please try again.");
      return;
    }

    // ── Redirect to aienter with token ──────────────────────────────────────
    const returnTo = getPaymentReturnToUrl(course);
    const params = new URLSearchParams({
      ...(course && { course }),
      token,
      returnTo,
    });

    window.location.href = `${AIENTER_PAYMENT_URL}?${params.toString()}`;
  }

  /**
   * Handle pre-payment registration form submission.
   */
  async function handleRegistrationSubmit(e) {
    e.preventDefault();
    setFormError("");

    // Client-side validation
    if (!firstName.trim()) {
      setFormError("First name is required.");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setFormError("Please enter a valid 10-digit Indian mobile number (starting with 6–9).");
      return;
    }

    if (!session) {
      setFormError("Session expired. Please refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const resp = await fetch("/api/payments/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim() || undefined,
          phone: phone.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Could not save your details. Please try again.");
      }
    } catch (err) {
      setFormError(err.message || "Could not save your details. Please try again.");
      setSubmitting(false);
      return;
    }

    // Profile saved — proceed to payment
    setSubmitting(false);
    await proceedToPayment(session);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (step === "registration") {
    return (
      <>
        <Head>
          <title>Complete Your Details — iiskills.cloud</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h1>
            <p className="text-gray-600 mb-6 text-sm">
              Please provide your name and phone number so we can associate your payment with your
              account.
            </p>

            <form onSubmit={handleRegistrationSubmit} className="space-y-4" noValidate>
              {/* First name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Priya"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="given-name"
                />
              </div>

              {/* Last name (optional) */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Sharma"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="family-name"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm select-none">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    autoComplete="tel-national"
                    inputMode="numeric"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  10-digit Indian mobile number starting with 6–9.
                </p>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{formError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                {submitting ? "Saving…" : "Continue to Payment →"}
              </button>
            </form>

            <p className="text-xs text-gray-400 mt-4 text-center">
              Your details are saved securely and used only to confirm your enrollment.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Redirecting to Payment — iiskills.cloud</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          {step === "error" ? (
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
