import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * /admin/login always redirects to /admin — authentication is disabled.
 */
export async function getServerSideProps() {
  return { redirect: { destination: '/admin', permanent: false } };
}

/**
 * Admin Login Page — /admin/login
 *
 * Accepts the admin passphrase and exchanges it for a signed HttpOnly
 * admin_session cookie via POST /api/admin/bootstrap-or-login.
 *
 * TEST_ADMIN_MODE=true:
 * - Shows a friendly banner with the default test passphrase hint.
 * - Never redirects to /admin/setup.
 *
 * Production:
 * - If no passphrase has been set yet, accepts the bootstrap passphrase
 *   `iiskills123` and redirects to /admin/setup to force a real passphrase.
 * - Otherwise performs a normal login and redirects to /admin.
 *
 * No Supabase user accounts, profiles, or roles are used.
 */
export default function AdminLogin() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBootstrap, setIsBootstrap] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/admin/status')
      .then((r) => r.json())
      .then((data) => {
        setIsBootstrap(!data.configured);
        setTestMode(!!data.testMode);
        setStatusLoaded(true);
      })
      .catch(() => setStatusLoaded(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/bootstrap-or-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        if (data.needs_setup) {
          router.replace('/admin/setup');
        } else {
          const redirectTo =
            (typeof router.query.redirect === 'string' && router.query.redirect) ||
            '/admin';
          router.replace(redirectTo);
        }
      } else {
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
            {statusLoaded && testMode ? (
              <p className="text-sm text-amber-600 mt-2 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                Testing mode — default passphrase is <code className="font-mono">iiskills123</code>
                {' '}(set <code className="font-mono">ADMIN_PANEL_SECRET</code> to override).
              </p>
            ) : statusLoaded && isBootstrap ? (
              <p className="text-sm text-amber-600 mt-2 font-medium">
                First-time setup: enter bootstrap passphrase
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-1">Enter the admin passphrase to continue</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passphrase"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Passphrase
              </label>
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
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
