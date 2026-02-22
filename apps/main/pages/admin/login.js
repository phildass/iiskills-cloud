import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Admin Login Page — /admin/login
 *
 * Accepts the ADMIN_PANEL_SECRET passphrase and exchanges it for a signed
 * HttpOnly admin_session cookie via POST /api/admin/login.
 *
 * No Supabase user accounts, profiles, or roles are used.
 */
export default function AdminLogin() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      });

      if (res.ok) {
        const redirectTo =
          (typeof router.query.redirect === 'string' && router.query.redirect) ||
          '/admin';
        router.replace(redirectTo);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login — iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔐</div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
            <p className="text-sm text-gray-500 mt-1">Enter the admin passphrase to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="secret"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Passphrase
              </label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Enter admin passphrase"
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
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
