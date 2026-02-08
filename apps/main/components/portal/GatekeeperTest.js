import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = [
  { id: "physics", name: "Physics", appNumber: 6 },
  { id: "math", name: "Math", appNumber: 8 },
  { id: "chemistry", name: "Chemistry", appNumber: 7 },
  { id: "geography", name: "Geography", appNumber: 9 },
];

const TEST_QUESTIONS = {
  physics: {
    question: "If you run in a perfect circle and end where you started, is your displacement Zero?",
    correctAnswer: "yes",
    explanation: {
      correct: "Correct. You've got the intuition. Download the App to skip to Intermediate.",
      incorrect: "Not quite. That's a 'Basic' concept. Download the App to master the foundations in 15 minutes.",
    },
  },
  math: {
    question: "Is zero considered a natural number in modern mathematics?",
    correctAnswer: "yes",
    explanation: {
      correct: "Correct! Modern mathematics includes zero as a natural number. You're ready for Intermediate.",
      incorrect: "Actually, zero IS considered a natural number. Download the App to master the basics.",
    },
  },
  chemistry: {
    question: "Does an atom with more electrons than protons have a negative charge?",
    correctAnswer: "yes",
    explanation: {
      correct: "Perfect! You understand atomic structure. Ready for Intermediate level.",
      incorrect: "Not quite. More electrons = negative charge. Master the basics in our App.",
    },
  },
  geography: {
    question: "Does the equator run horizontally around the Earth's widest point?",
    correctAnswer: "yes",
    explanation: {
      correct: "Excellent! You've got geographic fundamentals down. Jump to Intermediate.",
      incorrect: "Actually, yes it does! Download the App to build your geographic foundation.",
    },
  },
};

export default function GatekeeperTest() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const resetTest = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const currentQuestion = TEST_QUESTIONS[selectedSubject.id];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div
      className="relative rounded-2xl p-8 md:p-12 backdrop-blur-xl shadow-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      {/* Glassmorphic overlay effect */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md -z-10" />

      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-3">
          Prove Your Level
        </h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Don't just take our word for it. Test your knowledge right now.
        </p>

        {/* Subject Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            1. Select Subject:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUBJECTS.map((subject) => (
              <button
                key={subject.id}
                onClick={() => {
                  setSelectedSubject(subject);
                  resetTest();
                }}
                className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                  selectedSubject.id === subject.id
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow"
                }`}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSubject.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg mb-6"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              2. Test Question:
            </label>
            <p className="text-lg text-charcoal font-medium mb-6">
              "{currentQuestion.question}"
            </p>

            {/* Answer Buttons */}
            {!showResult ? (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleAnswer("yes")}
                  className="px-8 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                >
                  YES
                </button>
                <button
                  onClick={() => handleAnswer("no")}
                  className="px-8 py-4 bg-red-500 text-white rounded-lg font-bold text-lg hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                >
                  NO
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-lg ${
                  isCorrect ? "bg-green-50 border-2 border-green-500" : "bg-red-50 border-2 border-red-500"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{isCorrect ? "✅" : "❌"}</div>
                  <div>
                    <p className="text-lg font-bold text-charcoal mb-2">
                      {isCorrect ? "Correct!" : "Not Quite!"}
                    </p>
                    <p className="text-gray-700">
                      {isCorrect ? currentQuestion.explanation.correct : currentQuestion.explanation.incorrect}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <a
                    href={`https://app${selectedSubject.appNumber}.learn-${selectedSubject.id}.iiskills.cloud`}
                    className="flex-1 text-center px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Open {selectedSubject.name} App →
                  </a>
                  <button
                    onClick={resetTest}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
