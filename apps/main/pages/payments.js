import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * /payments — Central Payment Gateway Entry Point
 *
 * Behaviour:
 * - If a `course` query parameter is present, immediately redirect to
 *   /payments/iiskills preserving all query parameters.
 * - Otherwise render a generic landing screen that directs the user to choose
 *   a course first.
 *
 * Route: /payments
 */
export default function Payments() {
  const router = useRouter();
  const { course } = router.query;

  useEffect(() => {
    // Only act once the router is ready (query params are populated)
    if (!router.isReady) return;

    const { course: courseParam, ...otherParams } = router.query;
    if (courseParam) {
      // Forward all query params to the IIS Skills checkout page
      router.replace({ pathname: '/payments/iiskills', query: { course: courseParam, ...otherParams } });
    }
  }, [router.isReady]); // router.isReady changes once; query is read inside the effect

  // While the redirect is in-flight (or if there is no course param) show a
  // lightweight landing screen so the user is never left on a blank page.
  return (
    <>
      <Head>
        <title>Payment Gateway — iiskills.cloud</title>
        <meta name="description" content="Enroll in an iiskills.cloud course" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            iiskills.cloud Payment Gateway
          </h1>
          {course ? (
            <p className="text-gray-600">Redirecting to checkout…</p>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Please select a course before proceeding to payment.
              </p>
              <a
                href="/courses"
                className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
