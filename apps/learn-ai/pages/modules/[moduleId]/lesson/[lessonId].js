"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import PremiumAccessPrompt from '../../../../components/shared/PremiumAccessPrompt';
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
      <p>Welcome to this comprehensive lesson on AI fundamentals. In this session, we'll explore key concepts that form the foundation of artificial intelligence.</p>
      
      <h3>Introduction</h3>
      <p>Artificial Intelligence represents one of the most transformative technologies of our time. Understanding its principles is crucial for anyone looking to build a career in tech.</p>
      
      <h3>Key Concepts</h3>
      <p>This lesson covers essential topics including machine learning algorithms, data preprocessing, and model evaluation techniques. You'll learn practical approaches to solving real-world problems.</p>
      
      <h3>Practical Applications</h3>
      <p>We'll examine how these concepts apply in industry settings, from recommendation systems to predictive analytics. Understanding these applications helps bridge theory and practice.</p>
      
      <h3>Summary</h3>
      <p>By mastering these fundamentals, you're building a strong foundation for advanced AI topics. Continue practicing and exploring to deepen your understanding.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is the primary goal of supervised learning?",
        options: [
          "To predict outcomes based on labeled data",
          "To cluster unlabeled data",
          "To reduce data dimensions",
          "To generate new data"
        ],
        correct_answer: 0
      },
      {
        question: "Which algorithm is commonly used for classification tasks?",
        options: [
          "K-means clustering",
          "Decision Trees",
          "Principal Component Analysis",
          "Autoencoder"
        ],
        correct_answer: 1
      },
      {
        question: "What does overfitting mean in machine learning?",
        options: [
          "Model performs well on all data",
          "Model memorizes training data but performs poorly on new data",
          "Model uses too few features",
          "Model trains too quickly"
        ],
        correct_answer: 1
      },
      {
        question: "Which metric is best for imbalanced classification problems?",
        options: [
          "Accuracy",
          "F1 Score",
          "Mean Squared Error",
          "R-squared"
        ],
        correct_answer: 1
      },
      {
        question: "What is the purpose of a validation set?",
        options: [
          "To train the model",
          "To test final performance",
          "To tune hyperparameters during training",
          "To store predictions"
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
        <title>{lesson?.title} - Learn AI</title>
        <meta name="description" content={`Learn AI - Module ${moduleId}, Lesson ${lessonId}`} />
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
          appName="Learn AI"
          appHighlight="Move from user to architect. Understand neural logic and AI business models. Master the complete AI curriculum with exclusive Learn Developer bundle access."
          onCancel={() => setShowPremiumPrompt(false)}
        />
      )}

      <Footer />
    </>
  );
}
