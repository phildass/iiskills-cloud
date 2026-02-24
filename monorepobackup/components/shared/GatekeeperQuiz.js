"use client";

/**
 * Gatekeeper Quiz Component
 * 
 * Rigorous qualification quiz for Intermediate and Advanced tiers.
 * - 3 conceptual, foundational, or skill-specific questions per subject and tier
 * - 100% passing threshold (must score 3/3 correct)
 * - If failed, user can retry after reviewing feedback
 * - Correct answers are tracked in backend but NOT displayed to users until completion
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GatekeeperQuiz({ 
  tier, 
  subject = "this subject",
  appName = "this subject", 
  onPass, 
  onFail,
  questions = [] 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Helper function to calculate correct answers
  const calculateCorrectCount = (userAnswers, quizQuestions) => {
    return userAnswers.reduce((count, userAnswer, index) => {
      const question = quizQuestions[index];
      // Find the index of the correct answer in the options array
      const correctIndex = question.options.indexOf(question.answer);
      return count + (userAnswer === correctIndex ? 1 : 0);
    }, 0);
  };

  // Default questions if none provided (fallback)
  const defaultQuestions = [
    {
      question: `What is a fundamental principle of ${appName}?`,
      options: [
        "Option A: Basic concept",
        "Option B: Advanced concept",
        "Option C: Expert concept",
        "Option D: Core concept"
      ],
      answer: "Option D: Core concept"
    },
    {
      question: `Which of the following is essential in ${appName}?`,
      options: [
        "Option A: Component 1",
        "Option B: Component 2",
        "Option C: Component 3",
        "Option D: Component 4"
      ],
      answer: "Option B: Component 2"
    },
    {
      question: `What best demonstrates mastery of ${appName}?`,
      options: [
        "Option A: Method 1",
        "Option B: Method 2",
        "Option C: Method 3",
        "Option D: Method 4"
      ],
      answer: "Option C: Method 3"
    }
  ];

  const quizQuestions = questions.length > 0 ? questions : defaultQuestions;

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correct = calculateCorrectCount(newAnswers, quizQuestions);
      setCorrectCount(correct);
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setCorrectCount(0);
  };

  // Must score 100% (all 3 questions correct) to pass
  const isPassed = correctCount === quizQuestions.length;

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl"
      >
        <div className="text-center">
          {isPassed ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">
                Congratulations! You Passed the Gatekeeper Test!
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                Perfect Score: {correctCount}/{quizQuestions.length} correct
              </p>
              <p className="text-gray-600 mb-6">
                You've demonstrated mastery of foundational concepts and are ready to proceed to the {tier} tier in {subject}.
              </p>
              <button
                onClick={onPass}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Unlock {tier} Tier →
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-3xl font-bold text-orange-600 mb-4">
                Gatekeeper Test Not Passed
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                Score: {correctCount}/{quizQuestions.length} correct
              </p>
              <p className="text-gray-600 mb-6">
                You need to answer all 3 questions correctly to proceed to the {tier} tier.
                We recommend reviewing the material and trying again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRetake}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  Try Again
                </button>
                {onFail && (
                  <button
                    onClick={onFail}
                    className="bg-gray-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-600 transition-all"
                  >
                    Return to Basic Tier
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-2xl"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span>{Math.round(((currentQuestion) / quizQuestions.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h2 className="text-lg font-bold text-purple-900 mb-1">
          🔒 Gatekeeper Test - {tier} Tier
        </h2>
        <p className="text-sm text-purple-700">
          {subject}
        </p>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Info */}
      <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-gray-700">
          <strong>⚠️ Important:</strong> You must answer all 3 questions correctly to pass the gatekeeper and unlock the {tier} tier.
        </p>
      </div>
    </motion.div>
  );
}
