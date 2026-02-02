"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  return (
    <>
      <Head>
        <title>Master Aptitude - iiskills.cloud</title>
        <meta name="description" content="Test and improve your aptitude skills with our free comprehensive testing platform" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">Learn Apt</h1>
                <p className="text-sm text-gray-600">Free Aptitude Testing Platform</p>
              </div>
              <nav className="flex gap-4 text-sm">
                {user ? (
                  <>
                    <Link href="/tests" className="text-gray-600 hover:text-primary transition">
                      My Tests
                    </Link>
                    <Link href="/profile" className="text-gray-600 hover:text-primary transition">
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-gray-600 hover:text-primary transition">
                      Login
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
                      Sign Up Free
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Master Your Aptitude Skills
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Take comprehensive aptitude tests absolutely free. Choose between quick assessments or in-depth evaluations to measure and improve your skills.
            </p>

            {/* Test Type Selection */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              {/* Short Test Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-primary transition-all hover:shadow-xl">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Short Test</h3>
                <p className="text-gray-600 mb-4">Quick assessment with fewer than 10 questions</p>
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Less than 10 questions
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    ~5-10 minutes duration
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Quick skill check
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Immediate results
                  </div>
                </div>
                <Link
                  href={user ? "/test/short" : "/register"}
                  className="block w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {user ? "Start Short Test" : "Sign Up to Start"}
                </Link>
              </div>

              {/* Elaborate Test Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-transparent hover:border-accent transition-all hover:shadow-xl">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Elaborate Test</h3>
                <p className="text-gray-600 mb-4">Comprehensive assessment with over 100 questions</p>
                <div className="space-y-2 mb-6 text-left">
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    100+ questions
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    ~60-90 minutes duration
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Detailed analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Performance insights
                  </div>
                </div>
                <Link
                  href={user ? "/test/elaborate" : "/register"}
                  className="block w-full py-3 px-6 bg-accent text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors"
                >
                  {user ? "Start Elaborate Test" : "Sign Up to Start"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose Learn Apt?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💯</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">100% Free</h4>
                <p className="text-gray-600">
                  All tests are completely free. No hidden charges, no subscriptions.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Detailed Analytics</h4>
                <p className="text-gray-600">
                  Get comprehensive reports on your performance and areas for improvement.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h4>
                <p className="text-gray-600">
                  Monitor your improvement over time with detailed progress tracking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                Ready to Test Your Aptitude?
              </h3>
              <p className="text-xl text-white/90 mb-8">
                Create your free account and start testing today!
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-4 bg-white text-primary rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Started for Free
              </Link>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-400">
              © 2026 Learn Apt. All rights reserved.
            </p>
            <div className="mt-4 space-x-4">
              <Link href="/terms" className="text-gray-400 hover:text-white transition">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
