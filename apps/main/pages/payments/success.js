/**
 * /payments/success — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment / paywall system has been intentionally DISABLED.
 * This page previously shown after a successful Razorpay payment.
 *
 * When payments are re-introduced, this page must be rebuilt from scratch.
 * See git history for the original implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import Head from "next/head";
import Link from "next/link";

export default function PaymentSuccessStub() {
  return (
    <>
      <Head>
        <title>Payments Unavailable — iiskills.cloud</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-xl font-bold text-gray-900 mb-3">Courses Are Free Right Now!</h1>
          <p className="text-gray-600 mb-6">
            Payment features are temporarily unavailable. All courses are currently free to access.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    </>
  );
}
