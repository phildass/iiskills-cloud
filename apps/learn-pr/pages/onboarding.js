"use client";

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

const PAYMENT_URL = 'https://aienter.in/payments';
const SUPPORT_EMAIL = 'support@iiskills.cloud';

// PR-specific gatekeeper questions for Intermediate level (Basic PR concepts)
const INTERMEDIATE_QUESTIONS = [
  {
    question: "What is the primary goal of Public Relations?",
    options: [
      "To buy advertising space",
      "To earn organic authority through media relations",
      "To manage a company's social media accounts",
      "To design marketing campaigns"
    ],
    correctAnswer: 1
  },
  {
    question: "Which of the following best describes a press release?",
    options: [
      "A paid advertisement in a newspaper",
      "An official statement sent to journalists to announce newsworthy information",
      "A social media post promoting a product",
      "A legal document about company policy"
    ],
    correctAnswer: 1
  },
  {
    question: "In PR crisis management, what should be your FIRST step?",
    options: [
      "Delete all social media posts",
      "Blame another party",
      "Acknowledge the situation and communicate transparently",
      "Wait and see if the issue resolves itself"
    ],
    correctAnswer: 2
  }
];

// PR-specific gatekeeper questions for Advanced level (Basic + Intermediate PR concepts)
const ADVANCED_QUESTIONS = [
  {
    question: "What does 'media clipping' refer to in PR?",
    options: [
      "Editing video content for social media",
      "Collecting and tracking media coverage of your brand or client",
      "Cutting out irrelevant press releases",
      "Reducing the length of press conferences"
    ],
    correctAnswer: 1
  },
  {
    question: "Which metric best measures the effectiveness of a PR campaign?",
    options: [
      "Number of press releases sent",
      "Volume of social media followers",
      "Share of Voice (SOV) and earned media value",
      "Number of emails sent to journalists"
    ],
    correctAnswer: 2
  },
  {
    question: "What is 'message triangulation' in strategic PR communications?",
    options: [
      "Using three different social media platforms simultaneously",
      "Reinforcing key messages across three different communication channels or spokespersons",
      "Sending press releases three times a month",
      "Having three crisis response teams"
    ],
    correctAnswer: 1
  }
];

const LEARNING_PATHS = [
  {
    id: 'basic',
    title: 'Basic',
    emoji: '🟢',
    description: 'Start with PR fundamentals — media relations, press releases, and brand basics.',
    requiresTest: false
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    emoji: '🔵',
    description: 'Apply PR concepts to campaigns, crisis management, and stakeholder communication.',
    requiresTest: true,
    questions: INTERMEDIATE_QUESTIONS
  },
  {
    id: 'advanced',
    title: 'Advanced',
    emoji: '🟣',
    description: 'Master strategic PR, brand influence, perception engineering, and media mastery.',
    requiresTest: true,
    questions: ADVANCED_QUESTIONS
  }
];

export default function Onboarding() {
  const [step, setStep] = useState('select'); // select | test | payment | otp | success
  const [selectedPath, setSelectedPath] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimerRef = useRef(null);
  const [approvedLevel, setApprovedLevel] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  // Clean up any pending transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const handlePathSelect = (path) => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setSelectedPath(path);
    if (path.requiresTest) {
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setIsTransitioning(false);
      setStep('test');
    } else {
      setApprovedLevel('basic');
      setTestResult(null);
      setStep('payment');
    }
  };

  const handleAnswerSelect = (idx) => {
    if (isTransitioning) return;
    setSelectedAnswer(idx);
    setIsTransitioning(true);

    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    const questions = selectedPath.questions;
    transitionTimerRef.current = setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      } else {
        // Calculate score — one attempt only, no retries
        const correctCount = newAnswers.filter(
          (ans, questionIndex) => ans === questions[questionIndex].correctAnswer
        ).length;
        const passed = correctCount === questions.length;
        const level = passed ? selectedPath.id : 'basic';
        setApprovedLevel(level);
        setTestResult({
          passed,
          correctCount,
          totalQuestions: questions.length,
          message: passed
            ? `✅ Great! You've qualified for ${selectedPath.title} level.`
            : `❌ You didn't pass the test. You'll need to start from Basic level. Don't worry - all content is included!`
        });
        setIsTransitioning(false);
        setStep('payment');
      }
    }, 400);
  };

  const handleProceedToPayment = () => {
    window.open(`${PAYMENT_URL}?course=learn-pr&level=${approvedLevel}`, '_blank');
    setStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setOtpError('Please enter a valid 6-digit OTP.');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp, level: approvedLevel })
      });
      if (response.ok) {
        localStorage.setItem('enrollmentLevel', approvedLevel);
        setStep('success');
      } else {
        setOtpError(`Invalid OTP. Please check and try again, or contact ${SUPPORT_EMAIL}`);
      }
    } catch {
      setOtpError(`Unable to verify OTP. Having problems? Contact ${SUPPORT_EMAIL}`);
    } finally {
      setOtpLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <>
        <Head>
          <title>Welcome - Learn PR</title>
        </Head>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Access Granted!</h1>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to the <strong>{approvedLevel ? approvedLevel.charAt(0).toUpperCase() + approvedLevel.slice(1) : ''}</strong> path. Your PR journey begins now!
              </p>
              <a
                href="/curriculum"
                className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-lg"
              >
                Go to Curriculum →
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (step === 'otp') {
    return (
      <>
        <Head>
          <title>Enter OTP - Learn PR</title>
        </Head>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🔐</div>
                <h1 className="text-2xl font-bold text-gray-900">Enter Your OTP</h1>
                <p className="text-gray-600 mt-2">
                  After completing payment at <strong>{PAYMENT_URL}</strong>, you will receive a 6-digit OTP. Enter it below to unlock your course access.
                </p>
              </div>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    6-Digit OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                {otpError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                    {otpError}
                    {otpError.includes('problems') && (
                      <p className="mt-1">
                        Contact:{' '}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline font-semibold">
                          {SUPPORT_EMAIL}
                        </a>
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & Unlock Access'}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Having problems?{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-pink-600 underline font-semibold">
                    Contact {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (step === 'payment') {
    const isPass = testResult?.passed;
    const hasTest = testResult !== null;
    return (
      <>
        <Head>
          <title>Proceed to Payment - Learn PR</title>
        </Head>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              {hasTest ? (
                <>
                  <div className="text-6xl mb-4">{isPass ? '✅' : '❌'}</div>
                  <h1 className={`text-2xl font-bold mb-2 ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                    {isPass ? 'Test Passed!' : 'Test Not Passed'}
                  </h1>
                  <p className="text-gray-700 mb-6">{testResult.message}</p>
                  {!isPass && (
                    <p className="text-sm text-gray-500 mb-4">
                      You scored {testResult.correctCount}/{testResult.totalQuestions}. You&apos;ll be enrolled at <strong>Basic</strong> level.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🟢</div>
                  <h1 className="text-2xl font-bold text-green-600 mb-2">Basic Level Selected!</h1>
                  <p className="text-gray-700 mb-6">
                    No test required. Proceed to payment to unlock your <strong>Basic</strong> level access.
                  </p>
                </>
              )}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-semibold text-indigo-800 mb-1">
                  Approved level: <span className="capitalize">{approvedLevel}</span>
                </p>
                <ol className="text-sm text-indigo-700 space-y-1 list-decimal list-inside mt-2">
                  <li>Click &quot;Proceed to Payment&quot; below</li>
                  <li>Complete payment at {PAYMENT_URL}</li>
                  <li>Receive a 6-digit OTP via SMS/email</li>
                  <li>Enter OTP here to unlock access</li>
                </ol>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-lg mb-3"
              >
                💳 Proceed to Payment
              </button>
              <button
                onClick={() => setStep('select')}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (step === 'test' && selectedPath) {
    const questions = selectedPath.questions;
    const question = questions[currentQuestion];
    return (
      <>
        <Head>
          <title>{selectedPath.title} Test - Learn PR</title>
        </Head>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  {selectedPath.emoji} {selectedPath.title} Gatekeeper Test
                </span>
                <span className="text-sm font-bold text-gray-700">
                  Question {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-xl font-medium text-gray-900">{question.question}</p>
              </div>
              <div className="space-y-3 mb-6">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={isTransitioning}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selectedAnswer === idx
                        ? 'bg-pink-50 border-pink-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <span className="font-bold text-pink-600 mr-3">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="text-gray-900">{option}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  ← Back
                </button>
                <div className="flex-1 text-center text-sm text-gray-500 italic py-3">
                  {isTransitioning ? 'Auto-advancing...' : 'Select an answer to continue'}
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                One attempt only — answer all {questions.length} questions to see your result.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Start Your Journey - Learn PR</title>
        <meta name="description" content="Choose your PR learning path and start your journey" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your PR Journey
            </h1>
            <p className="text-xl text-gray-600">
              Choose your learning path based on your current Public Relations knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {LEARNING_PATHS.map((path) => (
              <div
                key={path.id}
                className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => handlePathSelect(path)}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{path.emoji}</div>
                  <h2 className="text-2xl font-bold text-gray-900">{path.title}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">{path.description}</p>
                {path.requiresTest ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-700 mb-4 text-center">
                    🔒 3-question gatekeeper test (one attempt only)
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-700 mb-4 text-center">
                    💳 No test required — go straight to payment
                  </div>
                )}
                <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition">
                  {path.requiresTest ? 'Take Test & Proceed' : 'Proceed to Payment →'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-white border-2 border-gray-200 rounded-xl p-6 max-w-2xl text-left">
              <h4 className="text-lg font-bold text-gray-900 mb-2">📊 How It Works</h4>
              <div className="space-y-2 text-gray-700 text-sm">
                <p>🟢 <strong>Basic:</strong> No test required → Payment → OTP → Access</p>
                <p>🔵 <strong>Intermediate:</strong> 3-question test (one attempt) → Payment → OTP → Access at approved level</p>
                <p>🟣 <strong>Advanced:</strong> 3-question test (one attempt) → Payment → OTP → Access at approved level</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
