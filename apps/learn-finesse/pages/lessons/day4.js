"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import PremiumAccessPrompt from "../../components/PremiumAccessPrompt";

const CULTURAL_CONTEXTS = {
  western: {
    title: "Western Context",
    color: "blue",
    greeting: "Firm Handshake",
    details: [
      "2-3 pumps, web-to-web contact",
      "Direct eye contact, confident smile",
      "Firmness signals confidence (avoid bone-crushers)",
      "Stand up when greeting someone"
    ],
    nuance: "Firmness matters - too weak seems uncertain, too strong seems aggressive. The 'web' is the area between your thumb and index finger."
  },
  indian: {
    title: "Indian Context",
    color: "orange",
    greeting: "Namaste or Soft Handshake",
    details: [
      "Namaste: Palms together, slight bow",
      "Wait for elder/senior to initiate handshake",
      "Softer handshake than Western style",
      "Respect hierarchy - 'Sir/Ma'am' usage"
    ],
    nuance: "The 'Indian head shake' can mean yes, no, or maybe - context matters. Elders and high officials initiate contact."
  },
  eastern: {
    title: "Eastern Context (Japan/China/Singapore)",
    color: "red",
    greeting: "Bowing",
    details: [
      "15-30° bow for business contexts",
      "Eyes down, hands at sides or in lap (when seated)",
      "Deeper bow = more respect",
      "Two hands when presenting/receiving objects"
    ],
    nuance: "Bow depth communicates respect level. 15° is casual, 30° is standard business, 45°+ is deep respect or apology."
  }
};

export default function Day4Lesson() {
  const [selectedContext, setSelectedContext] = useState("western");
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  const handleQuizSubmit = (answer) => {
    setQuizAnswer(answer);
    setShowFeedback(true);
    // Show premium prompt if they got the correct answer
    if (answer === "B") {
      setTimeout(() => setShowPremiumPrompt(true), 2000); // Show after 2 seconds
    }
  };

  const context = CULTURAL_CONTEXTS[selectedContext];

  return (
    <>
      <Head>
        <title>Day 4: The Global Greeting - Learn Finesse | iiskills.cloud</title>
        <meta name="description" content="Master greetings across Western, Indian, and Eastern cultures" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-bold text-sm mb-4">
              DAY 4 • Phase 2: Engagement
            </div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text finesse-gradient mb-4">
              The Global Greeting
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Handshakes, Namastes, & Bows
            </p>
          </motion.div>

          {/* Core Lesson */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Core Lesson</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-6 border-l-4 border-indigo-500">
              <p className="text-lg text-gray-800 font-semibold mb-2">
                ⏱️ First impressions matter: 7 seconds to set the tone
              </p>
              <p className="text-gray-700">
                Your greeting is the gateway to every professional relationship. The way you greet
                someone signals confidence, respect, and cultural awareness. A mismatched greeting
                can create friction before you even speak.
              </p>
            </div>
          </motion.div>

          {/* Cultural Pivot Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Cultural Pivot</h2>
            
            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => setSelectedContext("western")}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedContext === "western"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Western Context
              </button>
              <button
                onClick={() => setSelectedContext("indian")}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedContext === "indian"
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                }`}
              >
                Indian Context
              </button>
              <button
                onClick={() => setSelectedContext("eastern")}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedContext === "eastern"
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Eastern Context
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedContext}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">
                    {selectedContext === "western" && "🤝"}
                    {selectedContext === "indian" && "🙏"}
                    {selectedContext === "eastern" && "🙇"}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800">{context.greeting}</h3>
                </div>

                <ul className="space-y-3 mb-6">
                  {context.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-indigo-500 mr-2">✓</span>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                  <p className="font-semibold text-gray-800 mb-2">💡 Cultural Nuance:</p>
                  <p className="text-gray-700 italic">{context.nuance}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Visual Guide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Visual Guide: Bow Angles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-red-50 rounded-lg p-6 mb-3 border-2 border-red-200">
                  <div className="text-6xl mb-2">📐</div>
                  <div className="font-bold text-red-800 text-xl">15°</div>
                </div>
                <p className="font-semibold text-gray-800">Casual</p>
                <p className="text-sm text-gray-600">Informal greetings, colleagues</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-50 rounded-lg p-6 mb-3 border-2 border-orange-200">
                  <div className="text-6xl mb-2">📐</div>
                  <div className="font-bold text-orange-800 text-xl">30°</div>
                </div>
                <p className="font-semibold text-gray-800">Standard Business</p>
                <p className="text-sm text-gray-600">Professional meetings, clients</p>
              </div>
              <div className="text-center">
                <div className="bg-yellow-50 rounded-lg p-6 mb-3 border-2 border-yellow-200">
                  <div className="text-6xl mb-2">📐</div>
                  <div className="font-bold text-yellow-800 text-xl">45°+</div>
                </div>
                <p className="font-semibold text-gray-800">Deep Respect/Apology</p>
                <p className="text-sm text-gray-600">High officials, sincere apologies</p>
              </div>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl shadow-lg p-8 text-white mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">🎯 Your Mission</h2>
            <p className="text-lg mb-4">
              Record yourself performing all three greetings: Western handshake, Indian namaste,
              and Eastern bow. Aim for style accuracy.
            </p>
            <ul className="space-y-2 mb-6">
              <li>• Practice in front of a mirror first</li>
              <li>• Pay attention to posture, eye contact, and hand placement</li>
              <li>• Review your recording - which greeting felt most natural?</li>
              <li>• Which one needs more practice? That is your growth edge!</li>
            </ul>
            <button className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:shadow-xl transition-all">
              Upload Your Practice Video
            </button>
          </motion.div>

          {/* Scenario Quiz */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Test Your Understanding</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                📋 Scenario: You are attending an international business conference. A senior
                Japanese executive approaches you. What do you do?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleQuizSubmit("A")}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  quizAnswer === "A"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span className="font-bold text-gray-800">A)</span> Extend your hand for a firm
                handshake with direct eye contact
              </button>
              <button
                onClick={() => handleQuizSubmit("B")}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  quizAnswer === "B"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span className="font-bold text-gray-800">B)</span> Bow 30° with eyes down, hands at
                sides, then wait for them to initiate handshake if desired
              </button>
              <button
                onClick={() => handleQuizSubmit("C")}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  quizAnswer === "C"
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <span className="font-bold text-gray-800">C)</span> Perform a namaste with palms
                together
              </button>
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-6 ${
                  quizAnswer === "B"
                    ? "bg-green-50 border-2 border-green-400"
                    : "bg-red-50 border-2 border-red-400"
                }`}
              >
                <h3 className="font-bold text-xl mb-2">
                  {quizAnswer === "B" ? "✅ Correct!" : "❌ Not Quite"}
                </h3>
                <p className="text-gray-800 mb-3">
                  {quizAnswer === "A" &&
                    "Western handshake is too direct for Japanese context. Direct eye contact can be seen as aggressive. A bow shows cultural awareness and respect."}
                  {quizAnswer === "B" &&
                    "Perfect! A 30° bow shows respect and business professionalism. Waiting for them to initiate a handshake (if they prefer Western-style) demonstrates adaptability."}
                  {quizAnswer === "C" &&
                    "Namaste is Indian, not Japanese. This shows cultural confusion. In Japan, a bow is the appropriate greeting."}
                </p>
                <button
                  onClick={() => {
                    setQuizAnswer(null);
                    setShowFeedback(false);
                  }}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Try Another Scenario →
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all">
              ← Day 3: Digital Real Estate
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all">
              Day 5: Elevator Pitch →
            </button>
          </div>
        </div>
      </div>

      {/* Premium Access Prompt */}
      {showPremiumPrompt && (
        <PremiumAccessPrompt
          appName="Learn Finesse"
          appHighlight="Master social intelligence, executive presence, and the logic of power dynamics. Complete the 10-day bootcamp across Western, Indian, and Eastern cultures."
          onCancel={() => setShowPremiumPrompt(false)}
        />
      )}
    </>
  );
}
