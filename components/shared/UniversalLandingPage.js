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
 */

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp, SecondaryImage } from "./HeroManager";
import { getCurrentUser } from "../../lib/supabaseClient";

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
}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

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
        <meta
          name="description"
          content={metaDescription || description}
        />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section with Full-Size Background */}
        <Hero appId={appId} className="h-[70vh] md:h-[80vh] lg:h-[90vh] relative">
          <div className="text-center text-white space-y-6 max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {headline || appName}
            </h1>
            {/* Subheadline - if provided, show as normal text instead of description */}
            {subheadline && (
              <p className="text-xl sm:text-2xl lg:text-3xl leading-relaxed font-normal">
                {subheadline}
              </p>
            )}
            {/* Description - only show if no subheadline provided */}
            {!subheadline && description && (
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">
                {description}
              </p>
            )}

            {/* Paid Course Notice - Centered */}
            {!isFree && !user && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-lg font-semibold">💳 Paid Course</p>
                <p className="text-sm mt-2">
                  Sample One Module Free{' '}
                  <Link 
                    href={`/modules/${firstModuleId}/lesson`}
                    className="underline hover:text-blue-200 font-semibold"
                    aria-label={`Try Module ${firstModuleId} for free before purchasing`}
                  >
                    (Try Module {firstModuleId} Free)
                  </Link>
                  {' '}before you pay!
                </p>
              </div>
            )}

            {/* Call to Action Buttons - Centered for Free Apps, Hidden for Paid */}
            {isFree && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                {!loading && (
                  <>
                    {user ? (
                      <Link
                        href="/learn"
                        className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                      >
                        Start Learning
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/register"
                          className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                        >
                          Register Free
                        </Link>
                        <Link
                          href="/login"
                          className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all duration-200 text-center text-base sm:text-lg"
                        >
                          Sign In
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Paid App - Bottom Corner Boxes (only show when not logged in) */}
          {!isFree && !user && !loading && (
            <div className="absolute bottom-8 left-0 right-0 px-4 sm:px-8 lg:px-16 flex justify-between items-end gap-4">
              {/* Left Bottom - Free Registration Box */}
              <div 
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-3 sm:p-4 max-w-xs"
                role="complementary"
                aria-label="Free registration information"
              >
                <p className="text-sm sm:text-base font-semibold text-white">📝 Free Registration - Save Your Progress</p>
                <p className="text-xs sm:text-sm mt-1 text-white/90">
                  Create a free account to save your scores, track progress, and personalize your experience. 
                  All features are free for registered users!
                </p>
              </div>

              {/* Right Bottom - Register Button */}
              <Link
                href="/register"
                className="inline-block bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-sm sm:text-base whitespace-nowrap"
                aria-label="Get started by creating an account"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Paid App - Start Learning Button for Logged In Users */}
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
        </Hero>

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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Second Image Section (Optional) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <SecondaryImage 
                  appId={appId} 
                  alt={`${appName} interactive learning experience`}
                  className="w-full"
                  style={{ aspectRatio: '4/3', height: 'auto' }}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Learn at Your Own Pace
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Access comprehensive courses, interactive lessons, and expert guidance 
                  anytime, anywhere. Build your skills with our structured learning paths.
                </p>
                {!user && (
                  <Link
                    href="/register"
                    className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200"
                  >
                    Start Your Journey
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
