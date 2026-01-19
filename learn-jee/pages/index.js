import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../components/shared/InstallApp";

import { getPricingDisplay, getIntroOfferNotice } from "../utils/pricing";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const pricing = getPricingDisplay();
  const introNotice = getIntroOfferNotice();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);
  return (
    <>
      <Head>
        <title>Learn JEE - iiskills.cloud</title>

        <meta
          name="description"
          content="Master JEE preparation with AI-generated lessons covering Physics, Chemistry, and Mathematics. Free preview of first chapter available!"
        />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section with Cover Image */}
        <section className="relative">
          {/* Cover Image - using a gradient background for now */}
          <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Hero Content Over Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Learn JEE</h1>
                <p className="text-2xl md:text-3xl mb-4 max-w-3xl mx-auto drop-shadow-lg">
                  Master Physics, Chemistry, and Mathematics for JEE preparation
                </p>
                <p className="text-xl mb-6 max-w-2xl mx-auto drop-shadow-lg">
                  Comprehensive course designed for engineering entrance exam success
                </p>

                {/* Pricing Badge */}
                <div className="inline-block bg-accent text-white px-8 py-4 rounded-lg mb-8 shadow-2xl">
                  <div className="text-xl font-semibold mb-1">Full Course Access</div>
                  <div className="text-4xl font-bold">
                    ₹499 <span className="text-lg font-normal">+ GST ₹89.82</span>
                  </div>
                  <div className="text-sm mt-1 opacity-90">Total: ₹588.82</div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  {user ? (
                    <Link
                      href="/learn"
                      className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                    >
                      Continue Learning →
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                      >
                        Get Started Free
                      </Link>
                      <Link
                        href="/login"
                        className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                  <InstallApp appName="Learn JEE" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introductory Offer Banner */}
        {introNotice && (
          <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="text-lg font-semibold">{introNotice}</p>
            </div>
          </section>
        )}

        {/* Course Preview Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">What You'll Learn</h2>
            <p className="text-center text-lg text-charcoal mb-12">
              Get free access to the first lesson. Full course includes comprehensive coverage of
              all JEE topics!
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-neutral p-8 rounded-lg shadow-lg border-t-4 border-blue-500">
                <div className="text-5xl mb-4">⚛️</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Physics</h3>
                <p className="text-charcoal mb-4">
                  Master mechanics, thermodynamics, electromagnetism, optics, and modern physics
                  with AI-generated lessons and practice problems.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mechanics & Motion</li>
                  <li>• Thermodynamics</li>
                  <li>• Electromagnetism</li>
                  <li>• Modern Physics</li>
                </ul>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg border-t-4 border-green-500">
                <div className="text-5xl mb-4">🧪</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Chemistry</h3>
                <p className="text-charcoal mb-4">
                  Complete coverage of physical, organic, and inorganic chemistry with reactions,
                  mechanisms, and problem-solving techniques.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Physical Chemistry</li>
                  <li>• Organic Chemistry</li>
                  <li>• Inorganic Chemistry</li>
                  <li>• Chemical Reactions</li>
                </ul>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg border-t-4 border-purple-500">
                <div className="text-5xl mb-4">📐</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Mathematics</h3>
                <p className="text-charcoal mb-4">
                  Advanced algebra, calculus, coordinate geometry, and trigonometry with
                  step-by-step problem-solving strategies.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Algebra & Calculus</li>
                  <li>• Coordinate Geometry</li>
                  <li>• Trigonometry</li>
                  <li>• Problem Solving</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Course Preview Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">Course Preview</h2>
            <p className="text-center text-lg text-charcoal mb-12">
              Get free access to Chapter 1, Lesson 1. Full course includes 10 comprehensive chapters
              covering Physics, Chemistry, and Mathematics!
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-primary mb-4">10 Comprehensive Chapters</h3>
                <p className="text-charcoal">
                  Structured learning modules covering Physics, Chemistry, and Mathematics with
                  AI-generated lessons and quizzes.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-primary mb-4">AI-Powered Content</h3>
                <p className="text-charcoal">
                  Interactive lessons, practice problems, and personalized quizzes generated by AI
                  for optimal learning.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-primary mb-4">JEE-Focused Preparation</h3>
                <p className="text-charcoal">
                  Content specifically designed for JEE Main and Advanced, with strategies and
                  problem-solving techniques.
                </p>
              </div>
            </div>

            {/* Free Preview Notice */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-2">🎁 Try Before You Buy</h3>
              <p className="text-lg text-gray-700">
                Chapter 1, Lesson 1 is completely FREE! Sign up to preview the course content before
                purchasing.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">Course Features</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
                <p className="text-gray-600">
                  Intelligent lessons and quizzes tailored to JEE syllabus
                </p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-600">All topics from Physics, Chemistry, and Mathematics</p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Practice Quizzes</h3>
                <p className="text-gray-600">Test your knowledge with topic-wise assessments</p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">⏱️</div>
                <h3 className="text-xl font-bold mb-2">Exam Strategies</h3>
                <p className="text-gray-600">
                  Learn time management and problem-solving techniques
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subject Coverage */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">What You'll Learn</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">⚛️ Physics</h3>
                <ul className="space-y-2 text-charcoal">
                  <li>• Mechanics & Motion</li>
                  <li>• Thermodynamics</li>
                  <li>• Electromagnetism</li>
                  <li>• Optics & Waves</li>
                  <li>• Modern Physics</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">🧪 Chemistry</h3>
                <ul className="space-y-2 text-charcoal">
                  <li>• Physical Chemistry</li>
                  <li>• Organic Chemistry</li>
                  <li>• Inorganic Chemistry</li>
                  <li>• Chemical Bonding</li>
                  <li>• Reactions & Mechanisms</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-green-600 mb-4">📐 Mathematics</h3>
                <ul className="space-y-2 text-charcoal">
                  <li>• Calculus & Derivatives</li>
                  <li>• Algebra & Equations</li>
                  <li>• Coordinate Geometry</li>
                  <li>• Trigonometry</li>
                  <li>• Probability & Statistics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Begin Your JEE Journey?</h2>
            <p className="text-xl mb-6">
              Join thousands of students preparing for JEE with iiskills.cloud
            </p>

            {/* Pricing Display */}
            <div className="bg-white text-primary rounded-lg p-6 mb-6 inline-block">
              <div className="text-2xl font-bold mb-2">Complete Course Access</div>
              <div className="text-5xl font-bold text-accent mb-2">{pricing.basePrice}</div>
              <div className="text-lg mb-1">+ GST {pricing.gstAmount}</div>
              <div className="text-xl font-semibold border-t-2 border-gray-300 pt-2">
                Total: {pricing.totalPrice}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                One-time payment • Lifetime access • Free first lesson
              </p>
            </div>

            {!user && (
              <div>
                <Link
                  href="/register"
                  className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                  Start Free Preview
                </Link>
                <p className="text-sm mt-3 opacity-90">No credit card required for preview</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
