/**
 * Calibration Gatekeeper Component
 * 
 * High-impact logic question per app to qualify users for tier entry
 * Shows "Calibration Confirmed!" message on success
 * For paid apps, displays Internal Payment Preview UI after qualification
 * 
 * Usage:
 * <CalibrationGatekeeper 
 *   appName="Learn Math"
 *   tier="intermediate"
 *   isPaid={false}
 *   onCalibrationSuccess={() => {}}
 * />
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Sample calibration questions per app theme
const CALIBRATION_QUESTIONS = {
  math: {
    question: "If f(x) = 2x² - 3x + 1, what is f(3)?",
    options: ["10", "12", "14", "16"],
    correctAnswer: 0,
    explanation: "f(3) = 2(3)² - 3(3) + 1 = 2(9) - 9 + 1 = 18 - 9 + 1 = 10",
  },
  physics: {
    question: "A 5kg object experiences a net force of 20N. What is its acceleration?",
    options: ["2 m/s²", "4 m/s²", "15 m/s²", "25 m/s²"],
    correctAnswer: 1,
    explanation: "Using F = ma, a = F/m = 20N / 5kg = 4 m/s²",
  },
  chemistry: {
    question: "What is the molar mass of H₂O (water)?",
    options: ["16 g/mol", "18 g/mol", "20 g/mol", "22 g/mol"],
    correctAnswer: 1,
    explanation: "H₂O = 2(1) + 16 = 18 g/mol",
  },
  biology: {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    correctAnswer: 2,
    explanation: "Mitochondria generate ATP through cellular respiration",
  },
  geography: {
    question: "Which line of latitude divides the Earth into Northern and Southern hemispheres?",
    options: ["Tropic of Cancer", "Equator", "Prime Meridian", "Tropic of Capricorn"],
    correctAnswer: 1,
    explanation: "The Equator (0° latitude) divides Earth into Northern and Southern hemispheres",
  },
  aptitude: {
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are:",
    options: ["Definitely Lazzies", "Definitely not Lazzies", "Cannot be determined", "Sometimes Lazzies"],
    correctAnswer: 0,
    explanation: "This is a valid syllogism. If A⊆B and B⊆C, then A⊆C",
  },
  ai: {
    question: "What type of machine learning uses labeled training data?",
    options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Transfer Learning"],
    correctAnswer: 1,
    explanation: "Supervised learning uses labeled datasets to train models",
  },
  developer: {
    question: "What does 'DRY' stand for in programming principles?",
    options: [
      "Don't Repeat Yourself",
      "Do Repeat Yourself",
      "Data Retrieval Yield",
      "Debug Run Yearly"
    ],
    correctAnswer: 0,
    explanation: "DRY (Don't Repeat Yourself) is a principle to reduce code repetition",
  },
  "govt-jobs": {
    question: "The Constitution of India was adopted on which date?",
    options: ["26 January 1950", "26 November 1949", "15 August 1947", "26 January 1949"],
    correctAnswer: 1,
    explanation: "The Constitution was adopted on 26 November 1949, came into effect on 26 January 1950",
  },
  pr: {
    question: "In crisis communication, what is the first priority?",
    options: [
      "Protect company reputation",
      "Ensure stakeholder safety and transparency",
      "Issue legal disclaimers",
      "Minimize media coverage"
    ],
    correctAnswer: 1,
    explanation: "Safety and transparency are paramount in crisis communication",
  },
  management: {
    question: "In Agile methodology, what is a 'Sprint'?",
    options: [
      "A marathon planning session",
      "A time-boxed iteration for development",
      "A quick meeting",
      "A project milestone"
    ],
    correctAnswer: 1,
    explanation: "A Sprint is a time-boxed iteration (typically 2-4 weeks) in Agile",
  },
  finesse: {
    question: "In executive presence, what is the 'power pause'?",
    options: [
      "Taking a break during meetings",
      "Strategic silence to emphasize a point",
      "Pausing to check phone",
      "Stopping mid-sentence"
    ],
    correctAnswer: 1,
    explanation: "The power pause is strategic silence used to emphasize key points and command attention",
  },
};

export default function CalibrationGatekeeper({
  appName = "this course",
  appType = "math", // math, physics, chemistry, biology, geography, aptitude, ai, developer, govt-jobs, pr, management, finesse
  tier = "intermediate",
  isPaid = false,
  onCalibrationSuccess,
  onPaymentRequired,
}) {
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = CALIBRATION_QUESTIONS[appType] || CALIBRATION_QUESTIONS.math;

  const handleStartCalibration = () => {
    setShowQuestion(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    setShowExplanation(true);

    if (correct) {
      // Delay callback to show success animation first
      setTimeout(() => {
        if (isPaid && onPaymentRequired) {
          onPaymentRequired();
        } else if (onCalibrationSuccess) {
          onCalibrationSuccess();
        }
      }, 2000);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
  };

  if (!showQuestion) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-300 shadow-xl text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Calibration Gatekeeper
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Complete this qualifying logic question to confirm your <strong>{tier}</strong> tier
              entry for <strong>{appName}</strong>
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartCalibration}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition"
            >
              🚀 Start Calibration
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-blue-300"
            >
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-100 px-4 py-2 rounded-full text-blue-700 font-semibold mb-4">
                  {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier • {appName}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Calibration Question
                </h3>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-xl text-gray-900 font-medium">
                  {question.question}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selectedAnswer === idx
                        ? "bg-blue-100 border-blue-500 shadow-md"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-bold text-blue-600 mr-3">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="text-gray-900">{option}</span>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl p-8 shadow-2xl border-4 ${
                isCorrect
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-500"
                  : "bg-gradient-to-br from-red-50 to-orange-50 border-red-500"
              }`}
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="text-8xl mb-4"
                >
                  {isCorrect ? "✅" : "❌"}
                </motion.div>
                <h3 className="text-4xl font-bold mb-2">
                  {isCorrect ? (
                    <span className="text-green-600">Calibration Confirmed!</span>
                  ) : (
                    <span className="text-red-600">Not Quite Right</span>
                  )}
                </h3>
                <p className="text-xl text-gray-700">
                  {isCorrect
                    ? `You've qualified for ${tier} tier access`
                    : "Review the explanation and try again"}
                </p>
              </div>

              {showExplanation && (
                <div className="bg-white/80 rounded-xl p-6 mb-6 border-2 border-blue-200">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    Explanation:
                  </h4>
                  <p className="text-gray-700">{question.explanation}</p>
                  <p className="text-sm text-gray-600 mt-3">
                    <strong>Correct answer:</strong>{" "}
                    {String.fromCharCode(65 + question.correctAnswer)}.{" "}
                    {question.options[question.correctAnswer]}
                  </p>
                </div>
              )}

              {isCorrect ? (
                <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6 text-center">
                  <p className="text-green-800 font-semibold mb-4">
                    {isPaid
                      ? "🎉 Proceed to secure payment to unlock full course access"
                      : "🎉 You now have access to the full course content!"}
                  </p>
                  <p className="text-sm text-green-700">
                    Your diagnostic profile has been updated
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition"
                >
                  🔄 Try Again
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
