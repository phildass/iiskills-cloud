"use client";

import { useState } from 'react';

export default function QuizComponent({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    
    // Auto-advance to next question or submit quiz
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateScore();
      }
    }, 400); // Small delay for visual feedback
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
    
    const passed = correctCount >= 4;
    onComplete(passed, correctCount);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  if (showResults) {
    const passed = score >= 4;
    return (
      <div className={`card ${passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
        <h3 className={`text-2xl font-bold mb-4 ${passed ? 'text-green-800' : 'text-red-800'}`}>
          {passed ? '🎉 Quiz Passed!' : '❌ Quiz Not Passed'}
        </h3>
        <p className="text-lg mb-4">
          You scored {score} out of {questions.length}
        </p>
        <p className="text-gray-700 mb-6">
          {passed
            ? 'Congratulations! You scored 4 or more correct answers to pass — well done!'
            : 'You need at least 4 correct answers to pass. Please review the material and try again.'}
        </p>
        {!passed && (
          <button onClick={resetQuiz} className="btn-primary">
            Retry Quiz
          </button>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Lesson Quiz</h3>
          <span className="text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              checked={selectedAnswers[currentQuestion] === index}
              onChange={() => handleAnswer(index)}
              className="mr-4"
            />
            <span className="flex-1">{option}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="text-sm text-gray-500 italic">
          {selectedAnswers[currentQuestion] === undefined 
            ? 'Select an answer to continue'
            : 'Auto-advancing...'}
        </div>
      </div>
    </div>
  );
}
