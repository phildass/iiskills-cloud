import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PAID_APPS = [
  { id: "learn-ai", label: "Learn AI", url: "https://learn-ai.iiskills.cloud" },
  {
    id: "learn-developer",
    label: "Learn Developer",
    url: "https://learn-developer.iiskills.cloud",
  },
  {
    id: "learn-management",
    label: "Learn Management",
    url: "https://learn-management.iiskills.cloud",
  },
  { id: "learn-pr", label: "Learn PR", url: "https://learn-pr.iiskills.cloud" },
];

/**
 * Password strength evaluator.
 * Returns { score: 0-4, label: string, color: string }
 */
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "bg-gray-200" };
  let score = 0;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map = [
    { label: "Very Weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Strong", color: "bg-blue-500" },
    { label: "Very Strong", color: "bg-green-500" },
  ];
  return { score, ...map[score] };
}

/**
 * Validate password and return list of failed rule messages.
 */
function getPasswordErrors(password) {
  const errors = [];
  if (!password) return errors;
  if (password.length < 10) errors.push("At least 10 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character (e.g. @, #, $, !)");
  return errors;
}

/**
 * Complete Registration Page — /complete-registration
 *
 * Shown after a user pays on aienter.in and is redirected back to iiskills.
 * The user sets their password to complete onboarding.
 *
 * Query params:
 *   - course: app-id of the purchased course (e.g. "learn-management")
 *
 * Access control:
 *   - Must be authenticated. If not, redirected to /sign-in?next=...
 *   - If already completed, redirected to /apps-dashboard.
 */
export default function CompleteRegistration() {
  const router = useRouter();
  const { course } = router.query;

  const [status, setStatus] = useState("loading"); // loading | ready | done
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const appConfig = PAID_APPS.find((a) => a.id === course);
  const appUrl = appConfig?.url || "/apps-dashboard";
  const appLabel = appConfig?.label || "your course";

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { getCurrentUser, supabase } = await import("../lib/supabaseClient");
        const currentUser = await getCurrentUser();

        if (!mounted) return;

        if (!currentUser) {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          router.replace(`/sign-in?next=${next}`);
          return;
        }

        setUser(currentUser);
        setEmail(currentUser.email || "");

        // Fetch profile to check registration status
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          router.replace(`/sign-in?next=${next}`);
          return;
        }

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;

          if (data.profile?.registration_completed) {
            // Already done — go to dashboard or course
            router.replace(appUrl);
            return;
          }

          setProfile(data.profile);
        }
        // If profile 404/403 (not paid yet), still show the form — the user
        // may have just been granted entitlement and the profile flag may not
        // have synced yet. We allow them to proceed.

        if (mounted) setStatus("ready");
      } catch (err) {
        console.error("[complete-registration] load error:", err);
        if (mounted) setStatus("ready"); // degrade gracefully
      }
    }

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const pwErrors = getPasswordErrors(password);
    if (pwErrors.length > 0) {
      setError(`Password requirements not met: ${pwErrors.join(", ")}.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const { supabase } = await import("../lib/supabaseClient");
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Session expired. Please sign in again.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      setUsername(data.username || "");
      setStatus("done");
    } catch (err) {
      console.error("[complete-registration] submit error:", err);
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const strength = getPasswordStrength(password);
  const pwErrors = getPasswordErrors(password);

  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    email;

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>Complete Registration — iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600 text-sm">Loading your profile…</p>
          </div>
        </div>
      </>
    );
  }

  if (status === "done") {
    return (
      <>
        <Head>
          <title>Registration Complete — iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">🎉 Registration Complete!</h1>

            {username && (
              <p className="text-gray-600 mb-2">
                Your username: <span className="font-bold text-blue-700">@{username}</span>
              </p>
            )}

            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md mb-4">
              ⭐ Paid User
            </span>

            <p className="text-gray-600 mb-6 text-sm">
              Welcome to <span className="font-semibold">{appLabel}</span>! Your account is now
              fully set up. Start learning right away.
            </p>

            <a
              href={appUrl}
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg mb-4"
            >
              Start Learning Now →
            </a>

            <div className="space-y-2">
              <Link href="/profile" className="block text-sm text-blue-600 hover:underline">
                View your profile
              </Link>
              <Link
                href="/apps-dashboard"
                className="block text-sm text-gray-500 hover:text-gray-700"
              >
                My Apps Dashboard
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Complete Registration — iiskills.cloud</title>
        <meta
          name="description"
          content="Complete your iiskills.cloud registration by setting a password."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">✅ Payment Successful</h1>
            <p className="text-gray-600 text-sm">
              Complete your registration by setting a password to access{" "}
              <span className="font-semibold">{appLabel}</span>.
            </p>
          </div>

          {/* Profile info card */}
          {(displayName || email) && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                Your Account
              </p>
              {displayName && displayName !== email && (
                <p className="text-gray-800 font-medium">{displayName}</p>
              )}
              {email && <p className="text-gray-600 text-sm">{email}</p>}
              {profile?.is_paid_user && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full mt-2">
                  ⭐ Paid User
                </span>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Set Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          i < strength.score ? strength.color : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Strength:{" "}
                    <span
                      className={`font-semibold ${strength.score >= 3 ? "text-green-600" : "text-orange-500"}`}
                    >
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}

              {/* Password requirements */}
              {password && pwErrors.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {pwErrors.map((err) => (
                    <li key={err} className="text-xs text-red-600 flex items-center gap-1">
                      <span>✗</span> {err}
                    </li>
                  ))}
                </ul>
              )}
              {password && pwErrors.length === 0 && (
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <span>✓</span> All requirements met
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 pr-12 ${
                    confirmPassword && confirmPassword !== password
                      ? "border-red-400 focus:border-red-400 focus:ring-red-300"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="mt-1 text-xs text-red-600">✗ Passwords do not match</p>
              )}
              {confirmPassword && confirmPassword === password && password && (
                <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                submitting || pwErrors.length > 0 || !password || password !== confirmPassword
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Setting up your account…
                </span>
              ) : (
                "Set Password & Continue →"
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            If you have any issues, go to your dashboard and raise a ticket. We will revert as soon
            as possible.
          </p>
        </div>
      </main>
    </>
  );
}
