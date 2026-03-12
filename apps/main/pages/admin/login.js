/**
 * /admin/login — Admin password login page.
 *
 * Shows a passphrase form for password-based admin authentication.
 * Calls POST /api/admin/bootstrap-or-login which handles both
 * first-time setup (bootstrap passphrase) and regular login (bcrypt hash).
 *
 * On first access without a stored passphrase hash, the well-known bootstrap
 * passphrase is accepted and the admin is immediately redirected to
 * /admin/setup to set a strong permanent password (min 8 characters).
 * The bootstrap passphrase MUST be replaced before the panel is used in
 * production.
 *
 * No Supabase user accounts are involved in admin authentication.
 */

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configured, setConfigured] = useState(null); // null = loading, true/false = resolved

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((data) => setConfigured(!!data.configured))
      .catch(() => setConfigured(true)); // assume configured on error
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/bootstrap-or-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
        credentials: "same-origin",
      });

      const data = await res.json();

      if (res.ok) {
        if (data.needs_setup) {
          router.replace("/admin/setup");
        } else {
          const redirect = router.query.redirect || "/admin";
          router.replace(redirect);
        }
      } else {
        setError(data.error || "Invalid passphrase");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login — iiskills</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              {configured === false
                ? "No password set yet — use the bootstrap passphrase to continue"
                : "Enter the admin passphrase"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="passphrase" className="block text-sm font-medium text-gray-700 mb-1">
                Passphrase
              </label>
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                required
                autoComplete="current-password"
                autoFocus
                placeholder="Enter passphrase"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !passphrase}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
