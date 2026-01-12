"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, ChevronLeft, ChevronRight } from "lucide-react";

const questions = [
  { id: 1, text: "What is 2 + 2?", options: [{ value: "4", label: "4" }] },
  { id: 2, text: "What color is the sky?", options: [{ value: "blue", label: "Blue" }] },
];

const modules = [
  {
    id: 1,
    title: "Sample Module",
    description: "Sample description",
    questions: questions,
  },
];

const BriefTestPage: React.FC = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentModule = modules[currentModuleIndex];
  const currentQuestion = currentModule?.questions?.[currentQuestionIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const totalQuestions = modules.reduce((sum, m) => sum + m.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;
  const isFirstQuestion = currentModuleIndex === 0 && currentQuestionIndex === 0;

  useEffect(() => {
    const timer = setTimeout(() => {}, 300);
    return () => clearTimeout(timer);
  }, [
    currentQuestion?.id,
    currentQuestionIndex,
    currentModuleIndex,
    currentModule?.questions?.length,
    answers,
  ]);

  const handleSelectAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion?.id || !currentModule?.questions) return;

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));

      const isLast =
        currentModuleIndex === modules.length - 1 &&
        currentQuestionIndex === (currentModule.questions?.length || 0) - 1;

      if (isLast) {
        setTimeout(() => {
          setIsAnalyzing(true);

          const resultsData = {
            testType: "brief",
            answers: { ...answers, [currentQuestion.id]: value },
            modules: modules.map((m) => ({
              id: m.id,
              title: m.title,
              answers: m.questions.map((q) => ({
                questionId: q.id,
                question: q.text,
                answer: q.id === currentQuestion.id ? value : answers[q.id] || null,
              })),
            })),
            completedAt: new Date().toISOString(),
          };

          sessionStorage.setItem("learnapt-results", JSON.stringify(resultsData));

          try {
            const historyStr = localStorage.getItem("learnapt-assessment-history");
            const history = historyStr ? JSON.parse(historyStr) : [];
            history.unshift({
              id: `brief-${Date.now()}`,
              ...resultsData,
            });
            localStorage.setItem(
              "learnapt-assessment-history",
              JSON.stringify(history.slice(0, 100))
            );
          } catch (e) {
            console.error("Failed to save assessment history:", e);
          }

          setTimeout(() => {
            router.push("/results");
          }, 1500);
        }, 300);
        return;
      }

      setTimeout(() => {
        if (currentQuestionIndex < (currentModule.questions?.length || 0) - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentModuleIndex < modules.length - 1) {
          setCurrentModuleIndex((prev) => prev + 1);
          setCurrentQuestionIndex(0);
        }
      }, 300);
    },
    [
      currentQuestion,
      currentQuestionIndex,
      currentModuleIndex,
      currentModule,
      answers,
      router,
    ]
  );

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((idx) => idx - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((idx) => idx - 1);
      const prevModule = modules[currentModuleIndex - 1];
      setCurrentQuestionIndex(prevModule.questions.length - 1);
    }
  }, [currentQuestionIndex, currentModuleIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < (currentModule.questions?.length ?? 0) - 1) {
      setCurrentQuestionIndex((idx) => idx + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((idx) => idx + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, currentModuleIndex, currentModule]);

  return (
    <div>
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {isAnalyzing ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Analyzing Your Responses
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please wait while we prepare your personalized results...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>
                  {answeredCount} of {totalQuestions} questions answered
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {currentModule && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                    Module {currentModuleIndex + 1} of {modules.length}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {currentModule.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentModule.description}
                </p>
              </div>
            )}

            {currentQuestion && currentModule && (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Question {currentQuestionIndex + 1} of{" "}
                  {currentModule.questions?.length || 0}
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  {currentQuestion.text}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelectAnswer(option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        currentAnswer === option.value
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            currentAnswer === option.value
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 dark:border-slate-500"
                          }`}
                        >
                          {currentAnswer === option.value && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span
                          className={`${
                            currentAnswer === option.value
                              ? "text-blue-900 dark:text-blue-100"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isFirstQuestion
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={!currentAnswer}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                  !currentAnswer
                    ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BriefTestPage;