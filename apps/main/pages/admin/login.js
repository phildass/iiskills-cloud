/**
 * /admin/login — password-based admin login page.
 *
 * On first access (no passphrase configured), shows a notice.
 * Once a passphrase is set (via the bootstrap flow), shows a passphrase form.
 *
 * Submits to POST /api/admin/bootstrap-or-login.
 * On success redirects to /admin (or /admin/setup if needs_setup=true).
 */

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirect = router.query.redirect || "/admin";

  useEffect(() => {
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((data) => {
        setConfigured(!!data.configured);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            {!configured && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                No passphrase is set yet. Use the default bootstrap passphrase to log in and then set
                a new one.
              </p>
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
