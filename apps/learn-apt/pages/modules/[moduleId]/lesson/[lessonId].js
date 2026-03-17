import path from "path";
import fs from "fs";
import { createLoader } from "@iiskills/content-loader";
import { moduleTopics } from "../../../../lib/curriculumGenerator";

export async function getStaticPaths() {
  const paths = [];
  for (let moduleId = 1; moduleId <= 30; moduleId++) {
    for (let lessonId = 1; lessonId <= 10; lessonId++) {
      paths.push({
        params: { moduleId: String(moduleId), lessonId: String(lessonId) },
      });
    }
  }
  return { paths, fallback: false };
}

function buildFallbackLesson(moduleId, lessonId) {
  const module = moduleTopics.find((m) => m.id === Number(moduleId));
  const moduleName = module ? module.title : `Module ${moduleId}`;
  return {
    moduleId: Number(moduleId),
    lessonId: Number(lessonId),
    title: `${moduleName} — Lesson ${lessonId}`,
    isFree: Number(lessonId) === 1,
    content: `
      <h2>Module ${moduleId}, Lesson ${lessonId}: ${moduleName}</h2>
      <h3>Introduction</h3>
      <p>Aptitude is the foundation of analytical thinking and problem-solving. This lesson covers core topics in <strong>${moduleName}</strong>.</p>
      <h3>Key Concepts</h3>
      <p>Work through the key concepts for <strong>${moduleName} — Lesson ${lessonId}</strong> carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>You have completed the overview for ${moduleName}, Lesson ${lessonId}. Continue to the next lesson to build on these foundations.</p>
    `,
    quiz: [
      {
        question: "What is the most effective strategy for solving aptitude problems?",
        options: [
          "Guess randomly to save time",
          "Identify the problem type and apply the most efficient method",
          "Always use the longest method to be thorough",
          "Skip all problems that seem difficult",
        ],
        correct_answer: 1,
      },
      {
        question: "If A can do a job in 10 days and B in 15 days, how many days do they take together?",
        options: ["5 days", "6 days", "8 days", "12 days"],
        correct_answer: 1,
      },
      {
        question: "What is 15% of 200?",
        options: ["25", "30", "35", "40"],
        correct_answer: 1,
      },
      {
        question: "Which number comes next in the series: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "48"],
        correct_answer: 1,
      },
      {
        question: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
        options: ["70 km/h", "75 km/h", "80 km/h", "85 km/h"],
        correct_answer: 2,
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  const { moduleId, lessonId } = params;
  const contentRoot = path.resolve(process.cwd(), "../../content");
  const loader = createLoader(contentRoot);

  // 1. Try filesystem content
  const fsLesson = loader.getLesson("learn-apt", moduleId, lessonId);
  if (fsLesson) {
    return { props: { lesson: fsLesson, moduleId, lessonId } };
  }

  // 2. Try seed.json lesson data
  try {
    const seedPath = path.resolve(process.cwd(), "data", "seed.json");
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
    const lessonId_ = `${moduleId}-${lessonId}`;
    const seedLesson = seed.lessons.find((l) => l.id === lessonId_);
    const seedQuiz = seed.quizzes.find((q) => q.lesson_id === lessonId_);
    if (seedLesson) {
      return {
        props: {
          lesson: {
            moduleId: Number(moduleId),
            lessonId: Number(lessonId),
            title: seedLesson.title,
            isFree: seedLesson.is_free,
            content: seedLesson.content,
            quiz: seedQuiz ? seedQuiz.questions : [],
          },
          moduleId,
          lessonId,
        },
      };
    }
  } catch (_) {
    // seed.json unavailable — fall through
  }

  // 3. Inline fallback
  const lesson = buildFallbackLesson(moduleId, lessonId);
  return { props: { lesson, moduleId, lessonId } };
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCurrentUser } from "../../../../lib/supabaseClient";
import { LessonContent } from "@iiskills/ui/content";

const NO_BADGES_KEY = "learn-apt-noBadges";

function QuizComponent({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers, answerIndex];
    setSelectedAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        let correct = 0;
        newAnswers.forEach((ans, i) => {
          if (ans === questions[i].correct_answer) correct++;
        });
        setScore(correct);
        setShowResults(true);
        onComplete(correct >= 3, correct);
      }
    }, 300);
  };

  if (showResults) {
    const passed = score >= 3;
    return (
      <div className={`card border-2 ${passed ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}>
        <h3 className="text-xl font-semibold mb-2">{passed ? "🎉 Quiz Passed!" : "❌ Quiz Not Passed"}</h3>
        <p className="text-gray-700">You scored {score} out of {questions.length}</p>
      </div>
    );
  }

  const q = questions[currentQuestion];
  return (
    <div className="card">
      <p className="text-sm text-gray-500 mb-2">Question {currentQuestion + 1} of {questions.length}</p>
      <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
      <div className="space-y-3">
        {q.options.map((option, i) => (
          <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-colors">
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LessonPage({ lesson, moduleId, lessonId }) {
  const router = useRouter();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [noBadges, setNoBadges] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false); // eslint-disable-line no-unused-vars

  useEffect(() => {
    try { setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true"); } catch { /* */ }
  }, []);

  useEffect(() => { setQuizCompleted(false); }, [moduleId, lessonId]);

  useEffect(() => { getCurrentUser(); }, []);

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    if (passed) {
      try {
        await fetch("/api/assessments/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson_id: lessonId, module_id: moduleId, score }),
        });
      } catch { /* */ }
    }
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 30) {
        router.push(`/modules/${moduleId}/final-test`);
      } else {
        router.push("/curriculum");
      }
    }
  };

  const confirmSkip = () => {
    try { localStorage.setItem(NO_BADGES_KEY, "true"); } catch { /* */ }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextLesson();
  };

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Aptitude</title>
        <meta name="description" content={`Learn Aptitude — Module ${moduleId}, Lesson ${lessonId}`} />
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {noBadges && (
            <div role="alert" className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm">
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but you won&apos;t earn badges.
            </div>
          )}
          <div className="mb-6">
            <button onClick={() => router.push("/curriculum")} className="text-blue-600 hover:text-blue-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Curriculum
            </button>
          </div>
          <div className="card mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500">Module {moduleId}</span>
              <h1 className="text-3xl font-bold mt-2">{lesson.title}</h1>
            </div>
            <LessonContent html={lesson.content} />
          </div>
          {lesson.quiz && !quizCompleted && (
            <>
              <QuizComponent key={`${moduleId}-${lessonId}`} questions={lesson.quiz} onComplete={handleQuizComplete} />
            </>
          )}
          {(quizCompleted || noBadges) && (
            <div className={`card border-2 ${quizCompleted && !noBadges ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-400"}`}>
              {quizCompleted && !noBadges ? (
                <>
                  <h3 className="text-xl font-semibold text-green-800 mb-4">🎉 Quiz Passed!</h3>
                  <p className="text-gray-700 mb-4">Great work! You&apos;ve completed this lesson.</p>
                </>
              ) : (
                <p className="text-gray-700 mb-4">Continue to the next lesson.</p>
              )}
              <button onClick={goToNextLesson} className="btn-primary">Continue to Next Lesson</button>
            </div>
          )}
          {showSkipDialog && (
            <div role="dialog" aria-modal="true" aria-labelledby="skip-dialog-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">Continue?</h2>
                <p className="text-gray-700 mb-6">
                  Are you sure you want to continue without completing the quiz?
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">Cancel</button>
                  <button onClick={confirmSkip} className="btn-primary">Continue</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
