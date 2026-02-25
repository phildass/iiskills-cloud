import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

const PAID_APPS = [
  { id: 'learn-ai', label: 'Learn AI', url: 'https://learn-ai.iiskills.cloud' },
  { id: 'learn-developer', label: 'Learn Developer', url: 'https://learn-developer.iiskills.cloud' },
  { id: 'learn-management', label: 'Learn Management', url: 'https://learn-management.iiskills.cloud' },
  { id: 'learn-pr', label: 'Learn PR', url: 'https://learn-pr.iiskills.cloud' },
];

/**
 * OTP Gateway Page
 *
 * After paying at aienter.in/payments/iiskills the user receives a 6-digit OTP
 * via SMS (and email if available).  They come here, enter their email + OTP,
 * and are instantly upgraded to a PAID Learner.
 *
 * Route: /otp-gateway
 */
export default function OtpGateway() {
  const [form, setForm] = useState({ email: '', otp: '', appId: 'learn-ai' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          otp: form.otp.trim(),
          appId: form.appId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'OTP verification failed. Please try again.');
        return;
      }

      setSuccess({
        appId: data.appId,
        email: data.email,
        entitlementGranted: data.entitlementGranted,
      });
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const appUrl =
    success &&
    (PAID_APPS.find((a) => a.id === success.appId)?.url || 'https://iiskills.cloud');

  return (
    <>
      <Head>
        <title>Activate Paid Access — iiskills.cloud</title>
        <meta
          name="description"
          content="Enter your payment OTP to instantly unlock paid course access on iiskills.cloud"
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Activate Paid Access</h1>
            <p className="text-gray-600 text-sm">
              Enter the 6-digit OTP sent to your phone (and email) after payment to unlock your course.
            </p>
          </div>

          {success ? (
            /* ── Success state ─────────────────────────────────────────── */
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 You are now a PAID Learner!
              </h2>
              <p className="text-gray-600 mb-2">
                Your OTP has been verified and paid access is{' '}
                {success.entitlementGranted ? 'active' : 'being activated'} for your account.
              </p>
              {!success.entitlementGranted && (
                <p className="text-amber-600 text-sm mb-4">
                  ⚠️ Could not auto-link your account. If you are not registered, please{' '}
                  <Link href="/register" className="underline font-medium">
                    create an account
                  </Link>{' '}
                  with the same email address used during payment, then contact support.
                </p>
              )}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-blue-800 font-medium text-sm">
                  You now have access to{' '}
                  <span className="font-bold">
                    {PAID_APPS.find((a) => a.id === success.appId)?.label || success.appId}
                  </span>
                </p>
              </div>
              <a
                href={appUrl}
                className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Start Learning Now →
              </a>
              <Link href="/" className="block mt-4 text-sm text-gray-500 hover:text-gray-700">
                Return to iiskills.cloud
              </Link>
            </div>
          ) : (
            /* ── OTP form ──────────────────────────────────────────────── */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="The email you used during payment"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* OTP */}
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="Enter your OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <p className="text-xs text-gray-500 mt-1">OTPs are valid for 10 minutes</p>
              </div>

              {/* App selector */}
              <div>
                <label htmlFor="appId" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="appId"
                  name="appId"
                  value={form.appId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  {PAID_APPS.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying…' : 'Verify OTP & Activate Access'}
              </button>

              <div className="text-center space-y-2 pt-2">
                <p className="text-xs text-gray-500">
                  Did not receive your OTP?{' '}
                  <a
                    href="mailto:support@iiskills.cloud"
                    className="text-blue-600 underline"
                  >
                    Contact support
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  Want to enrol?{' '}
                  <a
                    href="https://aienter.in/payments/iiskills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Pay now at aienter.in
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
