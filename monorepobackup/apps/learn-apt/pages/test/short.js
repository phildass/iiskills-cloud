"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../lib/supabaseClient";

// Sample questions for short test (less than 10)
const SHORT_TEST_QUESTIONS = [
  {
    id: 1,
    question: "If 5x + 3 = 18, what is the value of x?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which number should come next in the series: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "34"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
    options: ["True", "False", "Cannot be determined"],
    correctAnswer: 0,
  },
  {
    id: 4,
    question: "A train travels 120 km in 2 hours. What is its average speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "Choose the word that is most similar to 'Meticulous':",
    options: ["Careless", "Careful", "Quick", "Slow"],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "Complete the analogy: Book is to Reading as Fork is to ___",
    options: ["Drawing", "Writing", "Eating", "Cooking"],
    correctAnswer: 2,
  },
];

export default function ShortTest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const router = useRouter();

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
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !testCompleted) {
      handleSubmitTest();
    }
  }, [timeLeft, testStarted, testCompleted]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (currentQuestion < SHORT_TEST_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // On last question, auto-submit after selection
        handleSubmitTest();
      }
    }, 400); // Small delay for visual feedback
  };

  const handleNext = () => {
    if (currentQuestion < SHORT_TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = () => {
    let correctAnswers = 0;
    SHORT_TEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setTestCompleted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentQ = SHORT_TEST_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SHORT_TEST_QUESTIONS.length) * 100;

  return (
    <>
      <Head>
        <title>Short Aptitude Test - Learn Apt</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Short Aptitude Test</h1>
                <p className="text-sm text-gray-600">{SHORT_TEST_QUESTIONS.length} questions</p>
              </div>
              {testStarted && !testCompleted && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</div>
                  <div className="text-sm text-gray-600">Time Remaining</div>
                </div>
              )}
            </div>
          </div>

          {!testStarted ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Instructions</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">This test contains {SHORT_TEST_QUESTIONS.length} questions</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Time limit: 10 minutes</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Each question has one correct answer</p>
                </div>
              </div>
              <button
                onClick={handleStartTest}
                className="w-full py-4 px-6 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Start Test
              </button>
              <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-gray-900">
                ← Back to home
              </Link>
            </div>
          ) : testCompleted ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {score / SHORT_TEST_QUESTIONS.length >= 0.7 ? "🎉" : "👍"}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
              </div>
              <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{score}/{SHORT_TEST_QUESTIONS.length}</div>
                  <div className="text-xl">{Math.round((score / SHORT_TEST_QUESTIONS.length) * 100)}% Correct</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/" className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors">
                  Back to Home
                </Link>
                <button onClick={() => window.location.reload()} className="py-3 px-6 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Retake Test
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {SHORT_TEST_QUESTIONS.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
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
                        answers[currentQ.id] === index ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[currentQ.id] === index ? "border-primary bg-primary" : "border-gray-300"
                        }`}>
                          {answers[currentQ.id] === index && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button onClick={handlePrevious} disabled={currentQuestion === 0} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  ← Previous
                </button>
                <div className="text-sm text-gray-500 italic">
                  {answers[currentQ.id] === undefined 
                    ? 'Select an answer to continue'
                    : currentQuestion === SHORT_TEST_QUESTIONS.length - 1 
                      ? 'Submitting test...'
                      : 'Auto-advancing...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
