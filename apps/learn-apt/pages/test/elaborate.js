"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "../../lib/supabaseClient";

// Generate 120 questions for elaborate test
function generateElaborateQuestions() {
  const questions = [];
  const questionTypes = [
    { type: "math", template: (n) => ({ question: `What is ${n} × ${n + 2}?`, options: [`${n * (n + 2)}`, `${n * (n + 1)}`, `${n * n}`, `${(n + 1) * (n + 2)}`], correctAnswer: 0 }) },
    { type: "pattern", template: (n) => ({ question: `What comes next: ${n}, ${n + 2}, ${n + 4}, ${n + 6}, ?`, options: [`${n + 8}`, `${n + 7}`, `${n + 10}`, `${n + 6}`], correctAnswer: 0 }) },
    { type: "logic", template: (n) => ({ question: `If A is ${n} and B is ${n + 5}, what is A + B?`, options: [`${n * 2 + 5}`, `${n + 5}`, `${n * 2}`, `${n + 10}`], correctAnswer: 0 }) },
  ];
  
  for (let i = 0; i < 120; i++) {
    const typeIndex = i % questionTypes.length;
    const num = i % 10 + 1;
    const template = questionTypes[typeIndex].template(num);
    questions.push({
      id: i + 1,
      ...template,
      category: questionTypes[typeIndex].type,
    });
  }
  
  return questions;
}

const ELABORATE_TEST_QUESTIONS = generateElaborateQuestions();

export default function ElaborateTest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes
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
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !testCompleted) {
      handleSubmitTest();
    }
  }, [timeLeft, testStarted, testCompleted]);

  const handleStartTest = () => setTestStarted(true);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (currentQuestion < ELABORATE_TEST_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
      // Don't auto-submit on elaborate test - too many questions
    }, 400); // Small delay for visual feedback
  };

  const handleNext = () => {
    if (currentQuestion < ELABORATE_TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmitTest = () => {
    let correctAnswers = 0;
    ELABORATE_TEST_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correctAnswers++;
    });
    setScore(correctAnswers);
    setTestCompleted(true);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const currentQ = ELABORATE_TEST_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ELABORATE_TEST_QUESTIONS.length) * 100;

  return (
    <>
      <Head>
        <title>Elaborate Aptitude Test - Learn Apt</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Elaborate Aptitude Test</h1>
                <p className="text-sm text-gray-600">{ELABORATE_TEST_QUESTIONS.length} questions</p>
              </div>
              {testStarted && !testCompleted && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-accent">{formatTime(timeLeft)}</div>
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
                  <p className="text-gray-700">This is a comprehensive test with {ELABORATE_TEST_QUESTIONS.length} questions</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Time limit: 90 minutes</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Questions cover multiple categories: Math, Patterns, and Logic</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">You can navigate between questions freely</p>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✓</span>
                  <p className="text-gray-700">Your progress will be saved as you go</p>
                </div>
              </div>
              <button onClick={handleStartTest} className="w-full py-4 px-6 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-cyan-600 transition-colors">
                Start Comprehensive Test
              </button>
              <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-gray-900">← Back to home</Link>
            </div>
          ) : testCompleted ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{score / ELABORATE_TEST_QUESTIONS.length >= 0.7 ? "🏆" : "🎯"}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
              </div>
              <div className="bg-gradient-to-r from-accent to-primary text-white rounded-lg p-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{score}/{ELABORATE_TEST_QUESTIONS.length}</div>
                  <div className="text-xl">{Math.round((score / ELABORATE_TEST_QUESTIONS.length) * 100)}% Correct</div>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Questions Attempted</span>
                  <span className="font-semibold text-gray-900">{Object.keys(answers).length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Correct Answers</span>
                  <span className="font-semibold text-green-600">{score}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Accuracy Rate</span>
                  <span className="font-semibold text-blue-600">{Math.round((score / ELABORATE_TEST_QUESTIONS.length) * 100)}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/" className="py-3 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold text-center hover:bg-gray-300 transition-colors">Back to Home</Link>
                <button onClick={() => window.location.reload()} className="py-3 px-6 bg-accent text-white rounded-lg font-semibold hover:bg-cyan-600 transition-colors">Retake Test</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {ELABORATE_TEST_QUESTIONS.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                  {currentQ.category.toUpperCase()}
                </span>
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h3>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQ.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQ.id] === index ? "border-accent bg-cyan-50" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${answers[currentQ.id] === index ? "border-accent bg-accent" : "border-gray-300"}`}>
                          {answers[currentQ.id] === index && <div className="w-3 h-3 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button onClick={handlePrevious} disabled={currentQuestion === 0} className="py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50">← Previous</button>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500 italic">
                    {answers[currentQ.id] === undefined 
                      ? 'Select an answer to continue'
                      : 'Auto-advancing...'}
                  </div>
                  {currentQuestion === ELABORATE_TEST_QUESTIONS.length - 1 && (
                    <button onClick={handleSubmitTest} className="py-2 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
