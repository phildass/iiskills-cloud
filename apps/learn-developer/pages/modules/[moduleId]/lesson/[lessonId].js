import path from "path";
import { createLoader } from "@iiskills/content-loader";
import { moduleTopics } from "../../../../lib/curriculumGenerator";

// ---------------------------------------------------------------------------
// Static generation: pre-render all 10×10 lesson pages at build time.
// Content is loaded from the filesystem (content/learn-developer/lessons/) with
// a fallback to inline-generated content so every page always renders.
// ---------------------------------------------------------------------------

export async function getStaticPaths() {
  const paths = [];
  for (let moduleId = 1; moduleId <= 10; moduleId++) {
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
    isFree: Number(moduleId) === 1 && Number(lessonId) === 1,
    content: `
      <h2>Module ${moduleId}, Lesson ${lessonId}: ${moduleName}</h2>
      <h3>Introduction</h3>
      <p>Full-stack web development is the art and science of building complete applications that run on both client and server. This lesson covers core topics in <strong>${moduleName}</strong>.</p>
      <h3>Key Concepts</h3>
      <p>Work through the key concepts for <strong>${moduleName} — Lesson ${lessonId}</strong> carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>You have completed the overview for ${moduleName}, Lesson ${lessonId}. Continue to the next lesson to build on these foundations.</p>
    `,
    quiz: [
      {
        question: "What is the primary role of a web server?",
        options: [
          "To style the user interface",
          "To handle client requests and send back responses",
          "To store user preferences in the browser",
          "To manage DNS resolution",
        ],
        correct_answer: 1,
      },
      {
        question: "What does REST stand for in web APIs?",
        options: [
          "Remote Execution State Transfer",
          "Representational State Transfer",
          "Reliable Endpoint Service Technology",
          "Request-Response System Template",
        ],
        correct_answer: 1,
      },
      {
        question: "What is the purpose of version control (e.g. Git)?",
        options: [
          "To minify JavaScript files",
          "To track changes to code and collaborate with other developers",
          "To run automated tests",
          "To deploy applications to a server",
        ],
        correct_answer: 1,
      },
      {
        question: "What is the difference between a library and a framework?",
        options: [
          "They are the same thing",
          "A library provides utilities you call; a framework provides a structure that calls your code",
          "Libraries are open source; frameworks are proprietary",
          "Frameworks are faster than libraries",
        ],
        correct_answer: 1,
      },
      {
        question: "What does API stand for?",
        options: [
          "Automated Programming Interface",
          "Application Protocol Integration",
          "Application Programming Interface",
          "Advanced Process Interconnect",
        ],
        correct_answer: 2,
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  const { moduleId, lessonId } = params;
  const contentRoot = path.resolve(process.cwd(), "../../content");
  const loader = createLoader(contentRoot);

  // Try filesystem content first; fall back to inline generation.
  const lesson =
    loader.getLesson("learn-developer", moduleId, lessonId) ||
    buildFallbackLesson(moduleId, lessonId);

  return { props: { lesson, moduleId, lessonId } };
}

// ---------------------------------------------------------------------------
// Page component — receives pre-rendered lesson data as props.
// Auth/entitlement checks still run client-side but do NOT block content display.
// ---------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import QuizComponent from "../../../../components/QuizComponent";
import EnrollmentLandingPage from "@shared/EnrollmentLandingPage";
import { getCurrentUser } from "../../../../lib/supabaseClient";
import { LessonContent } from "@iiskills/ui/content";
import { isFreeAccessEnabled } from "@lib/freeAccess";

const FREE_ACCESS = isFreeAccessEnabled();
const NO_BADGES_KEY = "learn-developer-noBadges";

export default function LessonPage({ lesson, moduleId, lessonId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [noBadges, setNoBadges] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  // Load noBadges flag from localStorage on mount
  useEffect(() => {
    try {
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true");
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  // Reset quiz completion whenever the lesson changes (prevents SPA state bleed
  // when Next.js reuses the same page component without full unmount)
  useEffect(() => {
    setQuizCompleted(false);
  }, [moduleId, lessonId]);

  // Auth check runs in background; never blocks page render.
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);

    // Show Premium Access Prompt after completing sample lesson (Module 1, Lesson 1)
    // Suppressed in free-access mode.
    if (passed && moduleId === "1" && lessonId === "1" && !FREE_ACCESS) {
      setShowEnrollment(true);
    }

    if (passed) {
      try {
        await fetch("/api/assessments/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lesson_id: lessonId,
            module_id: moduleId,
            score: score,
          }),
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 10) {
        router.push(`/modules/${moduleId}/final-test`);
      } else {
        router.push("/curriculum");
      }
    }
  };

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextLesson();
  };

  return (
    <>
      <Head>
        <title>{lesson.title} - Web Developer Bootcamp</title>
        <meta
          name="description"
          content={`Learn Developer - Module ${moduleId}, Lesson ${lessonId}`}
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Skip-mode banner */}
          {noBadges && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
            >
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but
              you won&apos;t earn badges for this course.
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push("/curriculum")}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
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
              <QuizComponent
                key={`${moduleId}-${lessonId}`}
                questions={lesson.quiz}
                onComplete={handleQuizComplete}
              />

              {/* Skip quiz button — shown below quiz */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSkipDialog(true)}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Skip quiz and continue
                </button>
              </div>
            </>
          )}

          {(quizCompleted || noBadges) && (
            <div
              className={`card border-2 ${quizCompleted && !noBadges ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-400"}`}
            >
              {quizCompleted && !noBadges ? (
                <>
                  <h3 className="text-xl font-semibold text-green-800 mb-4">🎉 Quiz Passed!</h3>
                  <p className="text-gray-700 mb-4">
                    Congratulations! You&apos;ve successfully completed this lesson.
                  </p>
                </>
              ) : (
                <p className="text-gray-700 mb-4">Continue to the next lesson.</p>
              )}
              <button onClick={goToNextLesson} className="btn-primary">
                Continue to Next Lesson
              </button>
            </div>
          )}

          {/* Skip confirmation dialog */}
          {showSkipDialog && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">
                  Skip quizzes?
                </h2>
                <p className="text-gray-700 mb-6">
                  You can continue to the next lesson, but you won&apos;t earn badges for this
                  course. <strong>This cannot be undone.</strong>
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmSkip} className="btn-primary">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enrollment Landing — shown after sample lesson quiz completion */}
      {showEnrollment && (
        <EnrollmentLandingPage
          appId="learn-developer"
          appName="Learn Developer"
          appHighlight="Standardize your coding logic and master full-stack system architecture. Unlock the complete developer curriculum with exclusive Learn AI bundle access."
          showAIDevBundle={true}
          onClose={() => setShowEnrollment(false)}
        />
      )}
    </>
  );
}
