import path from "path";
import { createLoader } from "@iiskills/content-loader";
import { moduleTopics } from "../../../../../lib/curriculumGenerator";

// ---------------------------------------------------------------------------
// Static generation: pre-render all 10×10 lesson pages at build time.
// Content is loaded from the filesystem (content/learn-physics/lessons/) with
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
    isFree: Number(lessonId) === 1,
    content: `
      <h2>Module ${moduleId}, Lesson ${lessonId}: ${moduleName}</h2>
      <h3>Introduction</h3>
      <p>Physics is the most fundamental of the natural sciences. This lesson covers core topics in <strong>${moduleName}</strong>.</p>
      <h3>Key Concepts</h3>
      <p>Work through the key concepts for <strong>${moduleName} — Lesson ${lessonId}</strong> carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>You have completed the overview for ${moduleName}, Lesson ${lessonId}. Continue to the next lesson to build on these foundations.</p>
    `,
    quiz: [
      {
        question: "What is Newton's First Law of Motion?",
        options: [
          "Force equals mass times acceleration",
          "An object at rest stays at rest unless acted upon by an external force",
          "For every action there is an equal and opposite reaction",
          "Energy can neither be created nor destroyed",
        ],
        correct_answer: 1,
      },
      {
        question: "What is the SI unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        correct_answer: 2,
      },
      {
        question: "What does the Law of Conservation of Energy state?",
        options: [
          "Energy is always lost as heat",
          "Energy can be created from nothing",
          "The total energy of an isolated system remains constant",
          "Kinetic energy always exceeds potential energy",
        ],
        correct_answer: 2,
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["KE = mgh", "KE = Fd", "KE = ½mv²", "KE = mc²"],
        correct_answer: 2,
      },
      {
        question: "What is the relationship between frequency and wavelength?",
        options: [
          "They are directly proportional",
          "They are inversely proportional",
          "They have no relationship",
          "They are always equal",
        ],
        correct_answer: 1,
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
    loader.getLesson("learn-physics", moduleId, lessonId) ||
    buildFallbackLesson(moduleId, lessonId);

  return { props: { lesson, moduleId, lessonId } };
}

// ---------------------------------------------------------------------------
// Page component — receives pre-rendered lesson data as props.
// Auth check still runs client-side but does NOT block content display.
// ---------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import QuizComponent from "../../../../../components/QuizComponent";
import { LessonContent } from "@iiskills/ui/content";

export default function LessonPage({ lesson, moduleId, lessonId }) {
  const router = useRouter();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset quiz completion whenever the lesson changes (prevents SPA state bleed
  // when Next.js reuses the same page component without full unmount)
  useEffect(() => {
    setQuizCompleted(false);
  }, [moduleId, lessonId]);

  const handleQuizComplete = (passed) => {
    setQuizCompleted(passed);
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Physics</title>
        <meta
          name="description"
          content={`Learn Physics - Module ${moduleId}, Lesson ${lessonId}`}
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.push("/")}
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
              Back to Course
            </button>
          </div>

          <div className="card mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500">Module {moduleId}</span>
              <h1 className="text-3xl font-bold mt-2">{lesson.title}</h1>
            </div>

            <LessonContent html={lesson.content} />
          </div>

          {lesson.quiz && (
            <QuizComponent
              key={`${moduleId}-${lessonId}`}
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
            />
          )}

          {quizCompleted && (
            <div className="card bg-green-50 border-2 border-green-500">
              <h3 className="text-xl font-semibold text-green-800 mb-4">🎉 Quiz Passed!</h3>
              <p className="text-gray-700 mb-4">
                Congratulations! You&apos;ve successfully completed this lesson.
              </p>
              <button onClick={goToNextLesson} className="btn-primary">
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
