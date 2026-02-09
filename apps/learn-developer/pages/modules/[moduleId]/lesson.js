"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../../../components/Footer';
import RapidFireQuiz from '../../../components/RapidFireQuiz';
import PremiumAccessPrompt from '@shared/PremiumAccessPrompt';
import { curriculumData } from '../../../lib/curriculumData';
import { getCurrentUser } from '../../../lib/supabaseClient';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [module, setModule] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId) {
      fetchModule();
    }
  }, [moduleId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
      router.push('/register');
      return;
    }
    setUser(currentUser);
  };

  const fetchModule = async () => {
    try {
      const moduleData = curriculumData.modules.find(m => m.id === parseInt(moduleId));
      if (moduleData) {
        setModule(moduleData);
      } else {
        router.push('/curriculum');
      }
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    // Scroll to quiz section
    setTimeout(() => {
      document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleQuizComplete = async (passed, score, percentage) => {
    setQuizCompleted(passed);
    setQuizScore({ score, total: module?.test.length || 5, percentage });
    
    // Show Premium Access Prompt after completing sample lesson (Module 1)
    if (passed && moduleId === '1') {
      setShowPremiumPrompt(true);
    }
    
    // Save progress (you can integrate with Supabase here)
    console.log('Quiz completed:', { moduleId, passed, score, percentage });
  };

  const goToNextModule = () => {
    const nextModuleId = parseInt(moduleId) + 1;
    if (nextModuleId <= curriculumData.modules.length) {
      router.push(`/modules/${nextModuleId}/lesson`);
    } else {
      router.push('/curriculum');
    }
  };

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading module...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!module) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Module not found</p>
            <Link href="/curriculum" className="btn-primary mt-4 inline-block">
              Back to Curriculum
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{module.title} - Web Developer Bootcamp</title>
        <meta name="description" content={module.description} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/curriculum"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Curriculum
            </Link>
          </div>

          {/* Module Header */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">{module.emoji}</span>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Module {moduleId}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>⏱️ {module.duration}</span>
              <span className={`px-2 py-1 rounded ${
                module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {module.difficulty}
              </span>
            </div>
          </div>

          {/* The Lesson: Deep Dive */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">📚</span>
              The Lesson: Deep Dive
            </h2>
            <div className="prose max-w-none">
              {(module.lesson || module.deepDive || '').split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* The Code Lab */}
          <div className="card mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">💻</span>
              The Code Lab: Clean Code Example
            </h2>
            {typeof module.codeExample === 'object' && module.codeExample.language && (
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Language:</strong> {module.codeExample.language}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {module.codeExample.description}
                </p>
              </div>
            )}
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
              <code>{typeof module.codeExample === 'object' ? module.codeExample.code : module.codeExample}</code>
            </pre>
          </div>

          {/* Start Quiz Button */}
          {!showQuiz && !quizCompleted && (
            <div className="card bg-blue-50 border-2 border-blue-500 text-center">
              <h3 className="text-xl font-semibold mb-4">Ready for the Rapid-Fire Test?</h3>
              <p className="text-gray-700 mb-6">
                Test your knowledge with 5 quick questions. The quiz will automatically advance as you select each answer!
              </p>
              <button onClick={handleStartQuiz} className="btn-primary">
                ⚡ Start Rapid-Fire Test
              </button>
            </div>
          )}

          {/* The Rapid-Fire Test */}
          {showQuiz && !quizCompleted && (
            <div id="quiz-section">
              <RapidFireQuiz
                questions={module.test}
                onComplete={handleQuizComplete}
                moduleTitle={module.title}
              />
            </div>
          )}

          {/* Quiz Completed - Next Module */}
          {quizCompleted && (
            <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500">
              <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                <span className="mr-2">✅</span>
                Module Completed!
              </h3>
              <p className="text-gray-700 mb-6">
                Congratulations! You've successfully completed {module.title}.
              </p>
              {parseInt(moduleId) < curriculumData.modules.length ? (
                <button onClick={goToNextModule} className="btn-primary">
                  Continue to Next Module →
                </button>
              ) : (
                <div>
                  <p className="text-lg font-semibold text-purple-700 mb-4">
                    🎉 You've completed all modules in the Web Developer Bootcamp!
                  </p>
                  <Link href="/curriculum" className="btn-primary inline-block">
                    View All Modules
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Premium Access Prompt - shown after sample lesson completion */}
      {showPremiumPrompt && (
        <PremiumAccessPrompt
          appName="Learn Developer"
          appHighlight="Standardize your coding logic and master full-stack system architecture. Unlock the complete developer curriculum with exclusive Learn AI bundle access."
          onCancel={() => setShowPremiumPrompt(false)}
        />
      )}

      <Footer />
    </>
  );
}
