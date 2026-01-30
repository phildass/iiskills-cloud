"use client"; // This page uses React hooks and protected route logic - must run on client side

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCurrentUser, signOutUser, getUserProfile } from "../lib/supabaseClient";
import PaidUserProtectedRoute from "@components/PaidUserProtectedRoute";

/**
 * Learning Content Page
 *
 * Main learning dashboard for cricket content
 * Protected Route: Redirects to login if user is not authenticated
 */
function LearnContent() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setUserProfile(getUserProfile(currentUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    const { success } = await signOutUser();
    if (success) {
      setUser(null);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Knowledge Portal - Cricket Know-All</title>
        <meta name="description" content="Access your free cricket knowledge and game portal" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome, {userProfile?.firstName || "Cricket Enthusiast"}! 🏏
            </h1>
            <p className="text-xl text-charcoal mb-4">
              Explore our free cricket knowledge and game portal!
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-gray-700">
                <strong>Account:</strong> {user?.email || "Unknown"}
              </p>
            </div>
          </div>

          {/* Learning Modules */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">
              Cricket Knowledge & Games
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Cricket Basics */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-primary transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🏏</div>
                  <h3 className="text-3xl font-bold text-primary mb-2">Cricket Basics</h3>
                </div>

                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Rules and regulations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Batting techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Bowling styles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Fielding positions</span>
                  </li>
                </ul>

                <button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Explore Now
                </button>
              </div>

              {/* Advanced Strategies */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-200 hover:border-accent transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-3xl font-bold text-accent mb-2">Match Strategies</h3>
                </div>

                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Match tactics and planning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Field placements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Game situations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Decision-making</span>
                  </li>
                </ul>

                <button
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Explore Now
                </button>
              </div>

              {/* Cricket History */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border-2 border-green-200 hover:border-green-600 transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-3xl font-bold text-green-700 mb-2">Cricket History</h3>
                </div>

                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Evolution of cricket</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Legendary players</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Famous matches</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>World cricket</span>
                  </li>
                </ul>

                <button
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Explore Now
                </button>
              </div>

              {/* Statistics & Records */}
              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border-2 border-orange-200 hover:border-orange-600 transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">📈</div>
                  <h3 className="text-3xl font-bold text-orange-700 mb-2">Stats & Records</h3>
                </div>

                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Cricket statistics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Record holders</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Analysis techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Performance metrics</span>
                  </li>
                </ul>

                <button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Explore Now
                </button>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Your Progress</h2>
            <p className="text-gray-600">
              Track your journey and unlock achievements as you explore cricket knowledge!
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

// Wrap with protected route HOC
export default function Learn() {
  return (
    <PaidUserProtectedRoute>
      <LearnContent />
    </PaidUserProtectedRoute>
  );
}
