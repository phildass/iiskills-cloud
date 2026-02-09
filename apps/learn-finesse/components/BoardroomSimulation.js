"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOARDROOM_SCENARIO = {
  title: "The Boardroom Simulation",
  scenario: "A senior stakeholder interrupts with a condescending remark during your presentation.",
  choices: [
    {
      id: "A",
      text: "Interrupt back to regain control",
      feedback:
        "You're reacting, not responding. Aggression reads as insecurity in high-stakes rooms.",
      result: "aggressive",
      level: "Start with Finesse Basic: Module 4 (The Power of the Pause)",
    },
    {
      id: "B",
      text: "Pause two seconds, hold eye contact, finish your point slowly",
      feedback:
        "That is Power Silence (Level 2 Logic). You've demonstrated command without confrontation.",
      result: "finesse",
      level: "You're ready for Intermediate.",
      isCorrect: true,
    },
    {
      id: "C",
      text: "Apologize and let them speak",
      feedback: "Submission signals weakness. You've surrendered your authority.",
      result: "submissive",
      level: "Start with Finesse Basic: Module 4 (The Power of the Pause)",
    },
  ],
};

export default function BoardroomSimulation() {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pulseMeter, setPulseMeter] = useState(50); // Default: Neutral

  const handleChoice = (choice) => {
    setSelectedChoice(choice);
    setShowFeedback(true);

    // Update pulse meter based on choice
    if (choice.result === "submissive") {
      setPulseMeter(20);
    } else if (choice.result === "aggressive") {
      setPulseMeter(80);
    } else if (choice.result === "finesse") {
      setPulseMeter(50);
    }
  };

  const resetSimulation = () => {
    setSelectedChoice(null);
    setShowFeedback(false);
    setPulseMeter(50);
  };

  const getPulseMeterColor = () => {
    if (pulseMeter < 35) return "from-red-500 to-red-600"; // Submissive
    if (pulseMeter > 65) return "from-orange-500 to-red-500"; // Aggressive
    return "from-amber-500 to-yellow-400"; // Finesse
  };

  const getPulseMeterLabel = () => {
    if (pulseMeter < 35) return "Submissive";
    if (pulseMeter > 65) return "Aggressive";
    return "Finesse";
  };

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">
            The Gatekeeper Experience
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Test your instinct. One scenario. Three responses. Only one demonstrates true power.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-amber-400/20 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
          }}
        >
          {/* Pulse Meter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
                Power Dynamic
              </span>
              <span
                className={`text-sm font-bold bg-gradient-to-r ${getPulseMeterColor()} bg-clip-text text-transparent`}
              >
                {getPulseMeterLabel()}
              </span>
            </div>
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getPulseMeterColor()} shadow-lg`}
                initial={{ width: "50%" }}
                animate={{ width: `${pulseMeter}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Submissive</span>
              <span>Finesse</span>
              <span>Aggressive</span>
            </div>
          </div>

          {/* Scenario */}
          <div className="mb-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
            <h3 className="text-2xl font-serif text-amber-400 mb-4">{BOARDROOM_SCENARIO.title}</h3>
            <p className="text-gray-300 text-lg leading-relaxed italic">
              "{BOARDROOM_SCENARIO.scenario}"
            </p>
          </div>

          {/* Choices */}
          <div className="space-y-4 mb-8">
            {BOARDROOM_SCENARIO.choices.map((choice) => (
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
                } ${showFeedback && !selectedChoice?.id !== choice.id ? "opacity-50" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 text-white font-bold">
                    {choice.id}
                  </span>
                  <span className="text-gray-300 text-lg">{choice.text}</span>
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
                className={`p-6 rounded-xl border-2 ${
                  selectedChoice.isCorrect
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-red-500 bg-red-500/10"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{selectedChoice.isCorrect ? "✓" : "✗"}</span>
                  <div>
                    <h4
                      className={`text-xl font-bold mb-2 ${
                        selectedChoice.isCorrect ? "text-amber-400" : "text-red-400"
                      }`}
                    >
                      {selectedChoice.isCorrect ? "Success" : "Error"}
                    </h4>
                    <p className="text-gray-300 leading-relaxed mb-3">{selectedChoice.feedback}</p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Next Step:</span> {selectedChoice.level}
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetSimulation}
                  className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          {!showFeedback && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Select your response to see the Finesse logic behind each choice
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
