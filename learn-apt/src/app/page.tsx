"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Brain, AlertCircle, X, LogIn, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // <-- Make sure this exists!

function UnauthorizedBanner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const showUnauthorized = searchParams.get("error") === "unauthorized" && !dismissed;
  if (!showUnauthorized) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-b-2 border-red-500 dark:border-red-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">Access Denied</p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                You do not have administrator privileges. Admin access requires user_metadata.is_admin to be set to true.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const { user, isAdmin } = useAuth();

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/tests"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Tests
            </Link>
            <Link
              href="/about"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="ml-4 px-3 py-1 border rounded text-sm text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-800"
              >
                Admin Panel
              </Link>
            )}
            <div className="ml-6 flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2 px-2 py-1">
                  <User className="inline h-5 w-5" />
                  <span className="font-medium">{user.email}</span>
                </div>
              ) : (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:text-blue-800 border border-blue-200 rounded"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={null}>
        <UnauthorizedBanner />
      </Suspense>
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">
            Discover Your <span className="text-blue-600">Learning Aptitude</span>
          </h1>
          <p className="mb-8 text-lg md:text-xl text-slate-700 dark:text-slate-300">
            Understand your unique learning preferences, problem-solving styles, and motivation drivers with our comprehensive aptitude assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brief-test"
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow"
            >
              Take Brief Test
            </Link>
            <Link
              href="/elaborate-test"
              className="px-6 py-3 rounded-md bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-white font-semibold text-lg shadow"
            >
              Take Elaborate Test
            </Link>
          </div>
        </section>

        {/* Assessment Mode Cards */}
        <section className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center text-slate-900 dark:text-white">
            Choose Your Assessment Mode
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {/* Short Test Card */}
            <div className="bg-white dark:bg-slate-900/70 rounded-lg shadow-lg px-8 py-8 max-w-md mx-auto border border-blue-100 dark:border-blue-700">
              <h3 className="text-2xl font-bold text-blue-600 mb-1">Short Test</h3>
              <p className="text-lg font-semibold text-purple-500 mb-2">5 Minutes</p>
              <ul className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-5 space-y-1">
                <li>5 modules with 5 questions each (25 total)</li>
                <li>Objective multiple-choice format</li>
                <li>AI-generated from reliable sources</li>
                <li>Quick insights into your strengths</li>
                <li>Concise AI-generated report</li>
              </ul>
              <Link
                href="/brief-test"
                className="block w-full py-2 bg-blue-600 text-white rounded-lg font-semibold text-lg text-center hover:bg-blue-700"
              >
                Start Short Test
              </Link>
            </div>
            {/* Elaborate Test Card */}
            <div className="bg-purple-50 dark:bg-purple-900/50 rounded-lg shadow-lg px-8 py-8 max-w-md mx-auto border border-purple-200 dark:border-purple-700">
              <h3 className="text-2xl font-bold text-purple-700 mb-1">Elaborate Test</h3>
              <p className="text-lg font-semibold text-blue-600 mb-2">20-40 Minutes</p>
              <ul className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-5 space-y-1">
                <li><strong>20 modules with 10 questions each (200 total)</strong></li>
                <li>Comprehensive assessment</li>
                <li>Navigable by clicking answers</li>
                <li>In-depth career guidance and analytics</li>
                <li>Detailed ~1000-word AI report</li>
              </ul>
              <Link
                href="/elaborate-test"
                className="block w-full py-2 bg-purple-700 text-white rounded-lg font-semibold text-lg text-center hover:bg-purple-800"
              >
                Start Elaborate Test
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}