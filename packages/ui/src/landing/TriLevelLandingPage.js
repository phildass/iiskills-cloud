"use client";

/**
 * Tri-Level Landing Page Component
 *
 * Unified landing page for all learning apps with:
 * - Free or Paid badge
 * - Basic / Intermediate / Advanced level buttons (no gatekeeper quiz)
 * - "Sample Lesson" button linking to Basic Lesson 1
 * - Free: "Enter" button | Paid: "Pay Now" + "Enter if already entitled"
 * - Certificate ineligibility warning when skipping levels (paid apps only)
 * - No gatekeeper test flows
 */

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Hero from "./HeroManager";
import { getCurrentUser } from "@/lib/supabaseClient";
import UniversalInstallPrompt from "../pwa/UniversalInstallPrompt";

const PAID_APP_IDS = ["learn-ai", "learn-developer", "learn-pr", "learn-management"];

const LEVELS = [
  {
    id: "basic",
    label: "Basic",
    emoji: "🟢",
    description: "Build fundamental understanding from scratch",
    color: "bg-green-600 hover:bg-green-700",
    borderColor: "border-green-600",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "🔵",
    description: "Apply concepts to real-world scenarios",
    color: "bg-blue-600 hover:bg-blue-700",
    borderColor: "border-blue-600",
  },
  {
    id: "advanced",
    label: "Advanced",
    emoji: "🟣",
    description: "Master-level expertise and certification",
    color: "bg-purple-600 hover:bg-purple-700",
    borderColor: "border-purple-600",
  },
];

export default function TriLevelLandingPage({
  appId,
  appName,
  headline,
  subheadline,
  title,
  description,
  features = [],
  isFree,
  heroGradient = "from-primary to-accent",
  sampleModuleId = 1,
  sampleLessonId = 1,
  showAIDevBundle = false,
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entitled, setEntitled] = useState(false);
  const [confirmLevel, setConfirmLevel] = useState(null); // level obj being confirmed
  const [certWarningChecked, setCertWarningChecked] = useState(false);
  const [savingIneligibility, setSavingIneligibility] = useState(false);
  const confirmRef = useRef(null);

  const isPaid = isFree === false || (!isFree && PAID_APP_IDS.includes(appId));

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser && isPaid) {
        // Check entitlement
        try {
          const res = await fetch(`/api/access/check?appId=${appId}`);
          if (res.ok) {
            const data = await res.json();
            setEntitled(!!data.hasAccess);
          }
        } catch {
          // Silently fail - entitlement check is best-effort
        }
      }
      setLoading(false);
    };
    init();
  }, [appId, isPaid]);

  // Scroll to confirm dialog when it opens
  useEffect(() => {
    if (confirmLevel && confirmRef.current) {
      confirmRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [confirmLevel]);

  const handleLevelClick = (level) => {
    if (level.id === "basic") {
      // Basic: always navigate directly
      window.location.href = `/modules/1/lesson/1`;
      return;
    }
    // Intermediate or Advanced: show certificate warning dialog (paid apps only)
    if (isPaid) {
      setConfirmLevel(level);
      setCertWarningChecked(false);
    } else {
      // Free apps: navigate directly without warning
      window.location.href = `/curriculum?level=${level.id}`;
    }
  };

  const handleConfirmSkip = async () => {
    if (!certWarningChecked) return;

    if (user && isPaid) {
      // Record certificate ineligibility in Supabase
      setSavingIneligibility(true);
      try {
        await fetch("/api/certificate-eligibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            appKey: appId,
            isEligible: false,
            skippedToLevel: confirmLevel.id,
          }),
        });
      } catch {
        // Continue navigation even if recording fails
      } finally {
        setSavingIneligibility(false);
      }
    }

    window.location.href = `/curriculum?level=${confirmLevel.id}`;
  };

  const handleCancelConfirm = () => {
    setConfirmLevel(null);
    setCertWarningChecked(false);
  };

  const sampleLessonUrl = `/modules/${sampleModuleId}/lesson/${sampleLessonId}`;

  return (
    <>
      <Head>
        <title>{title || `${appName} - iiskills.cloud`}</title>
        <meta name="description" content={description} />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero appId={appId} className="h-[70vh] md:h-[80vh] lg:h-[90vh]">
          <div className="text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
              {headline || appName}
            </h1>
            {subheadline && (
              <p className="text-lg sm:text-xl leading-relaxed font-normal mb-4">
                {subheadline}
              </p>
            )}
          </div>
        </Hero>

        {/* Free / Paid + CTA Section */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Free or Paid Badge */}
            <div className="flex justify-center mb-4">
              {isPaid ? (
                <span className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold px-5 py-2 rounded-full text-lg shadow-lg">
                  💳 Paid Course
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 bg-green-400 text-green-900 font-bold px-5 py-2 rounded-full text-lg shadow-lg">
                  🆓 Free Course
                </span>
              )}
            </div>

            <p className="text-lg mb-6 opacity-90">
              {isPaid
                ? "Enroll once — access all three levels and earn your certificate."
                : "Completely free — start learning today, no payment required."}
            </p>

            {/* AI/Developer Bundle Notice */}
            {showAIDevBundle && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white rounded-lg p-4 max-w-2xl mx-auto mb-6 shadow-2xl">
                <p className="text-xl font-bold text-white">🎁 Two Apps for the Price of One!</p>
                <p className="text-sm mt-2 text-white">
                  Purchase Learn AI or Learn Developer and get BOTH apps!
                </p>
              </div>
            )}

            {/* Sample Lesson Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                href={sampleLessonUrl}
                className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-base sm:text-lg"
              >
                📖 Sample Lesson
              </Link>

              {isPaid ? (
                <>
                  <a
                    href={`https://aienter.in/payments/iiskills?course=${appId}`}
                    className="inline-block bg-yellow-400 text-yellow-900 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-yellow-300 transition-all duration-200 text-base sm:text-lg"
                  >
                    💳 Pay Now
                  </a>
                  {entitled && (
                    <Link
                      href="/curriculum"
                      className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition-all duration-200 text-base sm:text-lg"
                    >
                      ▶ Enter
                    </Link>
                  )}
                </>
              ) : (
                <Link
                  href="/curriculum"
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition-all duration-200 text-base sm:text-lg"
                >
                  ▶ Enter
                </Link>
              )}
            </div>

            {/* Install App Prompt */}
            <div className="mt-2 flex justify-center">
              <UniversalInstallPrompt
                currentAppId={appId}
                currentAppName={appName}
                variant="button"
                size="md"
                showMotherAppPromo={true}
              />
            </div>
          </div>
        </section>

        {/* Level Selection Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Choose Your Level
              </h2>
              <p className="text-lg text-gray-600">
                Choose your starting point — or jump ahead. We recommend starting at Basic to stay
                certificate-eligible.
              </p>
              {isPaid && (
                <p className="text-sm text-amber-600 mt-2 font-medium">
                  ⚠️ Skipping levels may affect your certificate eligibility.
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleLevelClick(level)}
                  className={`${level.color} text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center focus:outline-none focus:ring-4 focus:ring-blue-300`}
                >
                  <span className="text-5xl mb-3">{level.emoji}</span>
                  <h3 className="text-2xl font-bold mb-2">{level.label}</h3>
                  <p className="text-sm opacity-90">{level.description}</p>
                </button>
              ))}
            </div>

            {/* Certificate Ineligibility Warning Dialog */}
            {confirmLevel && (
              <div
                ref={confirmRef}
                className="mt-8 bg-amber-50 border-2 border-amber-400 rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
              >
                <h3 className="text-xl font-bold text-amber-800 mb-3">
                  ⚠️ Skipping to {confirmLevel.label}
                </h3>
                <p className="text-gray-700 mb-4">
                  We recommend starting at <strong>Basic</strong> to build a strong foundation and
                  remain eligible for a <strong>certificate</strong>.
                </p>
                <p className="text-gray-700 mb-5">
                  If you skip levels, you will be <strong>ineligible for a certificate</strong> for
                  this course.
                </p>
                <label className="flex items-start gap-3 cursor-pointer mb-5">
                  <input
                    type="checkbox"
                    checked={certWarningChecked}
                    onChange={(e) => setCertWarningChecked(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-400 accent-amber-600"
                  />
                  <span className="text-gray-800 font-medium">
                    I understand I will be ineligible for a certificate for this course.
                  </span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleConfirmSkip}
                    disabled={!certWarningChecked || savingIneligibility}
                    className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {savingIneligibility ? "Saving…" : `Continue to ${confirmLevel.label}`}
                  </button>
                  <button
                    onClick={handleCancelConfirm}
                    className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-300 transition"
                  >
                    Start at Basic Instead
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        {features && features.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                What You&apos;ll Master
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100"
                  >
                    <div className="text-4xl mb-4">{feature.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
