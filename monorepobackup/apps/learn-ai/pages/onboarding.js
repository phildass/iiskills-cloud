"use client";

import { useState } from 'react';
import Head from 'next/head';

const PAYMENT_URL = 'https://aienter.in/payments';
const SUPPORT_EMAIL = 'support@iiskills.cloud';

const INTERMEDIATE_QUESTIONS = [
  {
    question: "Which of the following best describes supervised machine learning?",
    options: [
      "A model that learns from unlabelled data to find hidden patterns",
      "A model trained on labelled input-output pairs to predict outcomes on new data",
      "A model that improves through trial and error using rewards",
      "A model that only processes text data"
    ],
    correctAnswer: 1
  },
  {
    question: "In an artificial neural network, what is the role of an 'activation function'?",
    options: [
      "To initialise the weights of the network",
      "To introduce non-linearity, allowing the network to learn complex patterns",
      "To connect the input layer directly to the output layer",
      "To prevent the model from training"
    ],
    correctAnswer: 1
  },
  {
    question: "What does 'prompt engineering' mean in the context of large language models (LLMs)?",
    options: [
      "Designing the hardware infrastructure for running LLMs",
      "Writing and structuring input prompts to guide LLM outputs effectively",
      "Fine-tuning the weights of an LLM on new data",
      "Compressing an LLM for faster inference"
    ],
    correctAnswer: 1
  }
];

const ADVANCED_QUESTIONS = [
  {
    question: "Which technique is commonly used to adapt a pre-trained LLM to a specific domain with minimal compute?",
    options: [
      "Training from scratch on domain data",
      "Parameter-efficient fine-tuning methods such as LoRA or QLoRA",
      "Increasing the model's context window size",
      "Replacing the tokeniser entirely"
    ],
    correctAnswer: 1
  },
  {
    question: "In production ML systems, what does 'model drift' refer to?",
    options: [
      "A model that has been accidentally deleted from storage",
      "The degradation of model performance over time as real-world data distribution changes",
      "The process of moving a model from development to production",
      "An error in the model's architecture"
    ],
    correctAnswer: 1
  },
  {
    question: "What is Retrieval-Augmented Generation (RAG)?",
    options: [
      "A method to compress large language models for edge deployment",
      "A technique that combines a retrieval system with a generative model to produce grounded, factual responses",
      "A type of reinforcement learning used to train chatbots",
      "A data augmentation strategy for computer vision"
    ],
    correctAnswer: 1
  }
];

const LEARNING_PATHS = [
  {
    id: 'basic',
    title: 'Basic',
    emoji: '🟢',
    description: 'Start with AI fundamentals — what AI is, types of ML, and real-world applications.',
    requiresTest: false
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    emoji: '🔵',
    description: 'Apply AI concepts — neural networks, prompt engineering, and ML model evaluation.',
    requiresTest: true,
    questions: INTERMEDIATE_QUESTIONS
  },
  {
    id: 'advanced',
    title: 'Advanced',
    emoji: '🟣',
    description: 'Master production AI — LLM fine-tuning, RAG systems, deployment, and model monitoring.',
    requiresTest: true,
    questions: ADVANCED_QUESTIONS
  }
];

export default function Onboarding() {
  const [step, setStep] = useState('select');
  const [selectedPath, setSelectedPath] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [approvedLevel, setApprovedLevel] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    if (path.requiresTest) {
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setStep('test');
    } else {
      setApprovedLevel('basic');
      setTestResult(null);
      setStep('payment');
    }
  };

  const handleAnswerSelect = (idx) => {
    setSelectedAnswer(idx);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    const questions = selectedPath.questions;
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const correctCount = newAnswers.filter(
        (ans, idx) => ans === questions[idx].correctAnswer
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
      setStep('payment');
    }
  };

  const handleProceedToPayment = () => {
    window.open(`${PAYMENT_URL}?course=learn-ai&level=${approvedLevel}`, '_blank');
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
          <title>Welcome - Learn AI</title>
        </Head>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <div className="text-7xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-green-600 mb-4">Access Granted!</h1>
              <p className="text-lg text-gray-700 mb-6">
                Welcome to the <strong>{approvedLevel ? approvedLevel.charAt(0).toUpperCase() + approvedLevel.slice(1) : ''}</strong> path. Your AI journey begins now!
              </p>
              <a
                href="/curriculum"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-lg"
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
          <title>Enter OTP - Learn AI</title>
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  {otpLoading ? 'Verifying...' : 'Verify & Unlock Access'}
                </button>
              </form>
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Having problems?{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 underline font-semibold">
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
          <title>Proceed to Payment - Learn AI</title>
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition shadow-lg mb-3"
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
          <title>{selectedPath.title} Test - Learn AI</title>
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
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all"
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
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${
                      selectedAnswer === idx
                        ? 'bg-blue-50 border-blue-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-bold text-blue-600 mr-3">
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
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  {currentQuestion + 1 < questions.length ? 'Next Question →' : 'Submit Test'}
                </button>
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
        <title>Start Your Journey - Learn AI</title>
        <meta name="description" content="Choose your AI learning path and start your journey" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your AI Journey
            </h1>
            <p className="text-xl text-gray-600">
              Choose your learning path based on your current Artificial Intelligence knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {LEARNING_PATHS.map((path) => (
              <div
                key={path.id}
                className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
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
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition">
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
