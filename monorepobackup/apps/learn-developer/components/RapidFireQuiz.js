"use client";

import { useState, useEffect } from 'react';

/**
 * RapidFireQuiz Component
 * 
 * Implements the rapid-fire quiz logic specified in the requirements:
 * - Clicking an answer automatically transitions to the next question
 * - No "Next" button needed - instant progression
 * - Scoring logic: <30% fail, 30-70% pass, >90% honors
 */
export default function RapidFireQuiz({ questions, onComplete, moduleTitle }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (answerIndex) => {
    if (isTransitioning) return; // Prevent double-clicks during transition
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    setIsTransitioning(true);
    
    // Rapid-fire: automatically move to next question after brief delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateScore(newAnswers);
      }
      setIsTransitioning(false);
    }, 500); // 500ms transition delay for visual feedback
  };

  const calculateScore = (answers) => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
    
    const percentage = (correctCount / questions.length) * 100;
    const passed = percentage >= 30;
    
    onComplete(passed, correctCount, percentage);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
    setIsTransitioning(false);
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    const isExcellence = percentage > 90;
    const isPass = percentage >= 30 && percentage <= 70;
    const isFail = percentage < 30;
    
    return (
      <div className={`card ${
        isExcellence ? 'bg-purple-50 border-2 border-purple-500' :
        isPass ? 'bg-green-50 border-2 border-green-500' :
        'bg-red-50 border-2 border-red-500'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4">
            {isExcellence ? '🏆' : isPass ? '🎉' : '❌'}
          </div>
          <h3 className={`text-2xl font-bold mb-4 ${
            isExcellence ? 'text-purple-800' :
            isPass ? 'text-green-800' :
            'text-red-800'
          }`}>
            {isExcellence ? 'Certificate of Excellence!' :
             isPass ? 'Certificate of Completion!' :
             'Review Required'}
          </h3>
          <p className="text-3xl font-bold mb-2">
            {score} / {questions.length}
          </p>
          <p className="text-xl mb-6 text-gray-700">
            {percentage.toFixed(1)}% Score
          </p>
          
          {isExcellence && (
            <div className="mb-6 p-4 bg-white rounded-lg">
              <p className="text-gray-800 font-semibold">
                🌟 Outstanding Performance! 🌟
              </p>
              <p className="text-gray-600 mt-2">
                You've demonstrated exceptional mastery of {moduleTitle}. Your dedication to excellence is inspiring!
              </p>
            </div>
          )}
          
          {isPass && (
            <div className="mb-6 p-4 bg-white rounded-lg">
              <p className="text-gray-800 font-semibold">
                Great work! You've successfully completed this module.
              </p>
              <p className="text-gray-600 mt-2">
                You've shown solid understanding. Keep building on this foundation!
              </p>
            </div>
          )}
          
          {isFail && (
            <div className="mb-6 p-4 bg-white rounded-lg">
              <p className="text-gray-800 font-semibold">
                Don't be discouraged! Learning is a journey.
              </p>
              <p className="text-gray-600 mt-2">
                Review the lesson material and try again. You need at least 30% to pass (2 out of 5 questions).
              </p>
              <button onClick={resetQuiz} className="btn-primary mt-4">
                Retry Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">⚡ Rapid-Fire Test</h3>
          <span className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-500 italic">
          💡 Select your answer - the quiz will automatically advance!
        </p>
      </div>

      <h4 className="text-lg font-medium mb-6">{question.question}</h4>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={isTransitioning}
            className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${
              isTransitioning && selectedAnswers[currentQuestion] === index
                ? 'border-blue-500 bg-blue-100 scale-95'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            } ${isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
          >
            <div className="flex items-start">
              <span className="font-semibold text-blue-600 mr-3">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="flex-1">{option}</span>
            </div>
          </button>
        ))}
      </div>
      
      {isTransitioning && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-blue-600">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Moving to next question...
          </div>
        </div>
      )}
    </div>
  );
}
