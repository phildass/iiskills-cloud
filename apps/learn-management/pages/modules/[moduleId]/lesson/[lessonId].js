import path from 'path';
import { createLoader } from '@iiskills/content-loader';
import { moduleTopics } from '../../../../lib/curriculumGenerator';

// ---------------------------------------------------------------------------
// Static generation: pre-render all 10×10 lesson pages at build time.
// Content is loaded from the filesystem (content/learn-management/lessons/) with
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
      <p>Management is the discipline of getting things done through people. This lesson covers core topics in <strong>${moduleName}</strong>.</p>
      <h3>Key Concepts</h3>
      <p>Work through the key concepts for <strong>${moduleName} — Lesson ${lessonId}</strong> carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>You have completed the overview for ${moduleName}, Lesson ${lessonId}. Continue to the next lesson to build on these foundations.</p>
    `,
    quiz: [
      {
        question: "What are the four core functions of management?",
        options: [
          "Planning, Organizing, Leading, and Controlling",
          "Hiring, Firing, Promoting, and Demoting",
          "Marketing, Sales, Finance, and Operations",
          "Analyzing, Designing, Implementing, and Testing",
        ],
        correct_answer: 0,
      },
      {
        question: "Which leadership style involves involving team members in decision-making?",
        options: [
          "Autocratic leadership",
          "Laissez-faire leadership",
          "Democratic (participative) leadership",
          "Transactional leadership",
        ],
        correct_answer: 2,
      },
      {
        question: "What does SMART stand for in goal-setting?",
        options: [
          "Simple, Manageable, Achievable, Realistic, Timely",
          "Specific, Measurable, Achievable, Relevant, Time-bound",
          "Strategic, Meaningful, Actionable, Responsible, Trackable",
          "Structured, Motivated, Agile, Results-driven, Targeted",
        ],
        correct_answer: 1,
      },
      {
        question: "What is organisational behaviour?",
        options: [
          "The study of how buildings are organized",
          "The study of how individuals and groups act within organizations",
          "The process of restructuring a company",
          "A type of financial reporting",
        ],
        correct_answer: 1,
      },
      {
        question: "What is the primary purpose of change management?",
        options: [
          "To avoid any changes in the organization",
          "To guide and support employees through organizational transitions",
          "To automate business processes",
          "To reduce the workforce",
        ],
        correct_answer: 1,
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
    loader.getLesson('learn-management', moduleId, lessonId) ||
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

export default function LessonPage({ lesson, moduleId, lessonId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);

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

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Management</title>
        <meta name="description" content={`Learn Management - Module ${moduleId}, Lesson ${lessonId}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
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

          {lesson.quiz && (
            <QuizComponent
              key={`${moduleId}-${lessonId}`}
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
                Congratulations! You&apos;ve successfully completed this lesson.
              </p>
              <button onClick={goToNextLesson} className="btn-primary">
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Enrollment Landing — shown after sample lesson quiz completion */}
      {showEnrollment && (
        <EnrollmentLandingPage
          appId="learn-management"
          appName="Learn Management"
          appHighlight="Standardize your leadership systems and optimize team efficiency. Master strategic business management frameworks."
          showAIDevBundle={false}
          onClose={() => setShowEnrollment(false)}
        />
      )}
    </>
  );
}
