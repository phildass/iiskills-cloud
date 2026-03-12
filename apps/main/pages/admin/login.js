/**
 * /admin/login — Admin password login page.
 *
 * Shows a passphrase form for password-based admin authentication.
 * Calls POST /api/admin/bootstrap-or-login which handles both
 * first-time setup (bootstrap passphrase) and regular login (bcrypt hash).
 *
 * On success redirects to /admin (or /admin/setup if needs_setup=true).
 *
 * No Supabase user accounts are involved in admin authentication.
 */

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirect = router.query.redirect || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/bootstrap-or-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
        credentials: "same-origin",
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        if (data.needs_setup) {
          router.replace("/admin/setup");
        } else {
          router.replace(redirect);
        }
        return;
      }

      setError(data.error || "Invalid passphrase");
    } catch {
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
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
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
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
                autoFocus
                autoComplete="current-password"
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
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Logging in…" : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
