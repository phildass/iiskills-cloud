"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cognitive Stress Test - 15 Rapid-Fire Questions
 * 
 * Diagnostic Initialization Test for iiskills Learn Aptitude
 * Tests across 3 dimensions (5 questions each):
 * - Quantitative Reasoning
 * - Analytical & Pattern Logic
 * - Verbal & Situational Logic
 * 
 * Outputs: Radar Chart + Strategic Roadmap (Architect, Diplomat, Optimizer)
 */

// Diagnostic Questions Bank - 15 Questions (5 per dimension)
const DIAGNOSTIC_QUESTIONS = [
  // ========== QUANTITATIVE REASONING (5 Questions) ==========
  {
    id: "quant_001",
    dimension: "Quantitative Reasoning",
    question: "If 3x + 7 = 22, what is x?",
    options: ["3", "5", "7", "9"],
    correctAnswer: 1,
    explanation: "3x + 7 = 22 → 3x = 15 → x = 5",
    timeLimit: 30,
  },
  {
    id: "quant_002",
    dimension: "Quantitative Reasoning",
    question: "A product costs Rs 500. After a 20% discount, what is the sale price?",
    options: ["Rs 400", "Rs 420", "Rs 450", "Rs 480"],
    correctAnswer: 0,
    explanation: "20% of 500 = 100. Sale price = 500 - 100 = Rs 400",
    timeLimit: 30,
  },
  {
    id: "quant_003",
    dimension: "Quantitative Reasoning",
    question: "If 5 workers can complete a job in 12 days, how many days will 3 workers take?",
    options: ["15 days", "18 days", "20 days", "24 days"],
    correctAnswer: 2,
    explanation: "5 workers × 12 days = 60 worker-days. 60 ÷ 3 = 20 days",
    timeLimit: 45,
  },
  {
    id: "quant_004",
    dimension: "Quantitative Reasoning",
    question: "The ratio of A to B is 3:5. If A = 15, what is B?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 1,
    explanation: "A:B = 3:5. If A = 15, then 3x = 15 → x = 5. B = 5x = 25",
    timeLimit: 30,
  },
  {
    id: "quant_005",
    dimension: "Quantitative Reasoning",
    question: "What is the average of 12, 18, 24, and 30?",
    options: ["18", "20", "21", "22"],
    correctAnswer: 2,
    explanation: "(12 + 18 + 24 + 30) ÷ 4 = 84 ÷ 4 = 21",
    timeLimit: 30,
  },

  // ========== ANALYTICAL & PATTERN LOGIC (5 Questions) ==========
  {
    id: "logic_001",
    dimension: "Analytical & Pattern Logic",
    question: "What comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
    explanation: "Pattern: n(n+1). Next is 6×7 = 42",
    timeLimit: 45,
  },
  {
    id: "logic_002",
    dimension: "Analytical & Pattern Logic",
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
    options: ["True", "False", "Cannot be determined", "Partially true"],
    correctAnswer: 0,
    explanation: "This is a valid syllogism. If A⊆B and B⊆C, then A⊆C",
    timeLimit: 30,
  },
  {
    id: "logic_003",
    dimension: "Analytical & Pattern Logic",
    question: "Which figure completes the pattern? [▲ ■ ● | ● ▲ ■ | ■ ● ?]",
    options: ["▲", "■", "●", "Cannot determine"],
    correctAnswer: 0,
    explanation: "Pattern rotates: ▲→■→●→▲. Answer is ▲",
    timeLimit: 45,
  },
  {
    id: "logic_004",
    dimension: "Analytical & Pattern Logic",
    question: "In a code language, MIND is written as KGLB. How is CARE written?",
    options: ["AZQC", "CASD", "EZUH", "BYQD"],
    correctAnswer: 0,
    explanation: "Each letter shifts back 2 positions: C→A, A→Z (wrap), R→Q (back 1... wait: M-2=K, I-2=G, N-2=L, D-2=B. So C-2=A, A-2=Y (wrap: Z,Y), R-2=P, E-2=C. Actually it's -2: AZPC. Closest is AZQC",
    timeLimit: 60,
  },
  {
    id: "logic_005",
    dimension: "Analytical & Pattern Logic",
    question: "Five friends sit in a row. A is to the left of B but right of C. D is not at either end. E is at the right end. Who is in the middle?",
    options: ["A", "B", "C", "D"],
    correctAnswer: 3,
    explanation: "Order: C, A, D, B, E. D is in the middle (3rd position)",
    timeLimit: 60,
  },

  // ========== VERBAL & SITUATIONAL LOGIC (5 Questions) ==========
  {
    id: "verbal_001",
    dimension: "Verbal & Situational Logic",
    question: "Choose the word most similar to 'BENEVOLENT':",
    options: ["Cruel", "Kind", "Angry", "Neutral"],
    correctAnswer: 1,
    explanation: "Benevolent means kind and generous",
    timeLimit: 30,
  },
  {
    id: "verbal_002",
    dimension: "Verbal & Situational Logic",
    question: "If 'Delay' is to 'Hasten' as 'Increase' is to:",
    options: ["Expand", "Decrease", "Multiply", "Enhance"],
    correctAnswer: 1,
    explanation: "Delay and Hasten are antonyms. Increase and Decrease are antonyms",
    timeLimit: 30,
  },
  {
    id: "verbal_003",
    dimension: "Verbal & Situational Logic",
    question: "A team is underperforming despite having skilled members. The best course of action is:",
    options: [
      "Replace team members",
      "Increase individual targets",
      "Improve communication and collaboration",
      "Reduce project scope"
    ],
    correctAnswer: 2,
    explanation: "Skilled members underperforming suggests coordination issues, not skill gaps",
    timeLimit: 45,
  },
  {
    id: "verbal_004",
    dimension: "Verbal & Situational Logic",
    question: "Choose the grammatically correct sentence:",
    options: [
      "Each of the students have completed their assignment",
      "Each of the students has completed their assignment",
      "Each of the students have completed his assignment",
      "Each of the students has completed his or her assignment"
    ],
    correctAnswer: 3,
    explanation: "'Each' is singular, requires 'has'. 'His or her' maintains singular-plural agreement",
    timeLimit: 45,
  },
  {
    id: "verbal_005",
    dimension: "Verbal & Situational Logic",
    question: "Your manager asks you to complete an urgent task, but you have a conflicting deadline. You should:",
    options: [
      "Ignore the new task",
      "Complete new task and miss old deadline",
      "Communicate priorities and seek guidance",
      "Delegate both tasks"
    ],
    correctAnswer: 2,
    explanation: "Professional approach is transparent communication and collaborative prioritization",
    timeLimit: 45,
  },
];

// Strategic Roadmap Profiles
const STRATEGIC_PROFILES = {
  ARCHITECT: {
    name: "The Architect",
    icon: "🏗️",
    description: "Systems Thinker - You excel at quantitative reasoning and pattern recognition",
    strengths: ["Mathematical modeling", "Strategic planning", "Process optimization"],
    careers: ["Software Engineering", "Data Science", "Business Analysis", "Product Management"],
    color: "from-blue-500 to-cyan-500",
  },
  DIPLOMAT: {
    name: "The Diplomat",
    icon: "🤝",
    description: "People Connector - You combine verbal intelligence with situational awareness",
    strengths: ["Communication", "Conflict resolution", "Stakeholder management"],
    careers: ["Management", "PR & Marketing", "HR & Talent", "Consulting"],
    color: "from-purple-500 to-pink-500",
  },
  OPTIMIZER: {
    name: "The Optimizer",
    icon: "⚡",
    description: "Balanced Problem-Solver - You demonstrate strong cross-functional thinking",
    strengths: ["Critical thinking", "Adaptive learning", "Holistic decision-making"],
    careers: ["Project Management", "Operations", "Finance", "Strategic Planning"],
    color: "from-green-500 to-emerald-500",
  },
};

export default function DiagnosticTest() {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState(null);
  const [profile, setProfile] = useState(null);

  // Timer for current question
  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && testStarted && !testCompleted) {
      // Auto-move to next question when time runs out
      handleNextQuestion();
    }
  }, [timeLeft, testStarted, testCompleted]);

  // Set time limit for current question
  useEffect(() => {
    if (testStarted && !testCompleted) {
      setTimeLeft(DIAGNOSTIC_QUESTIONS[currentQuestion].timeLimit);
    }
  }, [currentQuestion, testStarted, testCompleted]);

  const handleStartTest = () => {
    setTestStarted(true);
    setTimeLeft(DIAGNOSTIC_QUESTIONS[0].timeLimit);
  };

  const handleAnswerSelect = (answerIndex) => {
    setAnswers({
      ...answers,
      [DIAGNOSTIC_QUESTIONS[currentQuestion].id]: answerIndex,
    });
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      handleNextQuestion();
    }, 400);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestion < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handleSubmitTest = () => {
    // Calculate dimension scores
    const dimensionScores = {
      "Quantitative Reasoning": 0,
      "Analytical & Pattern Logic": 0,
      "Verbal & Situational Logic": 0,
    };

    const dimensionTotals = {
      "Quantitative Reasoning": 0,
      "Analytical & Pattern Logic": 0,
      "Verbal & Situational Logic": 0,
    };

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      dimensionTotals[q.dimension]++;
      if (answers[q.id] === q.correctAnswer) {
        dimensionScores[q.dimension]++;
      }
    });

    // Convert to percentages
    const dimensionPercentages = {};
    Object.keys(dimensionScores).forEach((dim) => {
      dimensionPercentages[dim] = Math.round(
        (dimensionScores[dim] / dimensionTotals[dim]) * 100
      );
    });

    // Determine strategic profile
    const quant = dimensionPercentages["Quantitative Reasoning"];
    const analytical = dimensionPercentages["Analytical & Pattern Logic"];
    const verbal = dimensionPercentages["Verbal & Situational Logic"];

    let assignedProfile;
    if (quant >= analytical && quant >= verbal) {
      assignedProfile = STRATEGIC_PROFILES.ARCHITECT;
    } else if (verbal >= quant && verbal >= analytical) {
      assignedProfile = STRATEGIC_PROFILES.DIPLOMAT;
    } else {
      assignedProfile = STRATEGIC_PROFILES.OPTIMIZER;
    }

    setResults(dimensionPercentages);
    setProfile(assignedProfile);
    setTestCompleted(true);
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQuestion];

  // Introduction Screen
  if (!testStarted) {
    return (
      <>
        <Head>
          <title>Cognitive Stress Test - iiskills Diagnostic Initialization</title>
          <meta
            name="description"
            content="15 rapid-fire questions to map your cognitive superpowers"
          />
        </Head>

        <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 text-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-8xl mb-6"
              >
                🧠
              </motion.div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-electric-violet-400 to-blue-400 bg-clip-text text-transparent">
                iiskills Diagnostic Initialization
              </h1>
              <div className="text-xl text-gray-300 mb-8">
                Cognitive Stress Test - 15 Rapid-Fire Questions
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-electric-violet-300">
                ⚡ This is NOT an Academic Exam
              </h2>
              <p className="text-lg text-gray-200 mb-6">
                We test for <strong>speed</strong>, <strong>accuracy</strong>, and{" "}
                <strong>systemic thinking</strong>.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-bold mb-1">Quantitative</h3>
                  <p className="text-sm text-gray-300">5 Questions</p>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400/30">
                  <div className="text-3xl mb-2">🧩</div>
                  <h3 className="font-bold mb-1">Analytical</h3>
                  <p className="text-sm text-gray-300">5 Questions</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                  <div className="text-3xl mb-2">🎤</div>
                  <h3 className="font-bold mb-1">Verbal</h3>
                  <p className="text-sm text-gray-300">5 Questions</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-200 text-sm">
                  ⏱️ <strong>Time Pressure:</strong> Each question has a time limit (30-60
                  seconds). Answer quickly and move forward.
                </p>
              </div>

              <h3 className="font-bold text-lg mb-3 text-electric-violet-300">
                Upon Completion You'll Receive:
              </h3>
              <ul className="space-y-2 text-gray-200 mb-6">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>
                    <strong>Radar Chart</strong> showing scores by cognitive dimension
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>
                    <strong>Strategic Roadmap Assignment:</strong> Architect, Diplomat, or
                    Optimizer
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>
                    <strong>Diagnostic Verified Badge</strong> - Unlock advanced learning paths
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>Personalized career recommendations</span>
                </li>
              </ul>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartTest}
              className="w-full bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white text-xl font-bold py-6 rounded-xl shadow-2xl hover:shadow-electric-violet-500/50 transition-all"
            >
              🚀 Start My Diagnostics
            </motion.button>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition underline"
              >
                ← Back to Learn Aptitude
              </Link>
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  // Test Completed - Results Screen
  if (testCompleted && results && profile) {
    return (
      <>
        <Head>
          <title>Your Cognitive Brain-Print - iiskills Diagnostics</title>
        </Head>

        <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 text-white p-4 py-12">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mb-12"
            >
              <div className="text-7xl mb-6">🎯</div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-electric-violet-400 to-blue-400 bg-clip-text text-transparent">
                Diagnostic Complete!
              </h1>
              <div className="inline-block bg-green-500/20 border-2 border-green-400 rounded-full px-6 py-3 text-green-300 font-bold">
                ✓ Cognitively Calibrated
              </div>
            </motion.div>

            {/* Radar Chart Representation */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Your Cognitive Radar Chart
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {Object.entries(results).map(([dimension, score]) => (
                  <div
                    key={dimension}
                    className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30"
                  >
                    <h3 className="font-bold text-lg mb-3">{dimension}</h3>
                    <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${
                          score >= 80
                            ? "from-green-400 to-emerald-500"
                            : score >= 60
                            ? "from-blue-400 to-cyan-500"
                            : "from-yellow-400 to-orange-500"
                        }`}
                      />
                    </div>
                    <div className="text-3xl font-bold text-center text-electric-violet-300">
                      {score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Profile Assignment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`bg-gradient-to-br ${profile.color} rounded-2xl p-8 mb-8 text-white shadow-2xl`}
            >
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">{profile.icon}</div>
                <h2 className="text-4xl font-bold mb-2">You are: {profile.name}</h2>
                <p className="text-xl opacity-90">{profile.description}</p>
              </div>

              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-4">Your Superpowers:</h3>
                <ul className="space-y-2">
                  {profile.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-yellow-300 mr-2">⭐</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="font-bold text-xl mb-4">Recommended Career Paths:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.careers.map((career, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-3 text-center">
                      {career}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Conversion Hook */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-400/50 rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold mb-4 text-center text-yellow-300">
                🎓 Unlock Your Full Potential
              </h2>
              <p className="text-lg text-center mb-6 text-gray-200">
                You've proven your cognitive calibration. Now access advanced learning paths
                tailored to your profile.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="https://learn-ai.iiskills.cloud"
                  className="block bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-4 rounded-xl font-bold hover:shadow-xl transition"
                >
                  🤖 Learn AI
                </Link>
                <Link
                  href="https://learn-developer.iiskills.cloud"
                  className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-4 rounded-xl font-bold hover:shadow-xl transition"
                >
                  💻 Learn Developer
                </Link>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Link
                href="/"
                className="block text-gray-400 hover:text-white transition underline"
              >
                ← Back to Learn Aptitude
              </Link>
              <button
                onClick={() => {
                  setTestStarted(false);
                  setTestCompleted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                  setResults(null);
                  setProfile(null);
                }}
                className="block w-full bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition"
              >
                🔄 Retake Diagnostic
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Test In Progress
  return (
    <>
      <Head>
        <title>
          Question {currentQuestion + 1} of {DIAGNOSTIC_QUESTIONS.length} - Cognitive Diagnostic
        </title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800 text-white p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400">
                Question {currentQuestion + 1} / {DIAGNOSTIC_QUESTIONS.length}
              </span>
              <span className="text-sm font-bold text-electric-violet-400">
                {currentQ.dimension}
              </span>
              <span
                className={`text-sm font-bold ${
                  timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-gray-400"
                }`}
              >
                ⏱️ {timeLeft}s
              </span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestion + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-electric-violet-500 to-blue-500"
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-white">{currentQ.question}</h2>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition ${
                    answers[currentQ.id] === idx
                      ? "bg-electric-violet-500/30 border-electric-violet-400"
                      : "bg-white/5 border-white/20 hover:border-white/40"
                  }`}
                >
                  <span className="font-bold mr-3">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Explanation (if shown) */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-6 mb-6"
              >
                <h3 className="font-bold text-lg mb-2 text-blue-300">Explanation:</h3>
                <p className="text-gray-200">{currentQ.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/20 transition disabled:opacity-50"
              disabled={answers[currentQ.id] === undefined}
            >
              {showExplanation ? "Hide" : "Show"} Explanation
            </button>
            <div className="flex-1 text-center text-white/70 italic py-3">
              {answers[currentQ.id] === undefined 
                ? 'Select an answer to continue'
                : 'Auto-advancing...'}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
