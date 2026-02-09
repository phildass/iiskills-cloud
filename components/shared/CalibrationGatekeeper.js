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

// Level 1 Qualifier (Gatekeeper) questions per app - as per progression charts
const CALIBRATION_QUESTIONS = {
  // FOUNDATION SUITE (Free Apps)
  math: {
    question: "If a set of numbers is 2, 4, 8, 16, what is the formula for the nth term?",
    options: ["n²", "2n", "2^n (Exponential growth)", "n + 2"],
    correctAnswer: 2,
    explanation: "The pattern shows exponential growth: 2¹=2, 2²=4, 2³=8, 2⁴=16. The formula is 2^n.",
  },
  physics: {
    question: "If you double the mass of an object but keep the force the same, what happens to acceleration?",
    options: ["It doubles", "It is halved (F = ma)", "It stays the same", "It quadruples"],
    correctAnswer: 1,
    explanation: "Using F = ma, if F is constant and m doubles, then a = F/(2m) = (F/m)/2, so acceleration is halved.",
  },
  biology: {
    question: "Which organelle acts as the 'Power Plant' generating ATP for the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Chloroplast"],
    correctAnswer: 2,
    explanation: "Mitochondria are the powerhouse of the cell, generating ATP through cellular respiration.",
  },
  chemistry: {
    question: "Which type of bond involves the sharing of electron pairs between atoms?",
    options: ["Ionic Bond", "Covalent Bond", "Metallic Bond", "Hydrogen Bond"],
    correctAnswer: 1,
    explanation: "A covalent bond is formed when atoms share electron pairs between them.",
  },
  geography: {
    question: "On a map with a scale of 1:100,000, a 5cm line represents how many kilometers?",
    options: ["5 km", "10 km", "50 km", "100 km"],
    correctAnswer: 0,
    explanation: "Scale 1:100,000 means 1cm = 1km. Therefore, 5cm = 5km.",
  },
  aptitude: {
    question: "3 workers build a wall in 6 hours. How many workers are needed to do it in 2 hours?",
    options: ["3 workers", "6 workers", "9 workers (Inverse ratio)", "12 workers"],
    correctAnswer: 2,
    explanation: "Work is constant. 3 workers × 6 hours = 18 worker-hours. For 2 hours: 18 ÷ 2 = 9 workers needed (inverse ratio).",
  },
  
  // ACADEMY SUITE (Paid Apps)
  ai: {
    question: "In Machine Learning, does 'Supervised Learning' require labeled data?",
    options: ["Yes, it requires labeled data", "No, it doesn't require labeled data", "Only sometimes", "It depends on the algorithm"],
    correctAnswer: 0,
    explanation: "Supervised Learning requires labeled training data to learn the mapping between inputs and outputs. Master Neural Architectures.",
  },
  developer: {
    question: "Which HTTP method is typically used to update existing data on a server?",
    options: ["GET", "POST", "PUT or PATCH", "DELETE"],
    correctAnswer: 2,
    explanation: "PUT or PATCH methods are used to update existing resources on a server. PUT replaces the entire resource, while PATCH applies partial modifications.",
  },
  finesse: {
    question: "If a client goes silent after your pitch, should you:",
    options: ["A) Fill the gap immediately", "B) Wait and let the silence work", "C) Change the subject", "D) Apologize"],
    correctAnswer: 1,
    explanation: "Master Executive Presence: Option B - Wait. Strategic silence after your pitch creates pressure and shows confidence. Don't rush to fill the gap.",
  },
  management: {
    question: "A 'Bottleneck' in a workflow is defined by the stage with the:",
    options: ["A) Highest cost", "B) Lowest capacity", "C) Most workers", "D) Longest distance"],
    correctAnswer: 1,
    explanation: "Optimize Human Systems: A bottleneck is the stage with the lowest capacity (B), which limits the entire workflow's throughput.",
  },
  pr: {
    question: "Is the primary goal of PR to buy ads or to earn 'Organic Authority'?",
    options: ["Buy ads", "Earn Organic Authority", "Both equally", "Neither"],
    correctAnswer: 1,
    explanation: "Control Public Perception: The primary goal of PR is to earn Organic Authority through media relations, not to buy advertising space.",
  },
  "govt-jobs": {
    question: "Which pillar of the Constitution ensures the separation of Judiciary and Executive?",
    options: ["Fundamental Rights (Part III)", "Directive Principles (Art 50)", "Emergency Provisions", "Amendment Procedure"],
    correctAnswer: 1,
    explanation: "Directive Principles of State Policy, specifically Article 50, mandates the separation of Judiciary from the Executive to ensure independent justice.",
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
              Level 1 Qualifier (Gatekeeper)
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Complete this qualifying question to access <strong>{appName}</strong>
              {isPaid ? " and unlock the payment preview" : " Lesson 1.1"}
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
