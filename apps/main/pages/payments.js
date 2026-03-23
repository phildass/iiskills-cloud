/**
 * /payments — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment system has been intentionally DISABLED.
 * All courses are currently free to access.
 *
 * This page previously redirected to /payments/iiskills for course enrollment.
 * When payments are re-introduced, this page must be rebuilt from scratch.
 * See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import Head from "next/head";
import Link from "next/link";

export default function PaymentsStub() {
  return (
    <>
      <Head>
        <title>Courses Are Free — iiskills.cloud</title>
        <meta name="description" content="All courses are currently free at iiskills.cloud." />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Courses Are Free Right Now!</h1>
          <p className="text-gray-600 mb-6">
            Payment features are temporarily unavailable. All courses are currently free to access
            — no enrollment or payment required.
          </p>
          <Link
            href="/courses"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Free Courses →
          </Link>
        </div>
      </div>
    </>
  );
}
