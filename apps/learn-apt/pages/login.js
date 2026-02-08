// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This login page has been disabled. Authentication is no longer required.
// All content is now publicly accessible without login.
// ============================================================================

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Login Page - DISABLED
 *
 * This page previously provided user authentication.
 * Login is no longer required - all content is publicly accessible.
 * Users visiting this page will be redirected to the homepage.
 */
export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage since login is no longer needed
    router.push("/");
  }, [router]);

  return (
    <>
      <Head>
        <title>Login Disabled - Learn Apt</title>
        <meta
          name="description"
          content="Login is no longer required. All content is publicly accessible."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Login No Longer Required</h1>
          <p className="text-gray-600 mb-4">All content is now publicly accessible.</p>
          <p className="text-gray-600">Redirecting to homepage...</p>
        </div>
      </div>
    </>
  );
}

/*
// ORIGINAL LOGIN PAGE - DISABLED
"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/tests");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Learn Apt</title>
        <meta name="description" content="Login to your Learn Apt account" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to continue your aptitude journey</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Sign up free
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
*/
