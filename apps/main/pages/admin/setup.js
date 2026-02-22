/**
 * Admin Setup Page — /admin/setup
 *
 * Forces the admin to set a new passphrase after a bootstrap login.
 * Also accessible by an already-authenticated admin who wants to change their passphrase.
 *
 * Calls POST /api/admin/set-passphrase on submit.
 * On success redirects to /admin.
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Verify the user has a valid session before showing the form
    fetch('/api/admin/status')
      .then((r) => r.json())
      .then((data) => {
        // If we have a session that's NOT needs_setup and IS configured,
        // the user is already fully set up — still allow them to change passphrase
        setIsLoading(false);
      })
      .catch(() => {
        // Cannot reach server; redirect to login
        router.replace('/admin/login');
      });
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassphrase) {
      setError('Passphrase is required');
      return;
    }
    if (newPassphrase.length < 8) {
      setError('Passphrase must be at least 8 characters');
      return;
    }
    if (newPassphrase !== confirmPassphrase) {
      setError('Passphrases do not match');
      return;
    }

    try {
      const res = await fetch('/api/admin/set-passphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassphrase }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSuccess(true);
        setTimeout(() => router.replace('/admin'), 2000);
      } else if (res.status === 401) {
        router.replace('/admin/login');
      } else {
        setError(data.error || 'Failed to set passphrase');
      }
    } catch {
      setError('Network error — please try again');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Setup Complete — iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Passphrase Set!</h1>
            <p className="text-gray-500 text-sm">Redirecting to admin dashboard…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Set Admin Passphrase — iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔑</div>
            <h1 className="text-2xl font-bold text-gray-800">Set Admin Passphrase</h1>
            <p className="text-sm text-gray-500 mt-1">
              Choose a strong passphrase (min. 8 characters)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassphrase"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Passphrase
              </label>
              <input
                id="newPassphrase"
                type="password"
                value={newPassphrase}
                onChange={(e) => setNewPassphrase(e.target.value)}
                required
                autoFocus
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassphrase"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Passphrase
              </label>
              <input
                id="confirmPassphrase"
                type="password"
                value={confirmPassphrase}
                onChange={(e) => setConfirmPassphrase(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Re-enter passphrase"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Passphrase
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
