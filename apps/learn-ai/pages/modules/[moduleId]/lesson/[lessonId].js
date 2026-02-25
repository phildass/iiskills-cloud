"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import QuizComponent from '../../../../components/QuizComponent';
import EnrollmentLandingPage from '@shared/EnrollmentLandingPage';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [entitled, setEntitled] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId && lessonId) {
      fetchLesson();
      // Gate: modules beyond the sample (module 1, lesson 1) require entitlement
      const isSampleLesson = moduleId === '1' && lessonId === '1';
      if (!isSampleLesson) {
        checkEntitlement();
      } else {
        setEntitled(true); // sample lesson is always accessible
      }
    }
  }, [moduleId, lessonId]);

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
      const res = await fetch(`${apiBase}/api/entitlement?appId=learn-ai`, { headers });
      if (res.ok) {
        const data = await res.json();
        setEntitled(data.entitled);
        if (!data.entitled) setShowEnrollment(true);
      } else {
        setEntitled(false);
        setShowEnrollment(true);
      }
    } catch {
      setEntitled(false);
      setShowEnrollment(true);
    }
  };

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
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
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Artificial Intelligence</h2>

      <h3>Introduction</h3>
      <p>Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems. These processes include learning (acquiring information and the rules to use it), reasoning (applying rules to reach approximate or definite conclusions), and self-correction. AI has moved from science fiction to a technology that shapes every aspect of modern life — from the search results you see to the medical diagnoses being made in hospitals worldwide.</p>
      <p>We are living through what historians will likely call the AI Revolution — a transformation as profound as the Industrial Revolution or the invention of the internet. Understanding AI is no longer optional for knowledge workers; it is a career imperative. Whether you want to build AI systems, deploy them in business contexts, or simply work alongside them effectively, this course gives you the conceptual grounding and practical skills you need.</p>
      <p>This lesson introduces the three foundational pillars of AI: machine learning, neural networks, and practical model deployment. By the end, you will understand how machines learn from data, how neural networks mimic the brain, and how to evaluate AI models for real-world use.</p>

      <h3>Key Concepts</h3>
      <h4>1. The Three Paradigms of AI Learning</h4>
      <p><strong>Supervised Learning</strong> is the most common paradigm. The algorithm learns from a labelled dataset — each training example includes both input data and the correct output. The model learns to map inputs to outputs by minimising prediction error. Examples: email spam classifiers, image recognition, loan default prediction.</p>
      <p><strong>Unsupervised Learning</strong> works without labelled data. The algorithm discovers hidden patterns, groupings, or structure on its own. K-means clustering, DBSCAN, and autoencoders are common tools. Applications include customer segmentation, anomaly detection, and dimensionality reduction for visualisation.</p>
      <p><strong>Reinforcement Learning</strong> trains an agent through trial and error. The agent interacts with an environment, receives rewards for desired actions and penalties for undesired ones, and gradually learns the optimal policy. Reinforcement learning powers game-playing AIs like AlphaGo and is central to robotics and autonomous vehicles.</p>

      <h4>2. Neural Networks and Deep Learning</h4>
      <p>A neural network is a computational model inspired by the structure of biological neurons. It consists of layers of interconnected nodes (neurons), each computing a weighted sum of its inputs and passing the result through an activation function. The "deep" in deep learning refers to networks with many hidden layers.</p>
      <p>Convolutional Neural Networks (CNNs) excel at image tasks by detecting spatial patterns through convolutional filters. Recurrent Neural Networks (RNNs) handle sequential data like text or time series. Transformer architectures, which power models like GPT and BERT, use attention mechanisms to process entire sequences in parallel, enabling unprecedented performance in natural language processing.</p>

      <h4>3. Data Preprocessing and Feature Engineering</h4>
      <p>The quality of your data determines the ceiling of your model's performance. Raw data is almost never clean — it contains missing values, outliers, inconsistent formats, and irrelevant features. Data preprocessing includes: handling missing values (imputation or deletion), normalising numerical features, encoding categorical variables, and removing or treating outliers.</p>
      <p>Feature engineering is the craft of creating new, more informative features from raw data. A date field can be decomposed into day of week, month, quarter, or "days since event" — each potentially more predictive than the raw timestamp. Domain knowledge is critical: a loan officer knows that the ratio of debt to income is a powerful predictor; an algorithm only knows this if you tell it.</p>

      <h4>4. Model Evaluation and Overfitting</h4>
      <p>A model that memorises training data instead of learning generalisable patterns is said to overfit. It performs brilliantly on training data and poorly on new data. Prevention strategies include: regularisation (L1/L2 penalties), dropout layers in neural networks, and early stopping. Cross-validation (splitting data into multiple train/validation folds) gives a more reliable estimate of true generalisation performance than a single train/test split.</p>
      <p>Evaluation metrics must match the problem type. For regression: Mean Absolute Error, RMSE, R². For binary classification: Accuracy, Precision, Recall, F1 Score, AUC-ROC. For imbalanced classes, Accuracy is misleading — a model predicting "not fraud" 100% of the time will be 99.9% accurate in a dataset with 0.1% fraud cases, yet is completely useless. F1 Score and AUC-ROC are far more informative.</p>

      <h4>5. Prompt Engineering</h4>
      <p>With the rise of Large Language Models (LLMs) like GPT-4 and Claude, a new skill has emerged: prompt engineering — the art of crafting inputs that reliably elicit high-quality outputs from AI models. Effective prompts are specific, provide relevant context, define the desired format, and include examples (few-shot prompting). Understanding how to work with LLMs productively is now as important as knowing how to use a search engine.</p>

      <h3>Practical Applications</h3>
      <p><strong>Recommendation Systems:</strong> Services like Netflix, Spotify, and Amazon use collaborative filtering and matrix factorisation to predict what you will enjoy based on the preferences of users with similar tastes. These systems process billions of interactions daily and are directly responsible for a large fraction of content consumption.</p>
      <p><strong>Natural Language Processing:</strong> Sentiment analysis (is this review positive or negative?), named entity recognition (identifying people, places, and organisations in text), machine translation, and chatbot development are all NLP applications that businesses deploy at scale today.</p>
      <p><strong>Computer Vision:</strong> Medical imaging AI can detect cancerous lesions in X-rays and MRI scans with accuracy matching or exceeding specialist doctors. Autonomous vehicle perception systems process camera feeds at 30+ frames per second. Quality control systems in manufacturing lines identify defects faster than any human inspector.</p>
      <p><strong>Predictive Analytics in Business:</strong> Churn prediction, demand forecasting, dynamic pricing, fraud detection, and credit scoring are all AI applications delivering measurable business value. Understanding how to frame a business problem as a machine learning problem — and how to evaluate whether the model is performing well enough to deploy — is the core skill of the AI-savvy manager.</p>

      <h3>Summary</h3>
      <p>Artificial Intelligence is not magic — it is mathematics, statistics, and clever engineering applied at scale to real data. In this lesson you have covered: the three learning paradigms (supervised, unsupervised, and reinforcement); how neural networks and deep learning work; the critical importance of data quality and feature engineering; model evaluation metrics and overfitting prevention; and the emerging skill of prompt engineering for LLMs.</p>
      <p>As you advance through this course, you will move from these conceptual foundations to hands-on model building, AI business strategy, and the ethical considerations that must guide every responsible deployment of AI. The field is evolving at extraordinary speed — but the fundamentals you are learning now are durable. They will continue to matter whether the next breakthrough is a new architecture, a new dataset paradigm, or a new computing substrate.</p>
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
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

            <LessonContent html={lesson?.content} />
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

            {/* Enrollment Landing — shown after sample lesson quiz completion */}
      {showEnrollment && (
        <EnrollmentLandingPage
          appId="learn-ai"
          appName="Learn AI"
          appHighlight="Move from user to architect. Understand neural logic and AI business models. Master the complete AI curriculum with exclusive Learn Developer bundle access."
          showAIDevBundle={true}
          onClose={() => setShowEnrollment(false)}
        />
      )}
    </>
  );
}
