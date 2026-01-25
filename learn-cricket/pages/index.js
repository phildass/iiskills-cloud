"use client"; // This page uses React hooks for user state management - must run on client side

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../../components/shared/InstallApp";
import TranslationFeatureBanner from "../../components/shared/TranslationFeatureBanner";

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
        <title>Cricket Know-All - Free Cricket Knowledge & Game Portal</title>
        <meta
          name="description"
          content="Your free cricket knowledge and games portal—quizzes, stats, history, events, and more!"
        />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-cyan-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Cricket Know-All</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Your free cricket knowledge and games portal—quizzes, stats, history, events, and more!
            </p>

            {!user && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-lg font-semibold">📝 Free Registration - Save Your Progress</p>
                <p className="text-sm mt-2">
                  Create a free account to save your scores, track progress, and personalize your experience. 
                  All features are free for registered users!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              {user ? (
                <Link
                  href="/learn"
                  className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Explore Knowledge Portal →
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                  >
                    Register Free Account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition"
                  >
                    Already Have Account? Sign In
                  </Link>
                </>
              )}
              <InstallApp appName="Cricket Know-All" />
            </div>
          </div>
        </section>
        {/* Translation Feature Banner */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <TranslationFeatureBanner />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">What's Inside</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🏏</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Cricket Knowledge</h3>
                <p className="text-charcoal">
                  Explore cricket rules, techniques, and fundamentals—from basics to advanced concepts, 
                  all in one free portal.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Games & Quizzes</h3>
                <p className="text-charcoal">
                  Test your knowledge with interactive quizzes, match strategies, and tactical challenges.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Stats & History</h3>
                <p className="text-charcoal">
                  Dive into cricket's rich history, legendary players, memorable matches, and fascinating records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-cyan-600 to-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Begin?</h2>
            <p className="text-xl mb-8">
              Join cricket enthusiasts worldwide and explore our free knowledge portal
            </p>

            {!user && (
              <Link
                href="/register"
                className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
