"use client";

/**
 * Level Selector Component with Diagnostic Gatekeeper
 * 
 * Universal component for all app landing pages that:
 * 1. Displays "Where would you like to start?" with tier selection
 * 2. Shows diagnostic quiz for Intermediate/Advanced tiers
 * 3. Routes Basic tier users directly to sample module
 * 4. Enforces 30% passing threshold for higher tiers
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import DiagnosticQuiz from "./DiagnosticQuiz";
import GatekeeperQuiz from "./GatekeeperQuiz";
import { getGatekeeperQuestions, getSubjectName } from "../../lib/gatekeeperUtils";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    emoji: "🟢",
    title: "Logic Foundations",
    subtitle: "Zero to Literate in 60 mins",
    description: "Perfect for beginners - build your fundamental understanding from scratch",
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    emoji: "🔵",
    title: "System Dynamics",
    subtitle: "Solving complex interactions",
    description: "Apply concepts to real-world scenarios and complex problem patterns",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "advanced",
    name: "Advanced",
    emoji: "🟣",
    title: "Apex Mastery",
    subtitle: "Strategic prediction and command",
    description: "Master-level expertise, strategic optimization, and professional certification",
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-50",
  },
];

export default function LevelSelector({ 
  appName = "this course",
  appId = null, // App ID for gatekeeper questions (e.g., 'learn-math', 'learn-pr')
  sampleModuleUrl = "/modules/1/lesson/1",
  intermediateUrl = "/curriculum?level=intermediate",
  advancedUrl = "/curriculum?level=advanced",
  questions = [], // Optional: app-specific questions (legacy support)
  useGatekeeper = true // Set to true to use new gatekeeper logic (100% accuracy)
}) {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);

    if (tier.id === "basic") {
      // Basic tier: go directly to sample module
      router.push(sampleModuleUrl);
    } else {
      // Intermediate or Advanced: show diagnostic quiz
      setShowQuiz(true);
    }
  };

  const handleKeyPress = (event, tier) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTierSelect(tier);
    }
  };

  const handleQuizPass = () => {
    // User passed the quiz, redirect to appropriate level
    if (selectedTier.id === "intermediate") {
      router.push(intermediateUrl);
    } else if (selectedTier.id === "advanced") {
      router.push(advancedUrl);
    }
  };

  const handleQuizFail = () => {
    // User failed, redirect to Basic tier (sample module)
    router.push(sampleModuleUrl);
  };

  if (showQuiz && selectedTier) {
    // Get gatekeeper questions if appId is provided and useGatekeeper is true
    const gatekeeperQuestions = useGatekeeper && appId 
      ? getGatekeeperQuestions(appId, selectedTier.name)
      : [];
    
    // Determine which quiz component to use
    const hasGatekeeperQuestions = gatekeeperQuestions.length > 0;
    const quizQuestions = hasGatekeeperQuestions ? gatekeeperQuestions : questions;
    const subjectName = appId ? getSubjectName(appId) : appName;
    
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedTier.emoji} {selectedTier.name} Tier {hasGatekeeperQuestions ? 'Gatekeeper' : 'Diagnostic'}
            </h2>
            <p className="text-lg text-gray-600">
              {hasGatekeeperQuestions 
                ? `Answer all 3 questions correctly to unlock the ${selectedTier.name} tier`
                : `Answer these 5 questions to verify you're ready for the ${selectedTier.name} tier`
              }
            </p>
          </motion.div>

          {hasGatekeeperQuestions ? (
            <GatekeeperQuiz
              tier={selectedTier.name}
              subject={subjectName}
              appName={appName}
              onPass={handleQuizPass}
              onFail={handleQuizFail}
              questions={quizQuestions}
            />
          ) : (
            <DiagnosticQuiz
              tier={selectedTier.name}
              appName={appName}
              onPass={handleQuizPass}
              onFail={handleQuizFail}
              questions={quizQuestions}
            />
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Opening Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Where would you like to start?
          </h2>
          <p className="text-xl text-gray-600">
            Choose your learning path based on your current knowledge level
          </p>
        </motion.div>

        {/* Tier Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
            >
              <div 
                role="button"
                tabIndex={0}
                onClick={() => handleTierSelect(tier)}
                onKeyPress={(e) => handleKeyPress(e, tier)}
                className={`rounded-2xl p-6 border-4 ${tier.borderColor} ${tier.bgColor} shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col focus:outline-none focus:ring-4 focus:ring-blue-500`}
              >
                {/* Emoji Icon */}
                <div className="text-center mb-4">
                  <div className="text-7xl mb-3">{tier.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {tier.name}
                  </h3>
                  <p className={`text-xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                    {tier.title}
                  </p>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {tier.subtitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    {tier.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-auto pt-6">
                  <button
                    className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${tier.color}`}
                  >
                    {tier.id === "basic" ? "Start Learning →" : "Take Diagnostic →"}
                  </button>
                </div>

                {/* Info Badge */}
                {tier.id !== "basic" && (
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-600 border border-gray-300">
                      🔒 Requires gatekeeper test (100% accuracy)
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 max-w-3xl">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              📊 How It Works
            </h4>
            <div className="text-left text-gray-700 space-y-2">
              <p className="flex items-start">
                <span className="text-green-500 mr-2 flex-shrink-0">🟢</span>
                <span><strong>Basic:</strong> Start learning immediately - perfect for beginners</span>
              </p>
              <p className="flex items-start">
                <span className="text-blue-500 mr-2 flex-shrink-0">🔵</span>
                <span><strong>Intermediate:</strong> Take a 3-question gatekeeper test (100% accuracy required)</span>
              </p>
              <p className="flex items-start">
                <span className="text-purple-500 mr-2 flex-shrink-0">🟣</span>
                <span><strong>Advanced:</strong> Take a 3-question gatekeeper test (100% accuracy required)</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
