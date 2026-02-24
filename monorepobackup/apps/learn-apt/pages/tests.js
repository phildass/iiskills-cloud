"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/supabaseClient";

export default function Tests() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Tests - Learn Apt</title>
        <meta name="description" content="Access your aptitude tests" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tests</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.first_name || 'Student'}!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">General Purpose – Short</h3>
              <p className="text-gray-600 mb-6">
                Quick 7-question assessment to test your basic aptitude skills. Perfect for a quick practice session.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  7 questions
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  10 minutes
                </div>
              </div>
              <Link
                href="/test/short"
                className="block w-full text-center py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start General Purpose – Short
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">General Purpose – Elaborate</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive 120-question assessment covering all aspects of aptitude testing. Get detailed performance insights.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  120 questions
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="text-green-500 mr-2">✓</span>
                  90 minutes
                </div>
              </div>
              <Link
                href="/test/elaborate"
                className="block w-full text-center py-3 px-6 bg-accent text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
              >
                Start General Purpose – Elaborate
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
