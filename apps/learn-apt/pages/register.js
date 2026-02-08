// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This registration page has been disabled. Authentication is no longer required.
// All content is now publicly accessible without registration.
// ============================================================================

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Register Page - DISABLED
 *
 * This page previously provided user registration.
 * Registration is no longer required - all content is publicly accessible.
 * Users visiting this page will be redirected to the homepage.
 */
export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage since registration is no longer needed
    router.push("/");
  }, [router]);

  return (
    <>
      <Head>
        <title>Registration Disabled - iiskills.cloud</title>
        <meta
          name="description"
          content="Registration is no longer required. All content is publicly accessible."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Registration No Longer Required</h1>
          <p className="text-gray-600 mb-4">All content is now publicly accessible.</p>
          <p className="text-gray-600">Redirecting to homepage...</p>
        </div>
      </div>
    </>
  );
}

/*
// ORIGINAL REGISTRATION PAGE - DISABLED
"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Check if email confirmation is required
        if (data?.user?.identities?.length === 0) {
          setError("This email is already registered. Please login instead.");
        } else {
          router.push("/login?registered=true");
        }
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
        <title>Sign Up - Learn Apt</title>
        <meta name="description" content="Create your free Learn Apt account" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Start your free aptitude testing journey</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Login
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
