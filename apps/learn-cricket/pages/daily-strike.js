/**
 * Daily Strike Page
 * 
 * 5-10 World Cup focused trivia questions daily challenge
 * Features:
 * - Questions generated from local fixtures
 * - Score tracking
 * - Responsive design
 * - Optional LLM enrichment
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DailyStrike() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  // Fetch questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/daily-strike?count=5');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load questions');
      }

      setQuestions(data.questions || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Prevent changing answer after submission
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    // Update score
    if (isCorrect) {
      setScore(score + 1);
    }

    // Record answer
    setAnswers([
      ...answers,
      {
        questionId: currentQ.id,
        selected: selectedAnswer,
        correct: currentQ.correctAnswer,
        isCorrect
      }
    ]);

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
    fetchQuestions();
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Daily Strike...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Questions</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchQuestions}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render game complete state
  if (gameComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Daily Strike Complete! 🎉</h1>
            
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-xl text-gray-600">
                {percentage}% Correct
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Answers:</h2>
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`p-4 mb-2 rounded-lg ${
                    answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="font-semibold">Question {idx + 1}</div>
                  <div className="text-sm mt-1">
                    Your answer: {answer.selected}
                    {!answer.isCorrect && (
                      <span className="ml-2 text-gray-600">
                        (Correct: {answer.correct})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render quiz question
  const currentQ = questions[currentQuestion];
  
  // Fisher-Yates shuffle for proper randomization
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const allOptions = currentQ
    ? shuffleArray([currentQ.correctAnswer, ...currentQ.distractors])
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Strike ⚡</h1>
          <p className="text-gray-600">Test your World Cup knowledge!</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                {currentQ.category} • {currentQ.difficulty}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {allOptions.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQ.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showCorrect && <span className="text-green-600 font-bold">✓</span>}
                      {showWrong && <span className="text-red-600 font-bold">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!showResult ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    selectedAnswer
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                selectedAnswer === currentQ.correctAnswer
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {selectedAnswer === currentQ.correctAnswer
                  ? '🎉 Correct! Well done!'
                  : `❌ Incorrect. The correct answer is: ${currentQ.correctAnswer}`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
