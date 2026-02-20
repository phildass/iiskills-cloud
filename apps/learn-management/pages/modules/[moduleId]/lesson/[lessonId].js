"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import PremiumAccessPrompt from '@shared/PremiumAccessPrompt';
import { getCurrentUser } from '../../../../lib/supabaseClient';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId && lessonId) {
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
      router.push('/register');
      return;
    }
    setUser(currentUser);
  };

  const fetchLesson = async () => {
    try {
      setLesson({
        id: lessonId,
        module_id: moduleId,
        title: `Lesson ${lessonId}`,
        content: generateLessonContent(moduleId, lessonId),
        quiz: generateQuiz()
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLessonContent = (modId, lessId) => {
    return `
      <h2>Module ${modId}, Lesson ${lessId}</h2>
      <p>Welcome to this comprehensive lesson on Business Management. In this session, we'll explore key concepts that form the foundation of effective organizational leadership and management.</p>
      
      <h3>Introduction</h3>
      <p>Management is the process of planning, organizing, leading, and controlling resources to achieve organizational goals. Understanding these principles is crucial for anyone looking to build a career in business leadership.</p>
      
      <h3>Key Concepts</h3>
      <p>This lesson covers essential management topics including strategic planning, team leadership, organizational behavior, and performance measurement. You'll learn practical approaches to managing people and achieving business outcomes.</p>
      
      <h3>Practical Applications</h3>
      <p>We'll examine how these concepts apply in real-world business settings, from managing cross-functional teams to leading organizational change. Understanding these applications helps bridge management theory and practice.</p>
      
      <h3>Summary</h3>
      <p>By mastering these fundamentals, you're building a strong foundation for advanced management topics. Continue practicing and exploring to deepen your leadership and management skills.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What are the four core functions of management?",
        options: [
          "Planning, Organizing, Leading, and Controlling",
          "Hiring, Firing, Promoting, and Demoting",
          "Marketing, Sales, Finance, and Operations",
          "Analyzing, Designing, Implementing, and Testing"
        ],
        correct_answer: 0
      },
      {
        question: "Which leadership style involves involving team members in decision-making?",
        options: [
          "Autocratic leadership",
          "Laissez-faire leadership",
          "Democratic (participative) leadership",
          "Transactional leadership"
        ],
        correct_answer: 2
      },
      {
        question: "What does SMART stand for in goal-setting?",
        options: [
          "Simple, Manageable, Achievable, Realistic, Timely",
          "Specific, Measurable, Achievable, Relevant, Time-bound",
          "Strategic, Meaningful, Actionable, Responsible, Trackable",
          "Structured, Motivated, Agile, Results-driven, Targeted"
        ],
        correct_answer: 1
      },
      {
        question: "What is organizational behavior?",
        options: [
          "The study of how buildings are organized",
          "The study of how individuals and groups act within organizations",
          "The process of restructuring a company",
          "A type of financial reporting"
        ],
        correct_answer: 1
      },
      {
        question: "What is the primary purpose of change management?",
        options: [
          "To avoid any changes in the organization",
          "To guide and support employees through organizational transitions",
          "To automate business processes",
          "To reduce the workforce"
        ],
        correct_answer: 1
      }
    ];
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    // Show Premium Access Prompt after completing sample lesson (Module 1, Lesson 1)
    if (passed && moduleId === '1' && lessonId === '1') {
      setShowPremiumPrompt(true);
    }
    
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
        router.push(`/modules/${nextModuleId}/lesson/1`);
      } else {
        router.push('/curriculum');
      }
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson?.title} - Learn Management</title>
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
              <h1 className="text-3xl font-bold mt-2">{lesson?.title}</h1>
            </div>

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson?.content }} />
          </div>

          {lesson?.quiz && (
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

      {/* Premium Access Prompt - shown after sample lesson completion */}
      {showPremiumPrompt && (
        <PremiumAccessPrompt
          appName="Learn Management"
          appHighlight="Standardize your leadership systems and optimize team efficiency. Master strategic business management frameworks."
          onCancel={() => setShowPremiumPrompt(false)}
        />
      )}

      <Footer />
    </>
  );
}
