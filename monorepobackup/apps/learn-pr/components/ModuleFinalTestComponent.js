"use client";

import { useState } from 'react';

const PASS_THRESHOLD = 14; // 14 out of 20 to pass
const TOTAL_QUESTIONS = 20;

export default function ModuleFinalTestComponent({ questions, moduleId, appKey, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateScore(newAnswers);
      }
    }, 400);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = (answers) => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    const passed = correctCount >= PASS_THRESHOLD;
    if (onComplete) onComplete(passed, correctCount);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= PASS_THRESHOLD;
    return (
      <div className={`card ${passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
        <h3 className={`text-2xl font-bold mb-4 ${passed ? 'text-green-800' : 'text-red-800'}`}>
          {passed ? '🎉 Module Final Test Passed!' : '❌ Module Final Test Not Passed'}
        </h3>
        <p className="text-lg mb-2">
          You scored <strong>{score}</strong> out of <strong>{questions.length}</strong>
        </p>
        <p className="text-gray-600 mb-4">
          Pass threshold: {PASS_THRESHOLD}/{questions.length}
        </p>
        <p className="text-gray-700 mb-6">
          {passed
            ? 'Congratulations! You have unlocked the next level.'
            : `You need at least ${PASS_THRESHOLD} correct answers. Review the module and try again.`}
        </p>
        {!passed && (
          <button onClick={resetTest} className="btn-primary">
            Retry Final Test
          </button>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">📝 Module Final Test</h3>
          <span className="text-gray-600 text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <p className="text-sm text-amber-700 mb-3">
          Pass threshold: {PASS_THRESHOLD}/{questions.length} — Passing unlocks the next level.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h4 className="text-lg font-medium mb-6">{question.question}</h4>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedAnswers[currentQuestion] === index
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <input
              type="radio"
              name={`final-${currentQuestion}`}
              checked={selectedAnswers[currentQuestion] === index}
              onChange={() => handleAnswer(index)}
              className="mr-4"
            />
            <span className="flex-1">{option}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500 italic">
          {selectedAnswers[currentQuestion] === undefined
            ? 'Select an answer to continue'
            : 'Auto-advancing…'}
        </span>
      </div>
    </div>
  );
}
