"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentUser } from "../lib/supabaseClient";
import { COGNITIVE_DOMAINS } from "../lib/questionBank";

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

  const cognitiveModules = [
    {
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      emoji: "💰",
      title: "Numerical Ability",
      description: "Master arithmetic, percentages, ratios, and financial calculations",
      careers: ["Banking", "Finance", "Engineering"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      domain: COGNITIVE_DOMAINS.LOGICAL,
      emoji: "🧩",
      title: "Logical Reasoning",
      description: "Sharpen pattern recognition, syllogisms, and coding-decoding",
      careers: ["Consulting", "Programming", "Strategy"],
      color: "from-purple-500 to-pink-500"
    },
    {
      domain: COGNITIVE_DOMAINS.VERBAL,
      emoji: "🎤",
      title: "Verbal Ability",
      description: "Excel in grammar, reading comprehension, and communication",
      careers: ["Marketing", "Management", "Sales"],
      color: "from-green-500 to-emerald-500"
    },
    {
      domain: COGNITIVE_DOMAINS.SPATIAL,
      emoji: "🏗️",
      title: "Spatial/Abstract",
      description: "Visualize 3D figures, rotations, and spatial patterns",
      careers: ["Architecture", "Design", "UI/UX"],
      color: "from-orange-500 to-red-500"
    },
    {
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      emoji: "📊",
      title: "Data Interpretation",
      description: "Analyze charts, tables, and extract meaningful insights",
      careers: ["Analytics", "Research", "Data Science"],
      color: "from-indigo-500 to-violet-500"
    }
  ];

  return (
    <>
      <Head>
        <title>Learn Apt - Universal Diagnostic Engine | iiskills.cloud</title>
        <meta name="description" content="Discover your cognitive superpowers with our scientific diagnostic engine. Test across 5 domains, get your Brain-Print, and unlock your career potential." />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        {/* Hero Section - Midnight Blue & Electric Violet Theme */}
        <section className="relative overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-72 h-72 bg-electric-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6 max-w-4xl mx-auto"
            >
              <motion.div
                className="inline-block text-6xl md:text-8xl mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧠
              </motion.div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 via-blue-400 to-cyan-400">
                Learn Apt
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl text-electric-violet-300 font-semibold">
                Universal Scientific Diagnostic Engine
              </p>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover your cognitive superpowers across 5 scientific domains. Get your unique Brain-Print and unlock precise career pathways with AI-powered insights.
              </p>
              
              {!user && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8"
                >
                  <Link
                    href="/register"
                    className="inline-block px-10 py-5 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white text-xl font-bold rounded-2xl hover:from-electric-violet-600 hover:to-blue-600 transition-all shadow-2xl hover:shadow-electric-violet-500/50 transform hover:scale-105"
                  >
                    🚀 Start Your Diagnostic Journey
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>


        {/* Cognitive Domains Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-4">
                5 Cognitive Domains
              </h2>
              <p className="text-xl text-gray-300">
                Each module ends with an Addictive Superpower Reveal
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cognitiveModules.map((module, index) => (
                <motion.div
                  key={module.domain}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  {/* Glassmorphism Card */}
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-electric-violet-400 transition-all shadow-xl hover:shadow-electric-violet-500/30">
                    <div className="text-5xl mb-4">{module.emoji}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                    <p className="text-gray-300 mb-4">{module.description}</p>
                    
                    {/* Career Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {module.careers.map(career => (
                        <span
                          key={career}
                          className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${module.color} text-white`}
                        >
                          {career}
                        </span>
                      ))}
                    </div>

                    {user && (
                      <Link
                        href={`/test/${module.domain.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block w-full text-center py-3 px-4 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white rounded-lg font-semibold hover:from-electric-violet-600 hover:to-blue-600 transition-all"
                      >
                        Test This Domain
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Quick-Fire Module */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-electric-violet-600 to-blue-600 rounded-2xl p-6 border-2 border-electric-violet-400 shadow-2xl hover:shadow-electric-violet-500/50 transition-all">
                  <div className="text-5xl mb-4">⚡</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quick-Fire Module</h3>
                  <p className="text-white/90 mb-4">
                    5-minute timed dash across all domains. Get your complete Aptitude Signature!
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white">
                      All Domains
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white">
                      5 Minutes
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white">
                      15 Questions
                    </span>
                  </div>

                  {user && (
                    <Link
                      href="/test/quick-fire"
                      className="block w-full text-center py-3 px-4 bg-white text-electric-violet-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
                    >
                      🔥 Start Quick-Fire
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - What Makes Us Different */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-midnight-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-4">
                The Diagnostic Experience
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">Adaptive Difficulty</h3>
                <p className="text-gray-300">
                  Get 3 right in a row? We boost difficulty by 20% to challenge your peak performance.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold text-white mb-3">Brain-Print Generator</h3>
                <p className="text-gray-300">
                  Get a unique SVG graphic showing your skill distribution across all cognitive domains.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-white mb-3">Career Mapping</h3>
                <p className="text-gray-300">
                  Auto-sync your results with Career Mapper for real-time market value and pathway insights.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-white mb-3">Insight Pop-ups</h3>
                <p className="text-gray-300">
                  Every 5 questions, get Brain Facts comparing your performance to top professionals.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-3">Live Leaderboard</h3>
                <p className="text-gray-300">
                  See top scorers in India for the current hour, ranked by domain and overall score.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-2xl font-bold text-white mb-3">Superpower Reveals</h3>
                <p className="text-gray-300">
                  Unlock titles like "Pro Banker", "Strategic Genius", or "Design Visionary" based on performance.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sample Insights Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-4">
                What You'll Discover
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

        {/* CTA Section */}
        {!user && (
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-electric-violet-600 to-blue-600 rounded-3xl p-12 text-center shadow-2xl"
              >
                <h3 className="text-4xl font-bold text-white mb-4">
                  Ready to Unlock Your Superpowers?
                </h3>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Join thousands discovering their cognitive strengths. Get your Brain-Print and career insights today - 100% free!
                </p>
                <Link
                  href="/register"
                  className="inline-block px-12 py-5 bg-white text-electric-violet-600 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105"
                >
                  🚀 Start Free Diagnostic
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {user && (
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-bold text-white">
                  Welcome back, {user?.user_metadata?.first_name || 'Explorer'}! 🎯
                </h3>
                <p className="text-xl text-gray-300">
                  Choose a cognitive domain to begin your diagnostic journey
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link
                    href="/tests"
                    className="px-8 py-4 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white rounded-xl font-semibold hover:from-electric-violet-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    📊 View All Tests
                  </Link>
                  <Link
                    href="/test/quick-fire"
                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                  >
                    ⚡ Quick-Fire Challenge
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
