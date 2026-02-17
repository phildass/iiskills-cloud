"use client";

/**
 * Shared Landing Page Component
 *
 * Universal landing page component for all learning apps.
 * Features:
 * - Consistent layout across all apps
 * - Random image selection (2 images per app) via HeroManager
 * - Special handling for cricket app (cricket1, cricket2)
 * - Responsive design
 * - User authentication detection
 * - Full-size hero background with bottom-aligned overlay text
 * - Standardized app context labels (e.g., "iiskills PR", "iiskills Management")
 * - UNIVERSAL DIAGNOSTIC FUNNEL: "Where would you like to start?" with tier selection
 */

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp, SecondaryImage } from "./HeroManager";
import { getCurrentUser } from "../../lib/supabaseClient";

import CalibrationGatekeeper from "./CalibrationGatekeeper";
import PremiumAccessPrompt from "./PremiumAccessPrompt";

import LevelSelector from "./LevelSelector";


/**
 * Generate standardized app context label
 * Maps app IDs to their iiskills branded labels
 */
function getAppContextLabel(appId) {
  const labels = {
    main: "iiskills Cloud",
    "learn-pr": "iiskills PR",
    "learn-management": "iiskills Management",
    "learn-ai": "iiskills AI",
    "learn-apt": "iiskills APTITUDE",
    "learn-developer": "iiskills Developer",
    "learn-physics": "iiskills Physics",
    "learn-chemistry": "iiskills Chemistry",
    "learn-math": "iiskills Math",
    "learn-geography": "iiskills Geography",
    // REMOVED per requirement #9: "learn-govt-jobs": "iiskills Government Jobs",
  };
  return labels[appId] || "iiskills";
}

/**
 * Get direct course links for all available apps
 * Returns array of course objects with name, icon, and subdomain URL
 */
function getCourseLinks() {
  return [
    { name: "Learn AI", icon: "🤖", url: "https://app1.learn-ai.iiskills.cloud" },
    { name: "Learn Management", icon: "📊", url: "https://app2.learn-management.iiskills.cloud" },
    { name: "Learn PR", icon: "📢", url: "https://app3.learn-pr.iiskills.cloud" },
    { name: "Learn Developer", icon: "💻", url: "https://app4.learn-developer.iiskills.cloud" },
    { name: "Learn Aptitude", icon: "🧠", url: "https://app5.learn-apt.iiskills.cloud" },
    { name: "Learn Physics", icon: "⚛️", url: "https://app6.learn-physics.iiskills.cloud" },
    { name: "Learn Chemistry", icon: "🧪", url: "https://app7.learn-chemistry.iiskills.cloud" },
    { name: "Learn Math", icon: "📐", url: "https://app8.learn-math.iiskills.cloud" },
    { name: "Learn Geography", icon: "🌍", url: "https://app9.learn-geography.iiskills.cloud" },
    // REMOVED per requirement #9: { name: "Learn Govt Jobs", icon: "🏛️", url: "https://app10.learn-govt-jobs.iiskills.cloud" },
  ];
}

/**
 * Get app-specific links (courses, tests, features) for the App Links panel
 * @param {string} appId - The app identifier
 * @returns {Array} Array of link objects with label and href
 */
function getAppSpecificLinks(appId) {
  const commonLinks = [
    { label: "Courses", href: "/courses" },
    { label: "Tests", href: "/tests" },
    { label: "Curriculum", href: "/curriculum" },
  ];

  // App-specific additional links
  const appSpecificMap = {
    // REMOVED per requirement #9
    /*
    "learn-govt-jobs": [
      { label: "Job Search", href: "/jobs" },
      { label: "Opportunities", href: "/opportunity-feed" },
      { label: "Daily Brief", href: "/daily-brief" },
      { label: "Exam Alerts", href: "/exam-countdown" },
      { label: "News", href: "/news" },
    ],
    */
    "learn-ai": [
      { label: "AI Playground", href: "/playground" },
      { label: "Projects", href: "/projects" },
    ],
    "learn-pr": [
      { label: "Case Studies", href: "/case-studies" },
      { label: "Resources", href: "/resources" },
    ],
    "learn-management": [
      { label: "Leadership Tools", href: "/tools" },
      { label: "Resources", href: "/resources" },
    ],
  };

  return [...commonLinks, ...(appSpecificMap[appId] || [])];
}

export default function UniversalLandingPage({
  appId,
  appName, // Backward compatibility - will be used if headline is not provided
  headline, // New: Large headline text
  subheadline, // New: Normal subheadline text
  title,
  description,
  features,
  isFree = false,
  heroGradient = "from-primary to-accent",
  metaDescription = null,
  firstModuleId = 1, // Default first module ID for paid apps
  appContextLabel = null, // New: Standardized app context line (e.g., "iiskills PR")
  appType = null, // For gatekeeper questions (e.g., "math", "physics", "ai")
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [showPaymentPreview, setShowPaymentPreview] = useState(false);

  // Auto-generate app context label if not provided
  const displayAppContextLabel = appContextLabel || getAppContextLabel(appId);

  // Map appId to appType for gatekeeper questions
  const getAppType = () => {
    if (appType) return appType;
    
    // Extract app type from appId (e.g., "learn-math" -> "math")
    const typeMap = {
      "learn-math": "math",
      "learn-physics": "physics",
      "learn-chemistry": "chemistry",
      // MOVED TO apps-backup as per cleanup requirements
      // "learn-biology": "biology",
      "learn-geography": "geography",
      "learn-apt": "aptitude",
      "learn-ai": "ai",
      "learn-developer": "developer",
      // MOVED TO apps-backup as per cleanup requirements
      // "learn-finesse": "finesse",
      "learn-management": "management",
      "learn-pr": "pr",
      // REMOVED per requirement #9: "learn-govt-jobs": "govt-jobs",
    };
    return typeMap[appId] || "math";
  };

  const handleGatekeeperSuccess = () => {
    // For free apps, navigate to Lesson 1.1
    if (isFree) {
      window.location.href = `/modules/1/lesson/1`;
    }
  };

  const handlePaymentRequired = () => {
    // For paid apps, show payment preview
    setShowPaymentPreview(true);
  };

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    // Set images once on mount to avoid hydration issues
    setImages(getHeroImagesForApp(appId));
    checkUser();
  }, [appId]);

  return (
    <>
      <Head>
        <title>{title || `${appName} - iiskills.cloud`}</title>
        <meta name="description" content={metaDescription || description} />
      </Head>

      <main className="min-h-screen">
        {/* App Links Panel - Above Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-bold whitespace-nowrap">App Links:</h2>
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

        {/* Hero Section with Full-Size Background */}
        <Hero appId={appId} className="h-[70vh] md:h-[80vh] lg:h-[90vh] relative">
          {/* Labels and links in top-left corner */}
          <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
            {/* FREE/PAID label */}
            <div className={`${isFree ? 'bg-green-500' : 'bg-orange-500'} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg`}>
              {isFree ? 'FREE' : 'PAID'}
            </div>
            
            {/* Syllabus link */}
            <Link
              href="/curriculum"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
            >
              Syllabus
            </Link>
          </div>

          <div className="text-center text-blue-600 space-y-6 max-w-4xl mx-auto mt-20">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight drop-shadow-lg">
              {headline || appName}
            </h1>
            {/* Subheadline - if provided, show as normal text instead of description */}
            {subheadline && (
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-normal">
                {subheadline}
              </p>
            )}
            {/* Description - only show if no subheadline provided */}
            {!subheadline && description && (
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">{description}</p>
            )}

            {/* Paid Course Notice - Centered */}
            {!isFree && !user && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-lg font-semibold">💳 Paid Course</p>
                <p className="text-sm mt-2">
                  Sample One Module Free{" "}
                  <Link
                    href={`/modules/${firstModuleId}/lesson`}
                    className="underline hover:text-blue-200 font-semibold"
                    aria-label={`Try Module ${firstModuleId} for free before purchasing`}
                  >
                    (Try Module {firstModuleId} Free)
                  </Link>{" "}
                  before you pay!
                </p>
              </div>
            )}
            
            {/* Free Course Notice */}
            {isFree && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-lg font-semibold">💳 Free Course</p>
                <p className="text-sm mt-2">
                  Try our sample lesson and Level 1 test FREE—no login required!
                </p>
              </div>
            )}

            {/* Call to Action Buttons - OPEN ACCESS: Auth buttons removed */}
            {isFree && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                {!loading && (
                  <>
                    {/* OPEN ACCESS: Show "Start Learning" for everyone, no auth required */}
                    <Link
                      href="/learn"
                      className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                    >
                      Try Sample Lesson
                    </Link>
                    <Link
                      href="/curriculum"
                      className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all duration-200 text-center text-base sm:text-lg"
                    >
                      View Full Curriculum
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* OPEN ACCESS: Paid App registration boxes removed - show Start Learning for all */}
          {!isFree && !loading && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Link
                href="/learn"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
              >
                Start Learning
              </Link>
            </div>
          )}
          
          {/* OPEN ACCESS: Original paid app registration UI removed
          {!isFree && !user && !loading && (
            <div className="absolute bottom-8 left-0 right-0 px-4 sm:px-8 lg:px-16 flex justify-between items-end gap-4">
              <div
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-3 sm:p-4 max-w-xs"
                role="complementary"
                aria-label="Free registration information"
              >
                <p className="text-sm sm:text-base font-semibold text-white">
                  📝 Free Registration - Save Your Progress
                </p>
                <p className="text-xs sm:text-sm mt-1 text-white/90">
                  Create a free account to save your scores, track progress, and personalize your
                  experience. All features are free for registered users!
                </p>
              </div>

              <Link
                href="/register"
                className="inline-block bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-sm sm:text-base whitespace-nowrap"
                aria-label="Get started by creating an account"
              >
                Get Started
              </Link>
            </div>
          )}

          {!isFree && user && !loading && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Link
                href="/learn"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
              >
                Start Learning
              </Link>
            </div>
          )}
          */}
        </Hero>

        {/* UNIVERSAL DIAGNOSTIC FUNNEL: Where would you like to start? */}
        <LevelSelector
          appName={appName}
          appId={appId}
          sampleModuleUrl={`/modules/${firstModuleId}/lesson/1`}
          intermediateUrl="/curriculum?level=intermediate"
          advancedUrl="/curriculum?level=advanced"
        />

        {/* Features Section */}
        {features && features.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
                What's Inside
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
          isPaid={!isFree}
          onCalibrationSuccess={handleGatekeeperSuccess}
          onPaymentRequired={handlePaymentRequired}
        />

        {/* Payment Preview Modal (for paid apps) */}
        {showPaymentPreview && (
          <PremiumAccessPrompt
            appName={appName}
            appHighlight={description}
            showAIDevBundle={appId === "learn-ai" || appId === "learn-developer"}
            onCancel={() => setShowPaymentPreview(false)}
          />
        )}

        {/* Direct Course Access Links Section */}
        <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">
              Quick Access to All Courses
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Direct links to specialized learning apps
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCourseLinks().map((course, index) => (
                <a
                  key={index}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{course.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{course.name}</h3>
                      <p className="text-sm text-gray-600">{course.url}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Second Image Section (Optional) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <SecondaryImage
                  appId={appId}
                  alt={`${appName} interactive learning experience`}
                  className="w-full"
                  style={{ aspectRatio: "4/3", height: "auto" }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Learn at Your Own Pace
                </h2>
                <p className="text-lg text-gray-600">
                  Access comprehensive courses, interactive lessons, and expert guidance anytime,
                  anywhere. Build your skills with our structured learning paths.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
