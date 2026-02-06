"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser } from "../../lib/supabaseClient";
import { QUICK_FIRE_QUESTIONS, BRAIN_FACTS, calculateDomainScore, COGNITIVE_DOMAINS } from "../../lib/questionBank";
import {
  ProgressOrbit,
  QuestionCard,
  AnswerFeedback,
  BrainFactPopup,
  LeaderboardSidebar,
  DifficultyBadge,
  TestTimer,
  DomainTag,
  QuestionNavigation
} from "../../components/TestComponents";
import { BrainPrintGenerator, SuperpowerReveal, CareerAptitudeInsights } from "../../components/BrainPrint";

export default function QuickFireTest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [showBrainFact, setShowBrainFact] = useState(false);
  const [currentBrainFact, setCurrentBrainFact] = useState('');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [showSuperpower, setShowSuperpower] = useState(false);
  const [domainScores, setDomainScores] = useState({});
  const router = useRouter();

  // Mock leaderboard data
  const mockLeaderboard = [
    { name: "Priya S.", score: 93, domain: "Quick-Fire" },
    { name: "Rahul K.", score: 89, domain: "Quick-Fire" },
    { name: "Amit P.", score: 87, domain: "Quick-Fire" },
    { name: "Sneha M.", score: 85, domain: "Quick-Fire" },
    { name: "Vijay R.", score: 82, domain: "Quick-Fire" },
  ];

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

  // Timer countdown
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

  // Show brain fact every 5 questions
  useEffect(() => {
    if (Object.keys(answers).length > 0 && Object.keys(answers).length % 5 === 0 && !showBrainFact) {
      const randomFact = BRAIN_FACTS[Math.floor(Math.random() * BRAIN_FACTS.length)];
      setCurrentBrainFact(randomFact);
      setShowBrainFact(true);
    }
  }, [answers]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    const question = QUICK_FIRE_QUESTIONS.find(q => q.id === questionId);
    const isCorrect = answerIndex === question.correctAnswer;
    
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });

    // Show feedback animation
    setLastAnswerCorrect(isCorrect);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);

    // Auto-advance to next question after short delay
    setTimeout(() => {
      if (currentQuestion < QUICK_FIRE_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 1200);
  };

  const handleNavigate = (index) => {
    setCurrentQuestion(index);
  };

  const handleSubmitTest = () => {
    // Calculate domain scores
    const scores = {};
    Object.values(COGNITIVE_DOMAINS).forEach(domain => {
      scores[domain] = calculateDomainScore(answers, domain);
    });
    setDomainScores(scores);
    setTestCompleted(true);
    setShowSuperpower(true);
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      testType: "Quick-Fire",
      user: user?.email,
      domainScores,
      totalQuestions: QUICK_FIRE_QUESTIONS.length,
      answeredQuestions: Object.keys(answers).length,
      timeSpent: 300 - timeLeft,
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `brain-print-${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  const currentQ = QUICK_FIRE_QUESTIONS[currentQuestion];
  const totalCorrect = QUICK_FIRE_QUESTIONS.filter(q => answers[q.id] === q.correctAnswer).length;
  const overallScore = Object.keys(answers).length > 0 
    ? Math.round((totalCorrect / Object.keys(answers).length) * 100) 
    : 0;

  return (
    <>
      <Head>
        <title>Quick-Fire Challenge - Learn Apt</title>
        <meta name="description" content="5-minute aptitude challenge across all cognitive domains" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800">
        {/* Leaderboard Sidebar */}
        {testStarted && (
          <LeaderboardSidebar
            isOpen={leaderboardOpen}
            onToggle={() => setLeaderboardOpen(!leaderboardOpen)}
            topScorers={mockLeaderboard}
          />
        )}

        {/* Answer Feedback */}
        <AnswerFeedback isCorrect={lastAnswerCorrect} show={showFeedback} />

        {/* Brain Fact Popup */}
        {showBrainFact && (
          <BrainFactPopup
            fact={currentBrainFact}
            onClose={() => setShowBrainFact(false)}
          />
        )}

        {/* Superpower Reveal */}
        {showSuperpower && !testCompleted && (
          <SuperpowerReveal
            domain={COGNITIVE_DOMAINS.NUMERICAL}
            score={domainScores[COGNITIVE_DOMAINS.NUMERICAL] || 0}
            onContinue={() => setShowSuperpower(false)}
          />
        )}

        <div className={`max-w-6xl mx-auto px-4 py-8 ${testStarted && 'lg:pr-96'}`}>
          {/* Header */}
          {!testCompleted && (
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-2">
                      ⚡ Quick-Fire Challenge
                    </h1>
                    <p className="text-gray-300">15 questions across all domains in 5 minutes</p>
                  </div>
                  {testStarted && (
                    <div className="flex items-center gap-4">
                      <TestTimer timeLeft={timeLeft} totalTime={300} />
                      <ProgressOrbit
                        current={currentQuestion + 1}
                        total={QUICK_FIRE_QUESTIONS.length}
                        score={overallScore}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {!testStarted ? (
            // Start Screen
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <QuestionCard>
                <div className="text-center py-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-8xl mb-6"
                  >
                    ⚡
                  </motion.div>
                  <h2 className="text-4xl font-bold text-white mb-6">Ready for the Challenge?</h2>
                  
                  <div className="space-y-4 mb-8 text-left max-w-lg mx-auto">
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-glow text-2xl">✓</span>
                      <p className="text-gray-300 text-lg">15 questions across all 5 cognitive domains</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-glow text-2xl">✓</span>
                      <p className="text-gray-300 text-lg">5-minute time limit - test your speed!</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-glow text-2xl">✓</span>
                      <p className="text-gray-300 text-lg">Get your complete Aptitude Signature</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-glow text-2xl">✓</span>
                      <p className="text-gray-300 text-lg">Brain Facts every 5 questions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-emerald-glow text-2xl">✓</span>
                      <p className="text-gray-300 text-lg">Live leaderboard ranking</p>
                    </div>
                  </div>

                  <button
                    onClick={handleStartTest}
                    className="w-full max-w-md mx-auto py-5 px-8 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white rounded-2xl font-bold text-xl hover:from-electric-violet-600 hover:to-blue-600 transition-all shadow-2xl hover:shadow-electric-violet-500/50 transform hover:scale-105"
                  >
                    🚀 Start Quick-Fire Challenge
                  </button>

                  <Link href="/" className="block mt-6 text-gray-400 hover:text-white transition-colors">
                    ← Back to home
                  </Link>
                </div>
              </QuestionCard>
            </motion.div>
          ) : testCompleted ? (
            // Results Screen
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                  className="text-8xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-2">
                  Challenge Complete!
                </h2>
                <p className="text-xl text-gray-300">
                  You completed {Object.keys(answers).length} out of {QUICK_FIRE_QUESTIONS.length} questions
                </p>
              </div>

              {/* Brain-Print Generator */}
              <BrainPrintGenerator domainScores={domainScores} onExport={exportResults} />

              {/* Career Aptitude Insights */}
              <CareerAptitudeInsights domainScores={domainScores} />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 text-center"
                >
                  ← Back to Home
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white rounded-xl font-semibold hover:from-electric-violet-600 hover:to-blue-600 transition-all text-center"
                >
                  🔄 Retake Challenge
                </button>
              </div>
            </motion.div>
          ) : (
            // Question Screen
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <QuestionCard>
                  {/* Domain and Difficulty Tags */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <DomainTag domain={currentQ.domain} color="from-electric-violet-500 to-blue-500" />
                    <DifficultyBadge level={currentQ.difficulty} />
                  </div>

                  {/* Question */}
                  <h3 className="text-2xl font-semibold text-white mb-8 leading-relaxed">
                    {currentQ.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-4 mb-8">
                    {currentQ.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQ.id, index)}
                        disabled={answers[currentQ.id] !== undefined}
                        whileHover={{ scale: answers[currentQ.id] === undefined ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                          answers[currentQ.id] === index
                            ? answers[currentQ.id] === currentQ.correctAnswer
                              ? 'border-emerald-glow bg-emerald-glow/20'
                              : 'border-ruby-fade bg-ruby-fade/20'
                            : 'border-white/20 hover:border-electric-violet-400 bg-white/5 hover:bg-white/10'
                        } ${answers[currentQ.id] !== undefined ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center ${
                            answers[currentQ.id] === index
                              ? answers[currentQ.id] === currentQ.correctAnswer
                                ? 'border-emerald-glow bg-emerald-glow'
                                : 'border-ruby-fade bg-ruby-fade'
                              : 'border-white/40'
                          }`}>
                            {answers[currentQ.id] === index && (
                              <span className="text-white text-lg">
                                {answers[currentQ.id] === currentQ.correctAnswer ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                          <span className="text-white text-lg">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Question Navigation */}
                  <QuestionNavigation
                    total={QUICK_FIRE_QUESTIONS.length}
                    current={currentQuestion}
                    answers={answers}
                    onNavigate={handleNavigate}
                  />

                  {/* Submit Button (appears on last question) */}
                  {currentQuestion === QUICK_FIRE_QUESTIONS.length - 1 && Object.keys(answers).length === QUICK_FIRE_QUESTIONS.length && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center"
                    >
                      <button
                        onClick={handleSubmitTest}
                        className="px-12 py-5 bg-gradient-to-r from-emerald-glow to-green-600 text-white rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-glow transition-all shadow-2xl transform hover:scale-105"
                      >
                        🏆 Complete & See Results
                      </button>
                    </motion.div>
                  )}
                </QuestionCard>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </>
  );
}
