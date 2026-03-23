/**
 * /payments/iiskills — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment / paywall system has been intentionally DISABLED.
 * All courses are currently free to access.
 *
 * This page previously handled the Razorpay / aienter.in payment redirect flow.
 * It is preserved as a reintroduction marker.
 *
 * When payments are re-introduced, DO NOT simply restore the original code.
 * The entire payment flow must be rebuilt from scratch, security-audited,
 * and approved before going live.
 *
 * See git history for the full original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PaymentsIiskillsStub() {
  const router = useRouter();
  const { course } = router.query;

  return (
    <>
      <Head>
        <title>Payments Unavailable — iiskills.cloud</title>
        <meta name="description" content="Course payments are temporarily unavailable." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            iiskills.cloud
          </div>
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Courses Are Free Right Now!</h1>
          <p className="text-gray-600 mb-6">
            Payment features are temporarily unavailable. All courses are currently free to access —
            no enrollment required.
          </p>
          {course ? (
            <Link
              href={`https://${course}.iiskills.cloud/curriculum`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Go to {course.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} →
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Go to Dashboard →
            </Link>
          )}
          <p className="text-xs text-gray-400 mt-8">
            Payment features will return in a future update.
          </p>
        </div>
      </div>
    </>
  );
}

// ── PAYMENT_STUB: original implementation preserved below for reference ────────
// DO NOT uncomment or restore without a full security review and fresh re-implementation.
//
// The original /payments/iiskills page handled:
//  - Supabase session authentication
//  - Admin bypass detection
//  - Pre-payment profile collection (name, phone)
//  - POST to /api/payments/generate-token for a signed JWT
//  - Redirect to aienter.in/payments/iiskills with the token
//
// See git history for the full original implementation.
// ─────────────────────────────────────────────────────────────────────────────
