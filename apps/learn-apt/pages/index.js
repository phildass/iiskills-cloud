"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../../components/shared/InstallApp";
import TranslationFeatureBanner from "../../components/shared/TranslationFeatureBanner";
import { getLandingPageImages, getPlaceholderImage } from "../lib/imageUtils";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Get images for this app
    const appImages = getLandingPageImages("apt");
    setImages(appImages);
  }, []);

  return (
    <>
      <Head>
        <title>Learn Aptitude - iiskills.cloud</title>
        <meta name="description" content="Develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams" />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section - Matches main landing page design */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-white py-20 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex-1 text-center md:text-left z-10 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Learn Aptitude
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">
                  Develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams
                </p>

                {!user && (
                  <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto md:mx-0">
                    <p className="text-lg font-semibold">
                      📝 Free Registration - Save Your Progress
                    </p>
                    <p className="text-sm mt-2">
                      Create a free account to save your scores, track progress, and personalize your experience. All features are free for registered users!
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  {user ? (
                    <Link
                      href="/learn"
                      className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                    >
                      Start Free Course →
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                      >
                        Register Free Account
                      </Link>
                      <Link
                        href="/learn"
                        className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all duration-200 text-center text-base sm:text-lg"
                      >
                        Already Have Account? Sign In
                      </Link>
                    </>
                  )}
                  <InstallApp appName="Learn Aptitude" />
                </div>
              </div>

              {/* Hero Image - First Image */}
              {images[0] && (
                <div className="flex-1 relative z-10 w-full">
                  <div
                    className="relative rounded-xl overflow-hidden shadow-2xl max-w-lg mx-auto"
                    style={{ aspectRatio: "4/3", height: "auto" }}
                  >
                    <Image
                      src={images[0]}
                      alt={`Learn Aptitude - Hero Image`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      onError={(e) => {
                        e.target.src = getPlaceholderImage();
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Translation Feature Banner */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TranslationFeatureBanner />
          </div>
        </section>

        {/* Features Section - Matches main landing page design */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-8">
              What You'll Learn
            </h2>

            {/* Second Image */}
            {images[1] && (
              <div className="flex justify-center mb-12">
                <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={images[1]}
                    alt={`Learn Aptitude - Features Image`}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = getPlaceholderImage();
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">🧮</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Logical Reasoning</h3>
                <p className="text-charcoal leading-relaxed">
                  Master logical thinking patterns and problem-solving techniques essential for success.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Quantitative Aptitude</h3>
                <p className="text-charcoal leading-relaxed">
                  Build strong mathematical and analytical skills for competitive examinations.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Practice Tests</h3>
                <p className="text-charcoal leading-relaxed">
                  Test your knowledge with comprehensive practice sets and mock examinations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Matches main landing page design */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of learners building skills for tomorrow
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
