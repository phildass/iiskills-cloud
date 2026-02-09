"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIOS = [
  {
    id: 1,
    level: "Level 2",
    title: "The Subtle Interruption",
    context: "A peer points out a typo during your presentation.",
    choices: [
      {
        id: "A",
        text: "Fire back with an aggressive retort",
        feedback: "Defensive aggression undermines your credibility. You've revealed insecurity.",
        logic: "Aggression signals you're rattled. Authority doesn't defend; it redirects.",
        isCorrect: false,
      },
      {
        id: "B",
        text: "Apologize profusely and lose momentum",
        feedback: "Submission diminishes your expertise. Over-apologizing broadcasts weakness.",
        logic: "Excessive apology suggests you're uncertain of your value. Leaders acknowledge and move forward.",
        isCorrect: false,
      },
      {
        id: "C",
        text: "\"Good catch – that's the attention to detail we need for execution.\" [Continue unfazed.]",
        feedback: "Perfect. You've reframed the interruption as validation, maintained authority, and redirected focus.",
        logic: "This is the Finesse Pivot: acknowledge without apologizing, reframe as team strength, maintain control. The typo becomes proof of collective diligence.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    level: "Level 3",
    title: "High-Stakes Negotiation",
    context: "Employer rejects your salary offer and stares at you silently, waiting for your response.",
    choices: [
      {
        id: "A",
        text: "Immediately lower your ask to break the tension",
        feedback: "You just sold yourself short. Silence made you blink first.",
        logic: "He who speaks first in a negotiation loses. Discomfort is a tool, not a threat.",
        isCorrect: false,
      },
      {
        id: "B",
        text: "Defend your number with more justification",
        feedback: "Over-explaining signals doubt. You're negotiating with yourself.",
        logic: "Justification dilutes power. Your initial case was enough. Silence is your ally, not your enemy.",
        isCorrect: false,
      },
      {
        id: "C",
        text: "Hold pleasant eye contact. Say nothing. Let the vacuum do the work.",
        feedback: "Masterful. You've weaponized silence. Most people can't tolerate it and will fill the void with compromise.",
        logic: "This is Advanced Negotiation Psychology: silence creates pressure that the other party feels compelled to relieve. You've used the pause as leverage.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    level: "Level 3",
    title: "The Backhanded Compliment",
    context: "A rival says, \"Impressive how you managed to succeed despite your... unconventional background.\"",
    choices: [
      {
        id: "A",
        text: "Hit back with a snarky comeback",
        feedback: "You took the bait. Sarcasm confirms their comment landed. You've revealed the wound.",
        logic: "Reacting emotionally proves they struck a nerve. Power doesn't rise to provocations.",
        isCorrect: false,
      },
      {
        id: "B",
        text: "\"Adaptability is our strongest asset in a changing world. I'm glad you recognize it.\"",
        feedback: "Brilliant. You've reframed their insult as a strength and refused to engage with the subtext.",
        logic: "This is Verbal Aikido: use their force against them by reframing the narrative. You've turned 'unconventional' into 'adaptive' and made them complicit in praising you.",
        isCorrect: true,
      },
      {
        id: "C",
        text: "Laugh it off and change the subject",
        feedback: "You missed the insult entirely. Avoidance isn't finesse; it's evasion.",
        logic: "Ignoring doesn't neutralize. They know you heard it, and so does everyone else. Strategic reframing is stronger than silence.",
        isCorrect: false,
      },
    ],
  },
];

export default function InteractiveRoleplays() {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);
  };

  const resetScenario = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
  };

  const switchScenario = (scenario) => {
    setSelectedScenario(scenario);
    resetScenario();
  };

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Interactive Roleplays
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real scenarios. Real stakes. See the Finesse logic behind each response.
          </p>
        </motion.div>

        {/* Scenario Tabs */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => switchScenario(scenario)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedScenario.id === scenario.id
                  ? "bg-gradient-to-r from-amber-600 to-yellow-500 text-gray-900"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="text-xs opacity-75 mb-1">{scenario.level}</div>
              <div>{scenario.title}</div>
            </button>
          ))}
        </div>

        {/* Scenario Content */}
        <motion.div
          key={selectedScenario.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-amber-400/20 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
          }}
        >
          {/* Context */}
          <div className="mb-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-amber-600 text-gray-900 rounded-full text-xs font-bold">
                {selectedScenario.level}
              </span>
              <h3 className="text-2xl font-serif text-amber-400">
                {selectedScenario.title}
              </h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed italic">
              "{selectedScenario.context}"
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-4 mb-8">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-4 font-semibold">
              How do you respond?
            </h4>
            {selectedScenario.choices.map((choice) => (
              <motion.button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                disabled={showFeedback}
                whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                whileTap={{ scale: showFeedback ? 1 : 0.98 }}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedChoice?.id === choice.id
                    ? choice.isCorrect
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-red-500 bg-red-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                } ${showFeedback && selectedChoice?.id !== choice.id ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold">
                    {choice.id}
                  </span>
                  <span className="text-gray-300 text-lg">
                    {choice.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && selectedChoice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`p-8 rounded-xl border-2 ${
                  selectedChoice.isCorrect
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-red-500 bg-red-500/10"
                }`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">
                    {selectedChoice.isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="flex-1">
                    <h4 className={`text-2xl font-serif mb-3 ${
                      selectedChoice.isCorrect ? "text-amber-400" : "text-red-400"
                    }`}>
                      {selectedChoice.isCorrect ? "Finesse Mastery" : "Missed Opportunity"}
                    </h4>
                    <p className="text-gray-300 text-lg leading-relaxed mb-4">
                      {selectedChoice.feedback}
                    </p>
                  </div>
                </div>

                {/* Logic Explanation */}
                <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                  <h5 className="text-sm uppercase tracking-wider text-gray-400 mb-2 font-semibold">
                    The Finesse Logic
                  </h5>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedChoice.logic}
                  </p>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={resetScenario}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Try Again
                  </button>
                  {selectedChoice.isCorrect && (
                    <a
                      href="/courses"
                      className="px-6 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-gray-900 font-bold rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      Master More Scenarios
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Helper Text */}
          {!showFeedback && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Select your response to understand the psychology behind each choice
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
