"use client";

/**
 * Diagnostic Quiz Component
 * 
 * Level 1 Qualifier quiz for Intermediate and Advanced tiers.
 * - 5 relevant questions per subject
 * - 30% passing threshold (must score at least 2/5 correct)
 * - If failed, user is redirected to Basic tier
 * - If passed, user can proceed to selected tier
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiagnosticQuiz({ 
  tier, 
  appName = "this subject", 
  onPass, 
  onFail,
  questions = [] 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Default questions if none provided
  const defaultQuestions = [
    {
      question: `What is the fundamental principle of ${appName}?`,
      options: [
        "Option A: Basic concept",
        "Option B: Advanced concept",
        "Option C: Expert concept",
        "Option D: None of the above"
      ],
      correctAnswer: 0
    },
    {
      question: `Which of the following is a key component in ${appName}?`,
      options: [
        "Option A: Component 1",
        "Option B: Component 2",
        "Option C: Component 3",
        "Option D: Component 4"
      ],
      correctAnswer: 1
    },
    {
      question: `How would you solve a typical ${appName} problem?`,
      options: [
        "Option A: Method 1",
        "Option B: Method 2",
        "Option C: Method 3",
        "Option D: Method 4"
      ],
      correctAnswer: 2
    },
    {
      question: `What is the most important consideration in ${appName}?`,
      options: [
        "Option A: Consideration 1",
        "Option B: Consideration 2",
        "Option C: Consideration 3",
        "Option D: Consideration 4"
      ],
      correctAnswer: 0
    },
    {
      question: `Which approach best demonstrates ${appName} expertise?`,
      options: [
        "Option A: Approach 1",
        "Option B: Approach 2",
        "Option C: Approach 3",
        "Option D: Approach 4"
      ],
      correctAnswer: 3
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
      const correctCount = newAnswers.reduce((count, answer, index) => {
        return count + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      const finalScore = (correctCount / quizQuestions.length) * 100;
      setScore(finalScore);
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  const isPassed = score >= 30;

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
                Congratulations! You Passed!
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                Score: {score.toFixed(0)}% ({answers.filter((a, i) => a === quizQuestions[i].correctAnswer).length}/{quizQuestions.length} correct)
              </p>
              <p className="text-gray-600 mb-6">
                You've demonstrated sufficient knowledge to proceed to the {tier} tier.
              </p>
              <button
                onClick={onPass}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Proceed to {tier} Tier →
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-3xl font-bold text-orange-600 mb-4">
                Additional Learning Recommended
              </h2>
              <p className="text-xl text-gray-700 mb-2">
                Score: {score.toFixed(0)}% ({answers.filter((a, i) => a === quizQuestions[i].correctAnswer).length}/{quizQuestions.length} correct)
              </p>
              <p className="text-gray-600 mb-6">
                We recommend starting with the Basic tier to build a strong foundation.
                You need at least 30% to proceed to {tier} tier.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onFail}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  Start with Basic Tier
                </button>
                <button
                  onClick={handleRetake}
                  className="bg-gray-500 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-600 transition-all"
                >
                  Retake Quiz
                </button>
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
          />
        </div>
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
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> You need to score at least 30% (2 out of 5 correct) to proceed to the {tier} tier.
        </p>
      </div>
    </motion.div>
  );
}
