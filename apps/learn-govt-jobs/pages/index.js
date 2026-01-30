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
    const appImages = getLandingPageImages("govt-jobs");
    setImages(appImages);
  }, []);

  return (
    <>
      <Head>
        <title>Learn Government Jobs Preparation - iiskills.cloud</title>
        <meta name="description" content="Comprehensive preparation for government job examinations and competitive tests" />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section - Matches main landing page design */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-white py-20 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="flex-1 text-center md:text-left z-10 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Learn Government Jobs Preparation
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">
                  Comprehensive preparation for government job examinations and competitive tests
                </p>

                {!user && (
                  <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 max-w-2xl mx-auto md:mx-0">
                    <p className="text-lg font-semibold">
                      📝 Registration Required
                    </p>
                    <p className="text-sm mt-2">
                      Create a free account to access all learning content. Register once, access all iiskills.cloud apps!
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  {user ? (
                    <Link
                      href="/learn"
                      className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg"
                    >
                      Start Preparation →
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
                  <InstallApp appName="Learn Government Jobs Preparation" />
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
                      alt={`Learn Government Jobs Preparation - Hero Image`}
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
                    alt={`Learn Government Jobs Preparation - Features Image`}
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
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Exam-Focused Content</h3>
                <p className="text-charcoal leading-relaxed">
                  Targeted material covering all major government examination patterns.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">��</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Practice Papers</h3>
                <p className="text-charcoal leading-relaxed">
                  Extensive mock tests and previous year question papers with solutions.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-accent mb-4">Strategy & Tips</h3>
                <p className="text-charcoal leading-relaxed">
                  Expert guidance on exam strategy, time management, and success techniques.
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
