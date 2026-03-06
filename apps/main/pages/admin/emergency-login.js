/**
 * /admin/emergency-login
 *
 * Emergency admin login using the ADMIN_PANEL_SECRET passphrase.
 * Sets the admin_session cookie and redirects to /admin.
 *
 * Use this when:
 * - You are a superadmin but haven't set profiles.is_admin = true
 * - You need admin access without a Supabase account
 */

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function EmergencyLogin() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
        credentials: "same-origin",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const redirect = router.query.redirect || "/admin";
        router.replace(redirect);
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
        <title>Emergency Admin Login — iiskills</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-xl font-bold text-gray-800">Emergency Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">Enter the server-side admin passphrase</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="secret" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Passphrase
              </label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter ADMIN_PANEL_SECRET"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !secret}
              className="w-full bg-yellow-600 text-white font-semibold py-2 rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition"
            >
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            For Supabase-authenticated admins, use{" "}
            <a href="/login?redirect=/admin" className="underline hover:text-gray-600">
              regular login
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
