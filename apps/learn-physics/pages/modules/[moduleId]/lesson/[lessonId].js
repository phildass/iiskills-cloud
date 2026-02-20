"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

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
      <p>Welcome to this comprehensive lesson on Physics. In this session, we'll explore key concepts that form the foundation of understanding the physical world around us.</p>
      
      <h3>Introduction</h3>
      <p>Physics is the natural science that studies matter, energy, and the forces that shape our universe. Understanding its principles is crucial for anyone looking to build a career in science or engineering.</p>
      
      <h3>Key Concepts</h3>
      <p>This lesson covers essential physics topics including mechanics, thermodynamics, electromagnetism, and wave phenomena. You'll learn practical approaches to solving physical problems using mathematical reasoning.</p>
      
      <h3>Practical Applications</h3>
      <p>We'll examine how these concepts apply in real-world settings, from engineering design to modern technology. Understanding these applications helps bridge physics theory and practical problem-solving.</p>
      
      <h3>Summary</h3>
      <p>By mastering these fundamentals, you're building a strong foundation for advanced physics topics. Continue practicing and exploring to deepen your understanding of the physical world.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is Newton's First Law of Motion?",
        options: [
          "Force equals mass times acceleration",
          "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force",
          "For every action there is an equal and opposite reaction",
          "Energy can neither be created nor destroyed"
        ],
        correct_answer: 1
      },
      {
        question: "What is the SI unit of force?",
        options: [
          "Joule",
          "Watt",
          "Newton",
          "Pascal"
        ],
        correct_answer: 2
      },
      {
        question: "What does the Law of Conservation of Energy state?",
        options: [
          "Energy is always lost as heat",
          "Energy can be created from nothing",
          "The total energy of an isolated system remains constant",
          "Kinetic energy always exceeds potential energy"
        ],
        correct_answer: 2
      },
      {
        question: "What is the relationship between frequency and wavelength of a wave?",
        options: [
          "They are directly proportional",
          "They are inversely proportional",
          "They have no relationship",
          "They are always equal"
        ],
        correct_answer: 1
      },
      {
        question: "What is the formula for kinetic energy?",
        options: [
          "KE = mgh",
          "KE = Fd",
          "KE = ½mv²",
          "KE = mc²"
        ],
        correct_answer: 2
      }
    ];
  };

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
        <title>{lesson?.title} - Learn Physics</title>
        <meta name="description" content={`Learn Physics - Module ${moduleId}, Lesson ${lessonId}`} />
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

      <Footer />
    </>
  );
}
