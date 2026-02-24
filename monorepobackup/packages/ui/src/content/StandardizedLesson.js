/**
 * StandardizedLesson Component
 * 
 * Renders lessons in the unified format:
 * Hook → Core Concept → Formula → Interactive → Test
 * 
 * Used across all learning apps for consistent lesson structure
 */

import { useState } from 'react';

export default function StandardizedLesson({ lesson, onComplete }) {
  const [showInteractive, setShowInteractive] = useState(false);
  const [showTest, setShowTest] = useState(false);

  if (!lesson) {
    return <div className="p-4 text-center">Loading lesson...</div>;
  }

  // Helper function to render text with basic markdown-like formatting
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, idx) => {
      // Handle bold text
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <li key={idx} className="ml-4" dangerouslySetInnerHTML={{ __html: line.replace('•', '') }} />
        );
      }
      // Regular paragraph
      if (line.trim()) {
        return <p key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />;
      }
      return <br key={idx} />;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Lesson Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {lesson.title}
        </h1>
      </div>

      {/* Hook Section - Engaging Scenario */}
      {lesson.hook && (
        <section className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-3xl">🎣</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Think About This...
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed italic">
                {lesson.hook}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Core Concept Section */}
      {lesson.coreConcept && (
        <section className="card">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-3xl">💡</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Core Concept
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                {renderFormattedText(lesson.coreConcept)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Formula Section */}
      {lesson.formula && (
        <section className="card bg-amber-50 border-l-4 border-amber-500">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-3xl">📐</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Key Formula
              </h2>
              <div className="bg-white rounded-lg p-4 font-mono text-lg text-center border-2 border-amber-200">
                {lesson.formula}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Exercise Section */}
      {lesson.interactive && (
        <section className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-3xl">🎮</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Interactive Exercise
              </h2>
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <p className="text-lg text-gray-700 mb-4">
                  {lesson.interactive.prompt}
                </p>
                {!showInteractive ? (
                  <button
                    onClick={() => setShowInteractive(true)}
                    className="btn btn-primary"
                  >
                    👆 Tap to Reveal Answer
                  </button>
                ) : (
                  <div className="mt-4 p-4 bg-green-100 rounded-lg border-2 border-green-400">
                    <p className="text-lg font-semibold text-green-900">
                      ✓ Answer:
                    </p>
                    <p className="text-lg text-green-800 mt-2">
                      {lesson.interactive.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Test Section */}
      {lesson.test && lesson.test.questions && lesson.test.questions.length > 0 && (
        <section className="card bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-3xl">✅</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Quick Quiz
              </h2>
              {!showTest ? (
                <button
                  onClick={() => setShowTest(true)}
                  className="btn btn-primary"
                >
                  Start Quiz
                </button>
              ) : (
                <LessonQuiz
                  questions={lesson.test.questions}
                  onComplete={onComplete}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={() => window.history.back()}
          className="btn btn-secondary"
        >
          ← Back to Module
        </button>
        {onComplete && (
          <button
            onClick={onComplete}
            className="btn btn-primary"
          >
            Mark Complete & Continue →
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Quiz Component for Lesson Tests
 */
function LessonQuiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isQuizComplete = answeredQuestions.length === questions.length;

  const handleAnswerSelect = (index) => {
    if (showExplanation) return; // Don't allow changing after viewing explanation
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    
    setShowExplanation(true);
    setAnsweredQuestions([...answeredQuestions, {
      question: question.question,
      correct: isCorrect
    }]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Quiz complete
      if (onComplete) {
        onComplete({ score, total: questions.length });
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (isQuizComplete && showExplanation && isLastQuestion) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="space-y-6">
        <div className={`p-6 rounded-lg text-center ${
          passed ? 'bg-green-100 border-2 border-green-400' : 'bg-yellow-100 border-2 border-yellow-400'
        }`}>
          <div className="text-6xl mb-4">
            {passed ? '🎉' : '📚'}
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {passed ? 'Great Job!' : 'Keep Practicing!'}
          </h3>
          <p className="text-xl mb-4">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>
          {passed ? (
            <p className="text-lg text-green-800">
              You've mastered this lesson! Continue to the next one.
            </p>
          ) : (
            <p className="text-lg text-yellow-800">
              Review the material and try again. You need 60% to pass.
            </p>
          )}
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowExplanation(false);
              setScore(0);
              setAnsweredQuestions([]);
            }}
            className="btn btn-secondary"
          >
            Retry Quiz
          </button>
          {passed && onComplete && (
            <button
              onClick={() => onComplete({ score, total: questions.length, passed })}
              className="btn btn-primary"
            >
              Continue to Next Lesson →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>Score: {score}/{answeredQuestions.length}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
        <p className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </p>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrectness = showExplanation;

            let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
            if (showCorrectness) {
              if (isCorrect) {
                buttonClass += 'bg-green-100 border-green-400 text-green-900';
              } else if (isSelected && !isCorrect) {
                buttonClass += 'bg-red-100 border-red-400 text-red-900';
              } else {
                buttonClass += 'bg-gray-50 border-gray-200 text-gray-600';
              }
            } else if (isSelected) {
              buttonClass += 'bg-primary/10 border-primary text-primary font-semibold';
            } else {
              buttonClass += 'bg-white border-gray-300 text-gray-900 hover:border-primary hover:bg-primary/5';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={buttonClass}
              >
                <span className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrectness && isCorrect && <span className="text-2xl">✓</span>}
                  {showCorrectness && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">Explanation:</p>
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="btn btn-primary"
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
