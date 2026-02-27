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
      <p>Public Relations (PR) is the strategic art and science of managing the spread of information between an individual or organisation and the public. At its core, PR is about crafting and sustaining a positive image, building trust, and fostering meaningful relationships with diverse audiences — from customers and investors to journalists and the broader community.</p>
      <p>Unlike advertising, which is paid promotion, PR earns its credibility through third-party endorsement. A glowing review in a respected newspaper or a well-placed feature story in an industry journal — these are the currency of PR.</p>
      <h3>Key Concepts</h3>
      <p>In this lesson you will explore core topics in <strong>${moduleName}</strong>. Work through the key concepts carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>Public Relations is the strategic management of reputation, relationships, and narratives. As you progress through this course, you will develop both the conceptual understanding and practical skills to excel in communications.</p>
    `,
    quiz: [
      {
        question: "What is the primary goal of public relations?",
        options: [
          "To build mutually beneficial relationships between an organization and its publics",
          "To sell products directly to consumers",
          "To manage internal employee communications only",
          "To design advertising campaigns",
        ],
        correct_answer: 0,
      },
      {
        question: "Which of the following is a key component of an effective press release?",
        options: [
          "Technical jargon and complex language",
          "A compelling headline and clear news angle",
          "Lengthy disclaimers and legal text",
          "Personal opinions of the PR professional",
        ],
        correct_answer: 1,
      },
      {
        question: "What is crisis communication in PR?",
        options: [
          "Communicating only during natural disasters",
          "Managing communications to protect an organization's reputation during challenging events",
          "Avoiding all media contact during a crisis",
          "Sending press releases every day",
        ],
        correct_answer: 1,
      },
      {
        question: "Which metric is most useful for measuring PR campaign success?",
        options: [
          "Number of press releases sent",
          "Media impressions and share of voice",
          "Number of staff in the PR team",
          "Office square footage",
        ],
        correct_answer: 1,
      },
      {
        question: "What does 'earned media' mean in PR?",
        options: [
          "Paid advertising placements",
          "Content your organization creates and publishes",
          "Organic coverage and mentions achieved through PR efforts",
          "Social media posts by employees",
        ],
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
    loader.getLesson('learn-pr', moduleId, lessonId) ||
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
import QuizComponent from '../../../../components/QuizComponent';
import EnrollmentLandingPage from '@shared/EnrollmentLandingPage';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';
import { isFreeAccessEnabled } from '@lib/freeAccess';

const FREE_ACCESS = isFreeAccessEnabled();
const NO_BADGES_KEY = 'learn-pr-noBadges';

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
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === 'true');
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

  // Entitlement check: non-free lessons require authentication (client-side only).
  useEffect(() => {
    if (FREE_ACCESS || lesson.isFree) return;
    const isSampleLesson = moduleId === '1' && lessonId === '1';
    if (!isSampleLesson) {
      checkEntitlement();
    }
  }, [moduleId, lessonId, lesson.isFree]);

  const checkEntitlement = async () => {
    try {
      const { supabase } = await import('../../../../lib/supabaseClient');
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {};
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
      // Entitlement API lives on the main app (iiskills.cloud)
      const apiBase = typeof window !== 'undefined'
        ? `${window.location.protocol}//iiskills.cloud`
        : 'https://iiskills.cloud';
      const res = await fetch(`${apiBase}/api/entitlement?appId=learn-pr`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (!data.entitled) setShowEnrollment(true);
      } else {
        setShowEnrollment(true);
      }
    } catch {
      setShowEnrollment(true);
    }
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);

    // Show Premium Access Prompt after completing sample lesson (Module 1, Lesson 1)
    // Suppressed in free-access mode.
    if (passed && moduleId === '1' && lessonId === '1' && !FREE_ACCESS) {
      setShowEnrollment(true);
    }

    if (passed) {
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            module_id: moduleId,
            score: score,
          }),
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

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, 'true');
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
        <title>{lesson.title} - Learn PR</title>
        <meta name="description" content={`Learn PR - Module ${moduleId}, Lesson ${lessonId}`} />
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
              className={`card border-2 ${quizCompleted && !noBadges ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-400'}`}
            >
              {quizCompleted && !noBadges ? (
                <>
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    🎉 Quiz Passed!
                  </h3>
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
          appId="learn-pr"
          appName="Learn PR"
          appHighlight="Master the science of public perception and brand influence. Build strategic PR campaigns and manage crisis communications."
          showAIDevBundle={false}
          onClose={() => setShowEnrollment(false)}
        />
      )}
    </>
  );
}
