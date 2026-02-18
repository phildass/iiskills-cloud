"use client"; // This component uses React hooks and browser navigation - must run on client side

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signInWithEmail, sendMagicLink, signInWithGoogle } from "@lib/supabaseClient";
import { getCurrentApp, getAuthRedirectUrl } from "@lib/appRegistry";
import { recordLoginApp, getBestAuthRedirect, initSessionManager } from "@lib/sessionManager";

/**
 * Universal Login Component
 *
 * This component provides a standardized login form that can be used
 * across all iiskills.cloud apps and subdomains. It supports:
 * - Email/password authentication
 * - Magic link (passwordless) authentication
 * - Google OAuth authentication
 *
 * All login methods authenticate against the same Supabase user pool,
 * enabling universal access across all apps.
 *
 * Features:
 * - Multiple authentication methods
 * - Loading states and error handling
 * - Automatic redirect after successful login
 * - Works across all subdomains with shared session
 *
 * Usage:
 * <UniversalLogin
 *   redirectAfterLogin="/"
 *   appName="iiskills.cloud"
 *   showMagicLink={true}
 *   showGoogleAuth={true}
 * />
 */
export default function UniversalLogin({
  redirectAfterLogin = "/",
  appName = "iiskills.cloud",
  showMagicLink = true,
  showGoogleAuth = true,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(true);
  const router = useRouter();

  // Initialize session manager and record login app
  useEffect(() => {
    initSessionManager();
    const currentApp = getCurrentApp();
    if (currentApp) {
      recordLoginApp(currentApp.id);
    }
  }, []);

  // Show success message if coming from registration
  useEffect(() => {
    const registrationSuccess = sessionStorage.getItem("registrationSuccess");
    if (registrationSuccess) {
      setSuccess("Registration successful! You can now login with your credentials.");
      sessionStorage.removeItem("registrationSuccess");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (useMagicLink) {
        // Send magic link to user's email
        // Multi-App Redirect: Get the best redirect based on app registry and user preferences
        const bestRedirect = getBestAuthRedirect(router.query.redirect);
        const targetPath = bestRedirect?.path || redirectAfterLogin;
        const redirectUrl =
          typeof window !== "undefined"
            ? `${window.location.origin}${targetPath}`
            : undefined;

        const { success: magicLinkSuccess, error: magicLinkError } = await sendMagicLink(
          email,
          redirectUrl
        );

        if (magicLinkError) {
          setError(magicLinkError);
          setIsLoading(false);
          return;
        }

        if (magicLinkSuccess) {
          setSuccess(
            "Check your email for a secure login link! The link will log you in automatically."
          );
          setIsLoading(false);
          return;
        }
      } else {
        // Use password authentication
        const { user, error: signInError } = await signInWithEmail(email, password);

        if (signInError) {
          // Handle authentication errors with user-friendly messages
          if (signInError.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else if (signInError.includes("Email not confirmed")) {
            setError("Please confirm your email address before logging in.");
          } else {
            setError(signInError);
          }
          setIsLoading(false);
          return;
        }

        if (user) {
          // Authentication successful!
          setSuccess("Login successful! Redirecting...");

          // Multi-App Redirect: Get the best redirect based on app registry and user preferences
          const bestRedirect = getBestAuthRedirect(router.query.redirect);
          const redirectUrl = bestRedirect?.path || redirectAfterLogin;

          // Redirect after a brief delay to show success message
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Multi-App Redirect: Get the best redirect based on app registry and user preferences
      const bestRedirect = getBestAuthRedirect(router.query.redirect);
      const targetPath = bestRedirect?.path || redirectAfterLogin;
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}${targetPath}`
          : undefined;

      const { success: googleSuccess, error: googleError } = await signInWithGoogle(redirectUrl);

      if (googleError) {
        setError(googleError);
        setIsLoading(false);
      }
      // If successful, user will be redirected by OAuth flow
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Login to Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access all {appName} apps with one account
          </p>
        </div>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {showGoogleAuth && (
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or login with email</span>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {!useMagicLink && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required={!useMagicLink}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
          )}

          {showMagicLink && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                {useMagicLink ? "Use password instead" : "Use magic link instead"}
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? useMagicLink
                  ? "Sending Link..."
                  : "Logging In..."
                : useMagicLink
                  ? "Send Me a Login Link"
                  : "Login with Password"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register now
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>✓ Universal Login:</strong> Login once to access all iiskills.cloud apps.
              Your session works across the main site and all learning modules.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
