import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PAID_APPS = [
  { id: "learn-ai", label: "Learn AI", url: "https://learn-ai.iiskills.cloud" },
  {
    id: "learn-developer",
    label: "Learn Developer",
    url: "https://learn-developer.iiskills.cloud",
  },
  {
    id: "learn-management",
    label: "Learn Management",
    url: "https://learn-management.iiskills.cloud",
  },
  { id: "learn-pr", label: "Learn PR", url: "https://learn-pr.iiskills.cloud" },
];

/**
 * Payment Success Page
 *
 * Shown after a successful payment on aienter.in/payments/iiskills.
 * The user is already authenticated (they logged in before initiating payment),
 * so the entitlement is granted server-side via the ai-enter callback webhook.
 *
 * If the user has not completed post-payment registration (set password, etc.),
 * the primary CTA redirects them to /complete-registration.
 * Otherwise it redirects straight to the course app.
 *
 * Route: /payments/success
 * Query params:
 *   - course : app-id of the purchased course (e.g. "learn-management")
 */
export default function PaymentSuccess() {
  const router = useRouter();
  const { course } = router.query;

  const [registrationCompleted, setRegistrationCompleted] = useState(null); // null = loading

  const appConfig = PAID_APPS.find((a) => a.id === course);
  const appUrl = appConfig?.url || "https://iiskills.cloud/apps-dashboard";
  const appLabel = appConfig?.label || "your course";

  // Build the complete-registration URL
  const completeRegUrl = course
    ? `/complete-registration?course=${encodeURIComponent(course)}`
    : "/complete-registration";

  useEffect(() => {
    let mounted = true;

    async function checkRegistration() {
      try {
        const { supabase } = await import("../../lib/supabaseClient");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (mounted) setRegistrationCompleted(false);
          return;
        }

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) {
          // Not a paid user yet or no profile — show complete-registration CTA
          if (mounted) setRegistrationCompleted(false);
          return;
        }

        const data = await res.json();
        if (mounted) {
          setRegistrationCompleted(data.profile?.registration_completed === true);
        }
      } catch {
        if (mounted) setRegistrationCompleted(false);
      }
    }

    checkRegistration();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Payment Successful — iiskills.cloud</title>
        <meta
          name="description"
          content="Your payment was successful. Start learning on iiskills.cloud."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {/* Success icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">🎉 Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been received and paid access to{" "}
            <span className="font-semibold">{appLabel}</span> is being activated. This usually takes
            a few seconds.
          </p>

          {/* Access info */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-blue-800 text-sm font-medium mb-1">✅ What happens next?</p>
            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
              <li>Your account has been upgraded to paid access.</li>
              <li>A confirmation notification will be sent shortly.</li>
              {registrationCompleted === false && (
                <li>Complete your registration to set your password.</li>
              )}
              {registrationCompleted === true && <li>You can start learning immediately.</li>}
            </ul>
          </div>

          {/* Primary CTA: complete registration OR go to course */}
          {registrationCompleted === false && (
            <Link
              href={completeRegUrl}
              className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg mb-3"
            >
              Complete Registration →
            </Link>
          )}

          <a
            href={appUrl}
            className={`block w-full py-3 px-6 rounded-xl font-bold text-center transition-all shadow-lg mb-4 ${
              registrationCompleted === false
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {registrationCompleted === false ? "Skip to Course →" : "Start Learning Now →"}
          </a>

          <div className="space-y-2">
            <Link href="/profile" className="block text-sm text-blue-600 hover:underline">
              View your profile &amp; access
            </Link>
            <Link href="/" className="block text-sm text-gray-500 hover:text-gray-700">
              Return to iiskills.cloud
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            If you have any issues, go to your dashboard and raise a ticket. We will revert as soon
            as possible.
          </p>
        </div>
      </main>
    </>
  );
}
