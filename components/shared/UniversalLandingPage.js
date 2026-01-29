"use client";

/**
 * Shared Landing Page Component
 * 
 * Universal landing page component for all learning apps.
 * Features:
 * - Consistent layout across all apps
 * - Random image selection (2 images per app)
 * - Special handling for cricket app (cricket1, cricket2)
 * - Responsive design
 * - User authentication detection
 */

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../../lib/supabaseClient";

/**
 * Image mappings for each app
 * Cricket uses specific images, others use randomly selected images from the pool
 */
const APP_IMAGES = {
  "learn-cricket": ["cricket1.jpg", "cricket2.jpg"],
  // For other apps, we'll randomly select 2 from the available images
  default: ["iiskills-image1.jpg", "iiskills-image2.jpg", "iiskills-image3.jpg", "iiskills-image4.jpg"]
};

/**
 * Select images for an app
 * @param {string} appId - The app identifier (e.g., "learn-ai")
 * @returns {Array<string>} Array of 2 image filenames
 */
function getAppImages(appId) {
  if (appId === "learn-cricket") {
    return APP_IMAGES["learn-cricket"];
  }

  // For other apps, randomly select 2 images
  const pool = [...APP_IMAGES.default];
  const selected = [];
  
  // Select first image
  const idx1 = Math.floor(Math.random() * pool.length);
  selected.push(pool[idx1]);
  pool.splice(idx1, 1);
  
  // Select second image
  const idx2 = Math.floor(Math.random() * pool.length);
  selected.push(pool[idx2]);
  
  return selected;
}

export default function UniversalLandingPage({
  appId,
  appName,
  title,
  description,
  features,
  isFree = false,
  heroGradient = "from-primary to-accent",
  metaDescription = null,
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
    setImages(getAppImages(appId));
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
        {/* Hero Section */}
        <section className={`relative bg-gradient-to-r ${heroGradient} text-white py-20 md:py-24 overflow-hidden`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left z-10 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  {appName}
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">
                  {description}
                </p>

                {/* Free App Notice */}
                {isFree && !user && (
                  <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto md:mx-0">
                    <p className="text-lg font-semibold">📝 Free Registration - Save Your Progress</p>
                    <p className="text-sm mt-2">
                      Create a free account to save your scores, track progress, and personalize your experience. 
                      All features are free for registered users!
                    </p>
                  </div>
                )}

                {/* Call to Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
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
                            {isFree ? "Register Free" : "Get Started"}
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
              </div>

              {/* Image Content */}
              <div className="flex-1 relative z-10 w-full">
                {images.length > 0 && (
                  <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-lg mx-auto" style={{ aspectRatio: '4/3', height: 'auto' }}>
                    <Image
                      src={`/images/${images[0]}`}
                      alt={`${appName} learning platform illustration`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

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
        {images.length > 1 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3', height: 'auto' }}>
                    <Image
                      src={`/images/${images[1]}`}
                      alt={`${appName} interactive learning experience`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
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
        )}
      </main>
    </>
  );
}
