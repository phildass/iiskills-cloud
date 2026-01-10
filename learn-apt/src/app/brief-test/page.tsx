"use client";
import React, { useState, useEffect, useCallback } from "react";
// Import any other dependencies, contexts, or data here

const questions = [
  // Sample question objects
  // Replace with your dynamic data or props!
  { id: 1, text: "What is 2 + 2?" },
  { id: 2, text: "What color is the sky?" },
];

// Sample module structure (adjust as necessary)
const currentModule = {
  questions: questions,
  // ...other module data
};

const BriefTestPage: React.FC = () => {
  // Replace with your own hooks/state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  // Add other state or context as needed

  // SAFELY derive the current question from the array
  const currentQuestion = currentModule.questions?.[currentQuestionIndex];

  // Add your module index logic as appropriate, or default to 0
  const currentModuleIndex = 0; // update with your real logic

  // Simulate router if needed
  const router = undefined; // replace with useRouter() or your method

  useEffect(() => {
    // Example side-effect: timer, fetch, or tracking
    const timer = setTimeout(() => {
      // ...side effect on question change (optional)
    }, 300);

    return () => clearTimeout(timer);
  }, [
    currentQuestion?.id,
    currentQuestionIndex,
    currentModuleIndex,
    currentModule?.questions?.length,
    answers,
    router,
  ]);

  // Example handler (implement your real logic)
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(idx => idx - 1);
    }
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (
      currentQuestionIndex < (currentModule.questions?.length ?? 0) - 1
    ) {
      setCurrentQuestionIndex(idx => idx + 1);
    }
  }, [currentQuestionIndex]);

  // Render
  return (
    <div>
      <h1>Brief Test</h1>
      {currentQuestion ? (
        <div>
          <div>
            <b>Question {currentQuestionIndex + 1}:</b> {currentQuestion.text}
          </div>
          {/* Example navigation and controls */}
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={
              currentQuestionIndex === (currentModule.questions?.length ?? 0) - 1
            }
          >
            Next
          </button>
        </div>
      ) : (
        <div>No more questions or loading...</div>
      )}
    </div>
  );
};

export default BriefTestPage;