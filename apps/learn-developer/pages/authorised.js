/**
 * /authorised — Post-payment landing page
 *
 * aienter.in redirects here after a successful payment.
 * Shows a brief confirmation and forwards the user to /complete-registration
 * to finalise onboarding (set password, fill profile, etc.).
 *
 * This page is intentionally simple — all registration logic lives in
 * /complete-registration which redirects to iiskills.cloud/complete-registration.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Authorised() {
  const router = useRouter();

  useEffect(() => {
    // Brief delay so the success message is visible before redirecting.
    const timer = setTimeout(() => {
      router.replace('/complete-registration?course=learn-developer');
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Payment Successful — Learn Developer</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <div className="inline-block w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-700 font-medium">Payment confirmed! Setting up your access…</p>
        </div>
      </div>
    </>
  );
}
