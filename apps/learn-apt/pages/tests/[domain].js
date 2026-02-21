"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../lib/supabaseClient";
import { QUESTION_BANK, COGNITIVE_DOMAINS } from "../../lib/questionBank";

const DOMAIN_MAP = {
  numerical: {
    key: "numerical",
    title: "Numerical Ability",
    emoji: "💰",
    description: "Arithmetic, percentages, ratios, and financial calculations",
    duration: "15 minutes",
    color: "from-blue-500 to-cyan-500",
  },
  logical: {
    key: "logical",
    title: "Logical Reasoning",
    emoji: "🧩",
    description: "Pattern recognition, syllogisms, and coding-decoding",
    duration: "15 minutes",
    color: "from-purple-500 to-pink-500",
  },
  verbal: {
    key: "verbal",
    title: "Verbal Ability",
    emoji: "🎤",
    description: "Grammar, reading comprehension, and communication",
    duration: "15 minutes",
    color: "from-green-500 to-emerald-500",
  },
  spatial: {
    key: "spatial",
    title: "Spatial / Abstract",
    emoji: "🏗️",
    description: "3D figures, rotations, and spatial patterns",
    duration: "15 minutes",
    color: "from-orange-500 to-red-500",
  },
  "data-interpretation": {
    key: "dataInterpretation",
    title: "Data Interpretation",
    emoji: "📊",
    description: "Charts, tables, and meaningful data insights",
    duration: "15 minutes",
    color: "from-indigo-500 to-violet-500",
  },
};

export default function DomainTest() {
  const router = useRouter();
  const { domain } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  useEffect(() => {
    if (testStarted && !testCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !testCompleted) {
      handleSubmitTest();
    }
  }, [timeLeft, testStarted, testCompleted]);

  if (!domain || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const domainConfig = DOMAIN_MAP[domain];
  if (!domainConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Test not found.</p>
          <Link href="/" className="text-blue-600 hover:underline">← Back to home</Link>
        </div>
      </div>
    );
  }

  const questions = QUESTION_BANK[domainConfig.key] || [];

  const handleStartTest = () => setTestStarted(true);

  const handleAnswerSelect = (questionId, answerIndex) => {
    const updated = { ...answers, [questionId]: answerIndex };
    setAnswers(updated);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitTestWithAnswers(updated);
      }
    }, 400);
  };

  const handleSubmitTestWithAnswers = (finalAnswers) => {
    let correct = 0;
    questions.forEach((q) => {
      if (finalAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setTestCompleted(true);
  };

  const handleSubmitTest = () => handleSubmitTestWithAnswers(answers);

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
      <Head>
        <title>{domainConfig.title} Test – Learn Apt</title>
        <meta name="description" content={`${domainConfig.title} aptitude test – ${domainConfig.description}`} />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl">{domainConfig.emoji}</span>
                  <h1 className="text-2xl font-bold text-gray-900">{domainConfig.title}</h1>
                </div>
                <p className="text-sm text-gray-600">{questions.length} questions · {domainConfig.duration}</p>
              </div>
              {testStarted && !testCompleted && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-600">Time Remaining</div>
                </div>
              )}
            </div>
          </div>

          {!testStarted ? (
            /* Instructions */
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Instructions</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">{questions.length} questions covering {domainConfig.title}</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Time limit: {domainConfig.duration}</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Each question has one correct answer</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Questions auto-advance after selection</p>
                </div>
              </div>
              <button
                onClick={handleStartTest}
                className="w-full py-4 px-6 bg-yellow-600 text-white rounded-lg font-semibold text-lg hover:bg-yellow-700 transition-colors"
              >
                Start Test
              </button>
              <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-gray-900">
                ← Back to home
              </Link>
            </div>
          ) : testCompleted ? (
            /* Results */
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {score / questions.length >= 0.7 ? "🎉" : "👍"}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
                <p className="text-gray-600">{domainConfig.title}</p>
              </div>
              <div className={`bg-gradient-to-r ${domainConfig.color} text-white rounded-lg p-8 mb-8`}>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{score}/{questions.length}</div>
                  <div className="text-xl">{Math.round((score / questions.length) * 100)}% Correct</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/"
                  className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors"
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="py-3 px-6 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Retake Test
                </button>
              </div>
            </div>
          ) : currentQ ? (
            /* Quiz */
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${domainConfig.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h3>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQ.id] === index
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                            answers[currentQ.id] === index
                              ? "border-yellow-500 bg-yellow-500"
                              : "border-gray-300"
                          }`}
                        >
                          {answers[currentQ.id] === index && (
                            <div className="w-3 h-3 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <div className="text-sm text-gray-500 italic">
                  {answers[currentQ.id] === undefined
                    ? "Select an answer to continue"
                    : currentQuestion === questions.length - 1
                    ? "Submitting test..."
                    : "Auto-advancing..."}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
