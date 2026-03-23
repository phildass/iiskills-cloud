/**
 * /start-payment — PAYMENT_STUB
 *
 * ── PAYMENT_STUB ─────────────────────────────────────────────────────────────
 * The payment / paywall system has been intentionally DISABLED.
 * All courses are currently free to access.
 *
 * This page previously served as the payment entry gateway.
 * It is preserved as a reintroduction marker.
 *
 * When payments are re-introduced, DO NOT simply restore the original code
 * below.  The entire payment flow (gateway integration, purchase creation,
 * entitlement granting, security) must be rebuilt from scratch, audited, and
 * approved before going live.
 *
 * Original page logic is preserved in git history and in the original file
 * for reference only.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function StartPaymentStub() {
  const router = useRouter();
  const { course } = router.query;

  const courseLinks = [
    { id: "learn-ai", label: "Learn AI", href: "https://learn-ai.iiskills.cloud/curriculum" },
    {
      id: "learn-developer",
      label: "Learn Developer",
      href: "https://learn-developer.iiskills.cloud/curriculum",
    },
    {
      id: "learn-management",
      label: "Learn Management",
      href: "https://learn-management.iiskills.cloud/curriculum",
    },
    { id: "learn-pr", label: "Learn PR", href: "https://learn-pr.iiskills.cloud/curriculum" },
  ];

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
            no enrollment required. Jump straight in!
          </p>

          {course ? (
            <Link
              href={`https://${course}.iiskills.cloud/curriculum`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Go to {course.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} →
            </Link>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-500 mb-4">Choose a course to start:</p>
              {courseLinks.map((c) => (
                <Link
                  key={c.id}
                  href={c.href}
                  className="block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  {c.label} →
                </Link>
              ))}
            </div>
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
// The original /start-payment page:
//  - Presented an explicit "Registered / New" choice on every purchase attempt
//  - Detected admin sessions and bypassed payment for admins
//  - Created fresh purchaseId and JWT on every visit via /payments/iiskills
//
// See git history for the full original implementation.
// ─────────────────────────────────────────────────────────────────────────────
