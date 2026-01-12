import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCurrentUser } from "../lib/supabaseClient";
import { getModule } from "../data/curriculum";

/**
 * Module Test Page
 *
 * Displays AI-generated quiz/test for a module
 * Allows users to complete tests and view results
 */
export default function Test() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [module, setModule] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const router = useRouter();
  const { module: moduleId } = router.query;

  // Sample questions (in production, these would be AI-generated)
  const sampleQuestions = [
    {
      id: "q1",
      question: "What is the correct formula for force according to Newton's Second Law?",
      options: ["F = ma", "F = mv", "F = m/a", "F = a/m"],
      correctAnswer: 0,
    },
    {
      id: "q2",
      question: "Which of the following is a vector quantity?",
      options: ["Speed", "Mass", "Velocity", "Temperature"],
      correctAnswer: 2,
    },
    {
      id: "q3",
      question: "What is the SI unit of energy?",
      options: ["Watt", "Newton", "Joule", "Pascal"],
      correctAnswer: 2,
    },
    {
      id: "q4",
      question: "In which type of collision is kinetic energy conserved?",
      options: ["Elastic collision", "Inelastic collision", "Both", "Neither"],
      correctAnswer: 0,
    },
    {
      id: "q5",
      question: "What does the area under a velocity-time graph represent?",
      options: ["Acceleration", "Displacement", "Speed", "Force"],
      correctAnswer: 1,
    },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId) {
      loadModule();
    }
  }, [moduleId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    setUser(currentUser);
    setIsLoading(false);
  };

  const loadModule = () => {
    const moduleData = getModule(moduleId);
    if (!moduleData) {
      router.push("/learn");
      return;
    }

    setModule(moduleData);

    // Check if test is already completed
    const savedProgress = localStorage.getItem("physics-progress");
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setTestCompleted(progress.completedTests?.includes(moduleData.testId) || false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmitTest = () => {
    // Calculate score
    let correctCount = 0;
    sampleQuestions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / sampleQuestions.length) * 100);
    setScore(calculatedScore);

    // Save test completion
    const savedProgress = localStorage.getItem("physics-progress");
    const progress = savedProgress
      ? JSON.parse(savedProgress)
      : { completedLessons: [], completedTests: [] };

    if (!progress.completedTests.includes(module.testId)) {
      progress.completedTests.push(module.testId);
      localStorage.setItem("physics-progress", JSON.stringify(progress));
    }

    setTestCompleted(true);
  };

  if (isLoading || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <>
        <Head>
          <title>Test Results - {module.name}</title>
        </Head>

        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-6xl mb-6">{score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}</div>
              <h1 className="text-4xl font-bold text-primary mb-4">Test Complete!</h1>
              <p className="text-2xl text-charcoal mb-6">
                Your Score: <strong>{score}%</strong>
              </p>

              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className={`h-6 rounded-full transition-all ${
                      score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>

              <div className="text-left mb-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-4">Performance Summary</h3>
                <p className="text-gray-700 mb-2">
                  You answered{" "}
                  {
                    sampleQuestions.filter(
                      (question) => answers[question.id] === question.correctAnswer
                    ).length
                  }{" "}
                  out of {sampleQuestions.length} questions correctly.
                </p>
                {score >= 80 && (
                  <p className="text-green-700 font-semibold">
                    Excellent work! You have mastered this module.
                  </p>
                )}
                {score >= 60 && score < 80 && (
                  <p className="text-yellow-700 font-semibold">
                    Good job! Consider reviewing some concepts to strengthen your understanding.
                  </p>
                )}
                {score < 60 && (
                  <p className="text-red-700 font-semibold">
                    You may want to review the lessons in this module before continuing.
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Link
                  href="/learn"
                  className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Back to Curriculum
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!testStarted) {
    return (
      <>
        <Head>
          <title>Module Test - {module.name}</title>
        </Head>

        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Link href="/learn" className="text-primary hover:underline">
                ← Back to Learning Platform
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-4xl font-bold text-primary mb-4">Module Test</h1>
              <h2 className="text-2xl font-semibold text-charcoal mb-6">{module.name}</h2>

              <div className="mb-8">
                <p className="text-gray-700 mb-4">{module.description}</p>

                <div className="bg-blue-50 border-l-4 border-primary p-6 rounded">
                  <h3 className="font-bold text-charcoal mb-2">Test Instructions:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>This test contains {sampleQuestions.length} multiple-choice questions</li>
                    <li>Each question tests your understanding of the module concepts</li>
                    <li>Choose the best answer for each question</li>
                    <li>You can review and change your answers before submitting</li>
                    <li>A score of 60% or higher is recommended to proceed</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/learn"
                  className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-bold hover:bg-blue-50 transition"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleStartTest}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Start Test
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Taking Test - {module.name}</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{module.name} - Test</h1>
            <p className="text-gray-600">Answer all questions and submit when ready</p>
          </div>

          <div className="space-y-6 mb-8">
            {sampleQuestions.map((question, index) => (
              <div key={question.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-charcoal mb-4">
                  Question {index + 1}: {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        answers[question.id] === optionIndex
                          ? "border-primary bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === optionIndex}
                        onChange={() => handleAnswerSelect(question.id, optionIndex)}
                        className="mr-3"
                      />
                      <span className="text-charcoal">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-gray-600">
                Answered: {Object.keys(answers).length} / {sampleQuestions.length}
              </div>
              <button
                onClick={handleSubmitTest}
                disabled={Object.keys(answers).length !== sampleQuestions.length}
                className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
