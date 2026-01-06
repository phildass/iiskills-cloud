"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const modules: Module[] = [
  {
    id: "learning-preferences",
    title: "Learning Preferences",
    description: "Discover how you best absorb and process new information.",
    questions: [
      {
        id: "lp1",
        text: "When learning something new, I prefer to:",
        options: [
          { value: "visual", label: "See diagrams, charts, or demonstrations" },
          { value: "auditory", label: "Listen to explanations or discussions" },
          { value: "kinesthetic", label: "Try it hands-on and learn by doing" },
          { value: "reading", label: "Read detailed written instructions" },
        ],
      },
      {
        id: "lp2",
        text: "I remember information best when:",
        options: [
          { value: "visual", label: "I can picture it in my mind" },
          { value: "auditory", label: "I've discussed it with others" },
          { value: "kinesthetic", label: "I've practiced or applied it" },
          { value: "reading", label: "I've written notes about it" },
        ],
      },
      {
        id: "lp3",
        text: "In a learning environment, I thrive when:",
        options: [
          { value: "structured", label: "There's a clear structure and schedule" },
          { value: "flexible", label: "I can learn at my own pace" },
          { value: "collaborative", label: "I can work with others" },
          { value: "independent", label: "I can explore topics independently" },
        ],
      },
      {
        id: "lp4",
        text: "When studying for an exam, I find it most helpful to:",
        options: [
          { value: "visual", label: "Create mind maps or flowcharts" },
          { value: "auditory", label: "Explain concepts out loud to myself or others" },
          { value: "kinesthetic", label: "Practice with real examples or simulations" },
          { value: "reading", label: "Review my written notes multiple times" },
        ],
      },
      {
        id: "lp5",
        text: "I understand new concepts better when:",
        options: [
          { value: "visual", label: "I can see a visual representation" },
          { value: "auditory", label: "Someone explains it verbally" },
          { value: "kinesthetic", label: "I can experiment with it myself" },
          { value: "reading", label: "I read about it in detail" },
        ],
      },
      {
        id: "lp6",
        text: "My ideal study session includes:",
        options: [
          { value: "structured", label: "Following a specific plan and timeline" },
          { value: "flexible", label: "Exploring topics as my interest guides me" },
          { value: "collaborative", label: "Study groups or discussion with peers" },
          { value: "independent", label: "Solo deep-dive into the material" },
        ],
      },
    ],
  },
  {
    id: "problem-solving",
    title: "Problem-Solving Style",
    description: "Understand your approach to tackling challenges and finding solutions.",
    questions: [
      {
        id: "ps1",
        text: "When faced with a complex problem, I usually:",
        options: [
          { value: "analytical", label: "Break it down into smaller, manageable parts" },
          { value: "intuitive", label: "Trust my gut feeling and instincts" },
          { value: "creative", label: "Brainstorm multiple creative solutions" },
          { value: "methodical", label: "Follow a systematic step-by-step approach" },
        ],
      },
      {
        id: "ps2",
        text: "I make decisions best when I:",
        options: [
          { value: "data", label: "Have all the facts and data available" },
          { value: "experience", label: "Can draw from past experiences" },
          { value: "consultation", label: "Can discuss options with others" },
          { value: "time", label: "Have time to reflect and consider" },
        ],
      },
      {
        id: "ps3",
        text: "When a solution doesn't work, I typically:",
        options: [
          { value: "analyze", label: "Analyze what went wrong in detail" },
          { value: "pivot", label: "Quickly try a completely different approach" },
          { value: "persist", label: "Persist and refine the original approach" },
          { value: "seek_help", label: "Seek advice or help from others" },
        ],
      },
      {
        id: "ps4",
        text: "When approaching a new challenge, I tend to:",
        options: [
          { value: "analytical", label: "Research and gather information first" },
          { value: "intuitive", label: "Jump in and figure it out as I go" },
          { value: "creative", label: "Think of unconventional approaches" },
          { value: "methodical", label: "Apply proven strategies from similar situations" },
        ],
      },
      {
        id: "ps5",
        text: "Under pressure, I'm most likely to:",
        options: [
          { value: "data", label: "Stick to facts and logical analysis" },
          { value: "experience", label: "Rely on what has worked before" },
          { value: "consultation", label: "Seek input from others quickly" },
          { value: "time", label: "Take a moment to think clearly" },
        ],
      },
      {
        id: "ps6",
        text: "I feel most confident in my solutions when:",
        options: [
          { value: "analyze", label: "I've thoroughly examined all possibilities" },
          { value: "pivot", label: "I've kept multiple backup options ready" },
          { value: "persist", label: "I've refined my approach through iteration" },
          { value: "seek_help", label: "I've validated my thinking with others" },
        ],
      },
    ],
  },
  {
    id: "motivation-drivers",
    title: "Motivation Drivers",
    description: "Identify what energizes and motivates you to achieve your goals.",
    questions: [
      {
        id: "md1",
        text: "I feel most motivated when:",
        options: [
          { value: "achievement", label: "I'm working toward a challenging goal" },
          { value: "recognition", label: "My efforts are recognized and appreciated" },
          { value: "growth", label: "I'm learning and growing as a person" },
          { value: "impact", label: "My work makes a meaningful difference" },
        ],
      },
      {
        id: "md2",
        text: "I stay engaged in a task when:",
        options: [
          { value: "autonomy", label: "I have control over how I do it" },
          { value: "variety", label: "There's variety and new challenges" },
          { value: "progress", label: "I can see clear progress being made" },
          { value: "purpose", label: "I understand why it matters" },
        ],
      },
      {
        id: "md3",
        text: "What drives me to push through difficulties is:",
        options: [
          { value: "internal", label: "Personal satisfaction and self-improvement" },
          { value: "external", label: "External rewards and recognition" },
          { value: "competition", label: "Competition and comparison with others" },
          { value: "commitment", label: "Commitment to others or a cause" },
        ],
      },
      {
        id: "md4",
        text: "I'm most energized by projects that:",
        options: [
          { value: "achievement", label: "Push me beyond my current capabilities" },
          { value: "recognition", label: "Showcase my skills and talents" },
          { value: "growth", label: "Teach me something completely new" },
          { value: "impact", label: "Help solve important problems" },
        ],
      },
      {
        id: "md5",
        text: "My ideal work environment provides:",
        options: [
          { value: "autonomy", label: "Freedom to make my own decisions" },
          { value: "variety", label: "Diverse tasks and responsibilities" },
          { value: "progress", label: "Clear metrics and milestones" },
          { value: "purpose", label: "A strong sense of mission" },
        ],
      },
      {
        id: "md6",
        text: "When facing obstacles, I'm sustained by:",
        options: [
          { value: "internal", label: "My own desire to succeed" },
          { value: "external", label: "Accountability to others" },
          { value: "competition", label: "The drive to outperform" },
          { value: "commitment", label: "My promise to see things through" },
        ],
      },
    ],
  },
  {
    id: "numerical-reasoning",
    title: "Numerical Reasoning",
    description: "Assess your ability to work with numbers and solve practical problems.",
    questions: [
      {
        id: "nr1",
        text: "A shopkeeper bought an item for ₹800 and sold it for ₹1,000. What is the profit percentage?",
        options: [
          { value: "15", label: "15%" },
          { value: "20", label: "20%" },
          { value: "25", label: "25%" },
          { value: "30", label: "30%" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "nr2",
        text: "If a product originally costs ₹2,500 and is offered at a 20% discount, what is the final price?",
        options: [
          { value: "1800", label: "₹1,800" },
          { value: "2000", label: "₹2,000" },
          { value: "2100", label: "₹2,100" },
          { value: "2250", label: "₹2,250" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "nr3",
        text: "A person invests ₹10,000 at 8% simple interest per annum. How much interest will they earn in 2 years?",
        options: [
          { value: "1600", label: "₹1,600" },
          { value: "1800", label: "₹1,800" },
          { value: "2000", label: "₹2,000" },
          { value: "1200", label: "₹1,200" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "nr4",
        text: "If 5 workers can complete a task in 12 days, how many days will 3 workers take to complete the same task?",
        options: [
          { value: "15", label: "15 days" },
          { value: "18", label: "18 days" },
          { value: "20", label: "20 days" },
          { value: "24", label: "24 days" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "nr5",
        text: "A train travels 240 km in 4 hours. What is its average speed in km/h?",
        options: [
          { value: "50", label: "50 km/h" },
          { value: "60", label: "60 km/h" },
          { value: "70", label: "70 km/h" },
          { value: "80", label: "80 km/h" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "nr6",
        text: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
        options: [
          { value: "8", label: "8" },
          { value: "10", label: "10" },
          { value: "12", label: "12" },
          { value: "15", label: "15" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "nr7",
        text: "A car's value depreciates by 15% each year. If it's worth ₹4,00,000 today, what will it be worth after 1 year?",
        options: [
          { value: "320000", label: "₹3,20,000" },
          { value: "340000", label: "₹3,40,000" },
          { value: "360000", label: "₹3,60,000" },
          { value: "380000", label: "₹3,80,000" },
          { value: "idk", label: "I don't know" },
        ],
      },
    ],
  },
];

export default function BriefTestPage() {
  const router = useRouter();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentModule = modules[currentModuleIndex];
  const currentQuestion = currentModule?.questions[currentQuestionIndex];
  const totalQuestions = modules.reduce((acc, m) => acc + m.questions.length, 0);
  
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(() => (answeredCount / totalQuestions) * 100, [answeredCount, totalQuestions]);
  
  const isFirstQuestion = currentModuleIndex === 0 && currentQuestionIndex === 0;

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, currentModuleIndex, currentModule.questions.length]);

  const handleSelectAnswer = useCallback((value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
    
    // Check if this is the last question
    const isLast = currentModuleIndex === modules.length - 1 && 
      currentQuestionIndex === currentModule.questions.length - 1;
    
    if (isLast) {
      // Auto-submit when last question is answered
      setTimeout(() => {
        setIsAnalyzing(true);
        
        // Store answers in sessionStorage for the results page
        const resultsData = {
          testType: "brief",
          answers: { ...answers, [currentQuestion.id]: value },
          modules: modules.map((m) => ({
            id: m.id,
            title: m.title,
            answers: m.questions.map((q) => ({
              questionId: q.id,
              question: q.text,
              answer: q.id === currentQuestion.id ? value : (answers[q.id] || null),
            })),
          })),
          completedAt: new Date().toISOString(),
        };
        
        sessionStorage.setItem("learnapt-results", JSON.stringify(resultsData));
        
        // Also save to localStorage for admin history
        try {
          const historyStr = localStorage.getItem("learnapt-assessment-history");
          const history = historyStr ? JSON.parse(historyStr) : [];
          history.unshift({
            id: `brief-${Date.now()}`,
            ...resultsData,
          });
          // Keep only last 100 assessments
          localStorage.setItem("learnapt-assessment-history", JSON.stringify(history.slice(0, 100)));
        } catch (e) {
          console.error("Failed to save assessment history:", e);
        }
        
        // Short delay to show analyzing state, then navigate
        setTimeout(() => {
          router.push("/results");
        }, 1500);
      }, 300);
      return;
    }
    
    // Auto-advance to next question after a brief delay for better UX
    setTimeout(() => {
      if (currentQuestionIndex < currentModule.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (currentModuleIndex < modules.length - 1) {
        setCurrentModuleIndex((prev) => prev + 1);
        setCurrentQuestionIndex(0);
      }
    }, 300);
  }, [currentQuestion.id, currentQuestionIndex, currentModuleIndex, currentModule.questions.length, answers, router]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prev) => prev - 1);
      const prevModule = modules[currentModuleIndex - 1];
      setCurrentQuestionIndex(prevModule.questions.length - 1);
    }
  }, [currentQuestionIndex, currentModuleIndex]);

  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">Brief Test</span>
          </div>
        </div>
      </header>

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
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>{answeredCount} of {totalQuestions} questions answered</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Module Info */}
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

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Question {currentQuestionIndex + 1} of {currentModule.questions.length}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                {currentQuestion.text}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
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
                      <span className={`${
                        currentAnswer === option.value
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-slate-700 dark:text-slate-300"
                      }`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
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
}
