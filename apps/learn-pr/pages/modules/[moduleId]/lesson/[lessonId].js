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
      <p>Welcome to this comprehensive lesson on Public Relations. In this session, we'll explore key concepts that form the foundation of effective PR practice.</p>
      
      <h3>Introduction</h3>
      <p>Public Relations is a strategic communication process that builds mutually beneficial relationships between organizations and their publics. Understanding its principles is crucial for anyone looking to build a career in communications.</p>
      
      <h3>Key Concepts</h3>
      <p>This lesson covers essential PR topics including media relations, brand messaging, stakeholder engagement, and campaign strategy. You'll learn practical approaches to managing public perception and organizational reputation.</p>
      
      <h3>Practical Applications</h3>
      <p>We'll examine how these concepts apply in real-world settings, from crisis communication to product launches and corporate communications. Understanding these applications helps bridge theory and practice.</p>
      
      <h3>Summary</h3>
      <p>By mastering these fundamentals, you're building a strong foundation for advanced PR topics. Continue practicing and exploring to deepen your understanding of public relations.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is the primary goal of public relations?",
        options: [
          "To build mutually beneficial relationships between an organization and its publics",
          "To sell products directly to consumers",
          "To manage internal employee communications only",
          "To design advertising campaigns"
        ],
        correct_answer: 0
      },
      {
        question: "Which of the following is a key component of an effective press release?",
        options: [
          "Technical jargon and complex language",
          "A compelling headline and clear news angle",
          "Lengthy disclaimers and legal text",
          "Personal opinions of the PR professional"
        ],
        correct_answer: 1
      },
      {
        question: "What is crisis communication in PR?",
        options: [
          "Communicating only during natural disasters",
          "Managing communications to protect an organization's reputation during challenging events",
          "Avoiding all media contact during a crisis",
          "Sending press releases every day"
        ],
        correct_answer: 1
      },
      {
        question: "Which metric is most useful for measuring PR campaign success?",
        options: [
          "Number of press releases sent",
          "Media impressions and share of voice",
          "Number of staff in the PR team",
          "Office square footage"
        ],
        correct_answer: 1
      },
      {
        question: "What does 'earned media' mean in PR?",
        options: [
          "Paid advertising placements",
          "Content your organization creates and publishes",
          "Organic coverage and mentions achieved through PR efforts",
          "Social media posts by employees"
        ],
        correct_answer: 2
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
        router.push(`/modules/${moduleId}/final-test`);
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
        <title>{lesson?.title} - Learn PR</title>
        <meta name="description" content={`Learn PR - Module ${moduleId}, Lesson ${lessonId}`} />
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
          appName="Learn PR"
          appHighlight="Master the science of public perception and brand influence. Build strategic PR campaigns and manage crisis communications."
          onCancel={() => setShowPremiumPrompt(false)}
        />
      )}

      <Footer />
    </>
  );
}
