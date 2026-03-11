"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PAID_APP_IDS = ["learn-ai", "learn-developer", "learn-pr", "learn-management"];

/**
 * AppSecondaryNavbar
 *
 * A secondary navigation bar that appears below the main SiteHeader on every
 * page of each learn-* app.
 *
 * Items (left to right):
 *   1. "{appName} Home"  — link to the app root "/"
 *   2. FREE / PAID badge — non-clickable label
 *   3. "Curriculum"      — link to "/curriculum"
 *   4. "Continue My Lessons" — smart button (see behaviour below)
 *
 * "Continue My Lessons" behaviour:
 *   A. Logged-in + entitled (or free app):
 *        → Navigate to last visited lesson (/modules/{m}/lesson/{l}) or
 *          Module 1 Lesson 1 if no progress recorded.
 *   B. Not logged-in:
 *        → Show a prompt: "You need to register first." with a CTA that
 *          takes the user to the main register page preserving return_to.
 *   C. Logged-in but not entitled (paid app):
 *        → Show a prompt: "This is a paid course." with a "Pay Now" button
 *          that routes to the main start-payment flow.
 *
 * Props:
 *   @param {string} appId    - App identifier (e.g. "learn-physics")
 *   @param {string} appName  - Display name   (e.g. "Physics")
 *   @param {boolean} isFree  - Whether the app is free (overrides PAID_APP_IDS lookup)
 *   @param {string} [firstLessonPath="/modules/1/lesson/1"] - Path for "Continue My Lessons".
 *     Defaults to the standard module/lesson structure used by most learn-* apps.
 *     Override for apps that use a different structure (e.g. learn-apt uses "/tests/numerical").
 */
export default function AppSecondaryNavbar({
  appId,
  appName,
  isFree,
  firstLessonPath = "/modules/1/lesson/1",
}) {
  const isPaid = isFree !== undefined ? !isFree : PAID_APP_IDS.includes(appId);

  const [user, setUser] = useState(null);
  const [entitled, setEntitled] = useState(null); // null = unknown, true/false
  const [dialog, setDialog] = useState(null); // null | "register" | "pay"

  useEffect(() => {
    let cancelled = false;

    async function loadAuth() {
      try {
        const { getCurrentUser } = await import("@lib/supabaseClient");
        const currentUser = await getCurrentUser();
        if (cancelled) return;
        setUser(currentUser);

        if (!currentUser) {
          if (!cancelled) setEntitled(false);
          return;
        }

        // Free apps are always entitled.
        if (!isPaid) {
          if (!cancelled) setEntitled(true);
          return;
        }

        // Paid app — check entitlement via the main site API.
        try {
          const { supabase } = await import("@lib/supabaseClient");
          const {
            data: { session },
          } = await supabase.auth.getSession();

          const headers = {};
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }

          const mainUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud";
          const res = await fetch(`${mainUrl}/api/entitlement?appId=${encodeURIComponent(appId)}`, {
            headers,
          });

          if (!cancelled) {
            if (res.ok) {
              const data = await res.json();
              setEntitled(!!data.entitled);
            } else {
              setEntitled(false);
            }
          }
        } catch {
          if (!cancelled) setEntitled(false);
        }
      } catch {
        // Auth unavailable (e.g. build/CI) — stay unauthenticated.
      }
    }

    loadAuth();
    return () => {
      cancelled = true;
    };
  }, [appId, isPaid]);

  const handleContinueLessons = () => {
    if (!user) {
      setDialog("register");
      return;
    }
    if (isPaid && !entitled) {
      setDialog("pay");
      return;
    }
    // Navigate to first lesson as default (last-lesson lookup can be added per-app).
    window.location.href = firstLessonPath;
  };

  const handleRegister = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const returnTo = encodeURIComponent(`${origin}${firstLessonPath}`);
    const mainUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud";
    window.location.href = `${mainUrl}/register?return_to=${returnTo}`;
  };

  const handlePayNow = () => {
    const mainUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud";
    window.location.href = `${mainUrl}/start-payment?course=${encodeURIComponent(appId)}`;
  };

  const shortName = appName || appId;

  return (
    <>
      <nav
        className="bg-white border-b border-gray-200 shadow-sm sticky top-[76px] z-30"
        aria-label={`${shortName} secondary navigation`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 text-sm">
            {/* App Home */}
            <Link
              href="/"
              className="font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
            >
              {shortName} Home
            </Link>

            <span className="text-gray-300 hidden sm:inline">|</span>

            {/* FREE / PAID badge */}
            {isPaid ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 whitespace-nowrap select-none">
                💳 PAID
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 whitespace-nowrap select-none">
                🆓 FREE
              </span>
            )}

            <span className="text-gray-300 hidden sm:inline">|</span>

            {/* Curriculum */}
            <Link
              href="/curriculum"
              className="text-gray-700 hover:text-primary transition-colors whitespace-nowrap"
            >
              Curriculum
            </Link>

            <span className="text-gray-300 hidden sm:inline">|</span>

            {/* Continue My Lessons */}
            <button
              onClick={handleContinueLessons}
              className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              ▶ Continue My Lessons
            </button>
          </div>
        </div>
      </nav>

      {/* Register prompt dialog */}
      {dialog === "register" && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="register-dialog-title"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h2 id="register-dialog-title" className="text-xl font-bold text-gray-900 mb-2">
              You need to register first
            </h2>
            <p className="text-gray-600 mb-6">
              Create a free account to track your progress and continue learning.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleRegister}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Yes, I want to register
              </button>
              <button
                onClick={() => setDialog(null)}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay prompt dialog */}
      {dialog === "pay" && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-dialog-title"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="text-4xl mb-4">💳</div>
            <h2 id="pay-dialog-title" className="text-xl font-bold text-gray-900 mb-2">
              This is a paid course
            </h2>
            <p className="text-gray-600 mb-6">
              Enroll in <strong>{shortName}</strong> to access all lessons and earn your
              certificate.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePayNow}
                className="w-full bg-yellow-500 text-white font-bold py-2.5 rounded-xl hover:bg-yellow-600 transition-colors"
              >
                Pay Now
              </button>
              <button
                onClick={() => setDialog(null)}
                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
