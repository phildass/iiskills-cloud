/**
 * Complete Registration — redirect to main app
 *
 * This page redirects users to the complete-registration flow hosted on
 * iiskills.cloud. It preserves any query parameters (e.g. course=learn-pr).
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'https://iiskills.cloud';

export default function CompleteRegistrationRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const params = new URLSearchParams(router.query);
    // Ensure the course param is set to this app's ID
    if (!params.get('course')) {
      params.set('course', 'learn-pr');
    }
    window.location.href = `${MAIN_APP_URL}/complete-registration?${params.toString()}`;
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 text-sm">Redirecting to complete registration…</p>
      </div>
    </div>
  );
}
