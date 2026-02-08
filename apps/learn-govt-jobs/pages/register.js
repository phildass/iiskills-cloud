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

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../components/Footer';

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to payment page after a brief message
    const timer = setTimeout(() => {
      window.location.href = process.env.NEXT_PUBLIC_PAYMENT_RETURN_URL || 'https://aienter.in/payments';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Register - Learn AI</title>
        <meta name="description" content="Register for Learn AI course" />
      </Head>

      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-3xl font-bold mb-4">Complete Your Registration</h1>
              <p className="text-lg text-gray-700 mb-6">
                You're one step away from starting your AI learning journey!
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                Special Offer: Only Rs 99
              </h2>
              <p className="text-gray-700">
                Get full access to all 100 lessons, case studies, and certification exam with a free trial period.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant access to all course materials</span>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Self-paced learning - complete in 3 months or faster</span>
              </div>
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Certificate upon successful completion</span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-gray-600">
                Redirecting to payment page...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
*/
