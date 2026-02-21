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
      <p>Welcome to this comprehensive lesson on Chemistry. In this session, we'll explore key concepts that form the foundation of understanding matter and its transformations.</p>
      
      <h3>Introduction</h3>
      <p>Chemistry is the scientific study of matter, its properties, composition, structure, and the changes it undergoes. Understanding its principles is crucial for anyone pursuing a career in science, medicine, or engineering.</p>
      
      <h3>Key Concepts</h3>
      <p>This lesson covers essential chemistry topics including atomic structure, chemical bonding, reactions, stoichiometry, and thermochemistry. You'll learn practical approaches to analyzing substances and predicting chemical behavior.</p>
      
      <h3>Practical Applications</h3>
      <p>We'll examine how these concepts apply in real-world settings, from pharmaceutical development to environmental science. Understanding these applications helps bridge chemistry theory and practical problem-solving.</p>
      
      <h3>Summary</h3>
      <p>By mastering these fundamentals, you're building a strong foundation for advanced chemistry topics. Continue practicing and exploring to deepen your understanding of chemical principles.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is an atom?",
        options: [
          "The smallest unit of a chemical element that retains its chemical properties",
          "A group of molecules bonded together",
          "A type of chemical reaction",
          "A unit of measurement for energy"
        ],
        correct_answer: 0
      },
      {
        question: "What type of bond involves the sharing of electrons between atoms?",
        options: [
          "Ionic bond",
          "Metallic bond",
          "Covalent bond",
          "Hydrogen bond"
        ],
        correct_answer: 2
      },
      {
        question: "What does the pH scale measure?",
        options: [
          "The temperature of a solution",
          "The concentration of hydrogen ions (acidity or alkalinity)",
          "The density of a liquid",
          "The pressure of a gas"
        ],
        correct_answer: 1
      },
      {
        question: "What is a chemical reaction?",
        options: [
          "A physical change in the state of matter",
          "A process where substances are transformed into new substances with different properties",
          "The mixing of two liquids",
          "The boiling of water"
        ],
        correct_answer: 1
      },
      {
        question: "What is the Periodic Table?",
        options: [
          "A calendar of chemistry experiments",
          "A table of chemical reactions",
          "An organized arrangement of all known chemical elements by atomic number",
          "A list of laboratory safety rules"
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
        <title>{lesson?.title} - Learn Chemistry</title>
        <meta name="description" content={`Learn Chemistry - Module ${moduleId}, Lesson ${lessonId}`} />
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
