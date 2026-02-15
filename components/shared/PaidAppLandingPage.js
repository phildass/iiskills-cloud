"use client";

/**
 * Enhanced Paid App Landing Page
 * 
 * Extends UniversalLandingPage with:
 * - Sample Lesson Showcase (Zero-Barrier Sample)
 * - App-specific highlights
 * - Optional AI-Developer Bundle pitch
 * - Post-sample Premium Access flow
 * - UNIVERSAL DIAGNOSTIC FUNNEL: "Where would you like to start?" with tier selection
 */

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import Hero, { SecondaryImage } from "./HeroManager";
import { getCurrentUser } from "../../lib/supabaseClient";
import SampleLessonShowcase from "./SampleLessonShowcase";
import AIDevBundlePitch from "./AIDevBundlePitch";

import CalibrationGatekeeper from "./CalibrationGatekeeper";
import PremiumAccessPrompt from "./PremiumAccessPrompt";

import LevelSelector from "./LevelSelector";


/**
 * Generate standardized app context label
 */
function getAppContextLabel(appId) {
  const labels = {
    "learn-finesse": "iiskills Finesse",
    "learn-pr": "iiskills PR",
    "learn-management": "iiskills Management",
    "learn-ai": "iiskills AI",
    "learn-developer": "iiskills Developer",
    "learn-govt-jobs": "iiskills Government Jobs",
  };
  return labels[appId] || "iiskills";
}

/**
 * Get app-specific links for the App Links panel
 */
function getAppSpecificLinks(appId) {
  const commonLinks = [
    { label: "Courses", href: appId === "learn-finesse" ? "/courses" : "/curriculum" },
    { label: "Sample Lesson", href: "#sample" },
  ];

  const appSpecificMap = {
    "learn-govt-jobs": [
      { label: "Job Search", href: "/jobs" },
      { label: "Exam Alerts", href: "/exam-countdown" },
    ],
    "learn-ai": [
      { label: "AI Playground", href: "/playground" },
    ],
    "learn-finesse": [
      { label: "Certification", href: "/certification" },
    ],
  };

  return [...commonLinks, ...(appSpecificMap[appId] || [])];
}

export default function PaidAppLandingPage({
  appId,
  appName,
  headline,
  subheadline,
  title,
  description,
  features,
  heroGradient = "from-primary to-accent",
  showAIDevBundle = false,
  sampleModuleId = 1,
  sampleLessonId = 1,
  appType = null, // For gatekeeper questions
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

  const displayAppContextLabel = getAppContextLabel(appId);

  // Map appId to appType for gatekeeper questions
  const getAppType = () => {
    if (appType) return appType;
    
    const typeMap = {
      "learn-ai": "ai",
      "learn-developer": "developer",
      "learn-finesse": "finesse",
      "learn-management": "management",
      "learn-pr": "pr",
      "learn-govt-jobs": "govt-jobs",
    };
    return typeMap[appId] || "ai";
  };

  const handlePaymentRequired = () => {
    setShowPaymentPreview(true);
  };

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, [appId]);

  return (
    <>
      <Head>
        <title>{title || `${appName} - iiskills.cloud`}</title>
        <meta name="description" content={description} />
      </Head>

      <main className="min-h-screen">
        {/* App Links Panel */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-bold whitespace-nowrap">Quick Access:</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {getAppSpecificLinks(appId).map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 border border-white/30 hover:border-white/50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <Hero appId={appId} className="h-[70vh] md:h-[80vh] lg:h-[90vh] relative">
          <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold z-10">
            {displayAppContextLabel}
          </div>

          <div className="text-center text-white space-y-6 max-w-4xl mx-auto mt-20">
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${appId === 'learn-pr' ? 'text-white' : ''}`}>
              {headline || appName}
            </h1>
            {subheadline && (
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-normal">
                {subheadline}
              </p>
            )}

            {/* Paid Course Notice */}
            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-lg font-semibold">💳 Premium Course</p>
              <p className="text-sm mt-2">
                Try our sample lesson and Level 1 test FREE—no login required!
              </p>
            </div>

            {/* CTA */}
            {!loading && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                <a
                  href="#sample"
                  className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                >
                  Try Sample Lesson Free
                </a>
                <Link
                  href={appId === "learn-finesse" ? "/courses" : "/curriculum"}
                  className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all duration-200 text-center text-base sm:text-lg"
                >
                  View Full Curriculum
                </Link>
              </div>
            )}
          </div>
        </Hero>

        {/* UNIVERSAL DIAGNOSTIC FUNNEL: Where would you like to start? */}
        <LevelSelector
          appName={appName}
          appId={appId}
          sampleModuleUrl={`/modules/${sampleModuleId}/lesson/${sampleLessonId}`}
          intermediateUrl="/curriculum?level=intermediate"
          advancedUrl="/curriculum?level=advanced"
        />

        {/* Features Section */}
        {features && features.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                What You'll Master
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="text-4xl mb-4">{feature.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Level 1 Qualifier (Gatekeeper) Section */}
        <CalibrationGatekeeper
          appName={appName}
          appType={getAppType()}
          tier="Level 1"
          isPaid={true}
          onPaymentRequired={handlePaymentRequired}
        />

        {/* Payment Preview Modal */}
        {showPaymentPreview && (
          <PremiumAccessPrompt
            appName={appName}
            appHighlight={description}
            showAIDevBundle={showAIDevBundle}
            onCancel={() => setShowPaymentPreview(false)}
          />
        )}

        {/* Sample Lesson Showcase - Zero-Barrier Sample */}
        <section id="sample" className="scroll-mt-16">
          <SampleLessonShowcase
            appId={appId}
            appName={appName}
            sampleModuleId={sampleModuleId}
            sampleLessonId={sampleLessonId}
          />
        </section>

        {/* AI-Developer Bundle (if applicable) */}
        {showAIDevBundle && (appId === "learn-ai" || appId === "learn-developer") && (
          <AIDevBundlePitch currentApp={appId} />
        )}

        {/* Second Image Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <SecondaryImage
                  appId={appId}
                  alt={`${appName} interactive learning experience`}
                  className="w-full rounded-xl shadow-lg"
                  style={{ aspectRatio: "4/3", height: "auto" }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Structured Learning Path
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Master skills through our proven Tri-Level system: Basic foundations, intermediate frameworks, and advanced mastery. Each level builds on the last.
                </p>
                <a
                  href="#sample"
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Start Your Journey
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Master {appName}?
            </h2>
            <p className="text-xl mb-8">
              Start with our free sample lesson and experience the iiskills difference.
            </p>
            <a
              href="#sample"
              className="inline-block bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-200"
            >
              Try Sample Lesson Free →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
