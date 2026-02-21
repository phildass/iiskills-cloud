"use client";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentUser } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  const allTests = [
    {
      href: "/tests/numerical",
      emoji: "💰",
      title: "Numerical Ability",
      description: "Master arithmetic, percentages, ratios, and financial calculations",
      meta: "8 questions · ~15 min",
      careers: ["Banking", "Finance", "Engineering"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      href: "/tests/logical",
      emoji: "🧩",
      title: "Logical Reasoning",
      description: "Sharpen pattern recognition, syllogisms, and coding-decoding",
      meta: "8 questions · ~15 min",
      careers: ["Consulting", "Programming", "Strategy"],
      color: "from-purple-500 to-pink-500",
    },
    {
      href: "/tests/verbal",
      emoji: "🎤",
      title: "Verbal Ability",
      description: "Excel in grammar, reading comprehension, and communication",
      meta: "8 questions · ~15 min",
      careers: ["Marketing", "Management", "Sales"],
      color: "from-green-500 to-emerald-500",
    },
    {
      href: "/tests/spatial",
      emoji: "🏗️",
      title: "Spatial / Abstract",
      description: "Visualize 3D figures, rotations, and spatial patterns",
      meta: "8 questions · ~15 min",
      careers: ["Architecture", "Design", "UI/UX"],
      color: "from-orange-500 to-red-500",
    },
    {
      href: "/tests/data-interpretation",
      emoji: "📊",
      title: "Data Interpretation",
      description: "Analyze charts, tables, and extract meaningful insights",
      meta: "8 questions · ~15 min",
      careers: ["Analytics", "Research", "Data Science"],
      color: "from-indigo-500 to-violet-500",
    },
    {
      href: "/tests/quick-fire",
      emoji: "⚡",
      title: "Quick-Fire",
      description: "5-minute timed dash across all domains — get your complete Aptitude Signature!",
      meta: "15 questions · ~5 min",
      careers: ["All Domains"],
      color: "from-yellow-500 to-orange-500",
    },
    {
      href: "/tests/general-short",
      emoji: "🚀",
      title: "General Purpose – Short",
      description: "Quick 7-question assessment covering mixed aptitude skills",
      meta: "7 questions · ~10 min",
      careers: ["Practice", "Warm-up"],
      color: "from-teal-500 to-cyan-600",
    },
    {
      href: "/tests/general-elaborate",
      emoji: "🎯",
      title: "General Purpose – Elaborate",
      description: "Comprehensive 120-question deep-dive across all aptitude areas",
      meta: "120 questions · ~90 min",
      careers: ["Placement Prep", "Full Assessment"],
      color: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <>
      <Head>
        <title>iiskills-aptitude - Master Aptitude & Cognitive Skills</title>
        <meta name="description" content="Discover your cognitive superpowers with our scientific diagnostic engine. Test across 5 domains, get your Brain-Print, and unlock your career potential." />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section - Full-width with background image */}
        <section className="relative overflow-hidden h-[70vh] min-h-[400px]">
          {/* Background Image */}
          <Image
            src="/images/iiskills-apt-heo.jpg"
            alt="Aptitude Assessment Hero"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />

          {/* Headline and subheadline at bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl sm:text-6xl font-bold text-white mb-3 drop-shadow-lg"
              >
                Master Your Aptitude
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg sm:text-2xl text-yellow-200 font-semibold drop-shadow-md"
              >
                Universal Scientific Diagnostic Engine — 5 Domains, 1 Brain-Print
              </motion.p>
            </div>
          </div>
        </section>

        {/* Light Yellow Background Content Section */}
        <div className="bg-yellow-50">

          {/* CTA Buttons below hero */}
          {!user && (
            <section className="py-10 px-4 sm:px-6 lg:px-8 bg-yellow-100">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link
                    href="/test/diagnostic"
                    className="inline-block px-10 py-4 bg-yellow-600 text-white text-xl font-bold rounded-2xl hover:bg-yellow-700 transition-all shadow-lg transform hover:scale-105 text-center"
                  >
                    🚀 Start My Diagnostics
                  </Link>
                  <Link
                    href="/tests"
                    className="inline-block px-10 py-4 bg-white border-2 border-yellow-600 text-yellow-700 text-xl font-bold rounded-2xl hover:bg-yellow-50 transition-all transform hover:scale-105 text-center"
                  >
                    📊 Browse All Tests
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

          {user && (
            <section className="py-10 px-4 sm:px-6 lg:px-8 bg-yellow-100">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.user_metadata?.first_name || 'Explorer'}! 🎯
                  </h3>
                  <p className="text-lg text-gray-700">
                    Choose a cognitive domain to begin your diagnostic journey
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                      href="/tests"
                      className="px-8 py-4 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-all shadow-lg"
                    >
                      📊 View All Tests
                    </Link>
                    <Link
                      href="/test/quick-fire"
                      className="px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg"
                    >
                      ⚡ Quick-Fire Challenge
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {/* All Tests Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  All Tests
                </h2>
                <p className="text-xl text-gray-600">
                  8 modules · 8 tests — pick any and start immediately
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTests.map((test, index) => (
                  <motion.div
                    key={test.href}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ scale: 1.03 }}
                    className="group"
                  >
                    <div className="relative bg-white rounded-2xl p-6 border border-yellow-200 hover:border-yellow-500 transition-all shadow-md hover:shadow-yellow-200 flex flex-col h-full">
                      <div className="text-5xl mb-3">{test.emoji}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{test.title}</h3>
                      <p className="text-sm text-yellow-800 font-medium mb-2">{test.meta}</p>
                      <p className="text-gray-600 mb-4 flex-1">{test.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {test.careers.map(career => (
                          <span
                            key={career}
                            className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${test.color} text-white`}
                          >
                            {career}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={test.href}
                        className="block w-full text-center py-3 px-4 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-all"
                      >
                        Start
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-yellow-100">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  The Diagnostic Experience
                </h2>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { emoji: "🎯", title: "Adaptive Difficulty", desc: "Get 3 right in a row? We boost difficulty by 20% to challenge your peak performance." },
                  { emoji: "🧠", title: "Brain-Print Generator", desc: "Get a unique SVG graphic showing your skill distribution across all cognitive domains.", delay: 0.1 },
                  { emoji: "💼", title: "Career Mapping", desc: "Auto-sync your results with Career Mapper for real-time market value and pathway insights.", delay: 0.2 },
                  { emoji: "✨", title: "Insight Pop-ups", desc: "Every 5 questions, get Brain Facts comparing your performance to top professionals.", delay: 0.3 },
                  { emoji: "🏆", title: "Live Leaderboard", desc: "See top scorers in India for the current hour, ranked by domain and overall score.", delay: 0.4 },
                  { emoji: "💎", title: "Superpower Reveals", desc: 'Unlock titles like "Pro Banker", "Strategic Genius", or "Design Visionary" based on performance.', delay: 0.5 },
                ].map((feature) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: feature.delay || 0 }}
                    className="text-center bg-white rounded-2xl p-6 shadow-sm border border-yellow-200"
                  >
                    <div className="text-5xl mb-4">{feature.emoji}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Sample Insights Section */}
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  What You&apos;ll Discover
                </h2>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white"
                >
                  <p className="text-lg font-semibold mb-2">💡 Spatial IQ: 145</p>
                  <p className="text-white/90">
                    Top 5% for Architect/UI roles. Your brain processes visual information exceptionally well!
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white"
                >
                  <p className="text-lg font-semibold mb-2">💰 Financial Literacy: Pro Banker</p>
                  <p className="text-white/90">
                    Check Main Domain for Banking pathways. Skills valued at ₹12-18 LPA starting salary.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
                >
                  <p className="text-lg font-semibold mb-2">🎯 Strategic Genius Unlocked</p>
                  <p className="text-white/90">
                    Your systematic thinking places you in consulting territory. Next step: Explore Management Consulting careers.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final CTA Section */}
          {!user && (
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-yellow-100">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl p-12 text-center shadow-xl"
                >
                  <h3 className="text-4xl font-bold text-white mb-4">
                    Ready to Unlock Your Superpowers?
                  </h3>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Join thousands discovering their cognitive strengths. Get your Brain-Print and career insights today — 100% free!
                  </p>
                  <Link
                    href="/test/diagnostic"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="inline-block px-12 py-5 bg-white text-yellow-700 rounded-2xl font-bold text-xl hover:bg-yellow-50 transition-all shadow-2xl transform hover:scale-105"
                  >
                    🚀 Start My Diagnostics
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
