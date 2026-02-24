import path from 'path';
import { createLoader } from '@iiskills/content-loader';
import { moduleTopics } from '../../../../lib/curriculumGenerator';

// ---------------------------------------------------------------------------
// Static generation: pre-render all 10×10 lesson pages at build time.
// Content is loaded from the filesystem (content/<appSlug>/lessons/) with a
// fallback to inline-generated content so every page always renders.
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
      <p>Physics is the most fundamental of the natural sciences. It seeks to understand the basic laws governing matter, energy, space, and time — the very fabric of reality. From the subatomic world of quarks and leptons to the cosmological scale of galaxies and black holes, physics provides the language and tools to describe, predict, and ultimately harness the behaviour of the universe.</p>
      <p>Every technology you use today has physics at its core. The smartphone in your pocket relies on quantum mechanics (semiconductor physics), electromagnetism (wireless transmission), and materials science (glass, silicon). The car you drive uses classical mechanics, thermodynamics, and fluid dynamics.</p>
      <h3>Key Concepts</h3>
      <p>In this lesson you will explore core topics in <strong>${moduleName}</strong>, building on the foundations established in earlier modules. Work through the key concepts carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>Physics is the foundation upon which all other natural sciences and much of engineering is built. As you progress through this course, you will develop both the conceptual understanding and the quantitative problem-solving skills to apply these ideas with confidence.</p>
    `,
    quiz: [
      {
        question: "What is Newton's First Law of Motion?",
        options: [
          "Force equals mass times acceleration",
          "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force",
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
        question: "What is the relationship between frequency and wavelength of a wave?",
        options: [
          "They are directly proportional",
          "They are inversely proportional",
          "They have no relationship",
          "They are always equal",
        ],
        correct_answer: 1,
      },
      {
        question: "What is the formula for kinetic energy?",
        options: ["KE = mgh", "KE = Fd", "KE = ½mv²", "KE = mc²"],
        correct_answer: 2,
      },
    ],
  };
}

export async function getStaticProps({ params }) {
  const { moduleId, lessonId } = params;
  const contentRoot = path.resolve(process.cwd(), '../../content');
  const loader = createLoader(contentRoot);

  // Try filesystem content first; fall back to inline generation.
  const lesson =
    loader.getLesson('learn-physics', moduleId, lessonId) ||
    buildFallbackLesson(moduleId, lessonId);

  return { props: { lesson, moduleId, lessonId } };
}

// ---------------------------------------------------------------------------
// Page component — receives pre-rendered lesson data as props.
// Auth check still runs client-side but does NOT block content display.
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';

export default function LessonPage({ lesson, moduleId, lessonId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Auth check runs in background; never blocks page render.
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      // Show paywall for premium lessons when user is not authenticated.
      if (!currentUser && !lesson.isFree && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
        setShowPaywall(true);
      }
    });
  }, [lesson.isFree]);

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    if (passed) {
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            module_id: moduleId,
            score: score
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
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
        router.push('/curriculum');
      }
    }
  };

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Physics</title>
        <meta name="description" content={`Learn Physics - Module ${moduleId}, Lesson ${lessonId}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Paywall overlay for premium lessons when user is not authenticated */}
          {showPaywall && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
                <p className="text-gray-600 mb-6">
                  Sign in or upgrade your plan to access this lesson.
                </p>
                <button
                  onClick={() => router.push('/register')}
                  className="btn-primary w-full mb-3"
                >
                  Sign In / Register
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  View preview only
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push('/curriculum')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
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

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>

          {lesson.quiz && (
            <QuizComponent 
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
            />
          )}

          {quizCompleted && (
            <div className="card bg-green-50 border-2 border-green-500">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Quiz Passed!
              </h3>
              <p className="text-gray-700 mb-4">
                Congratulations! You've successfully completed this lesson.
              </p>
              <button
                onClick={goToNextLesson}
                className="btn-primary"
              >
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
