"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';

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
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Mathematical Thinking</h2>

      <h3>Introduction</h3>
      <p>Mathematics is the universal language of logic, structure, and quantitative reasoning. It underpins every field of human endeavour — from the algorithms that run the internet to the structural calculations behind a skyscraper, from the statistical models that guide medical decisions to the financial instruments traded on global markets. At its heart, mathematics is about identifying patterns, constructing rigorous arguments, and solving problems with precision.</p>
      <p>Many people approach mathematics with anxiety, shaped by experiences of rote memorisation and speed drills that divorced the subject from meaning. This course takes the opposite approach. We begin with understanding — why rules work, not just how to apply them. A student who understands why the quadratic formula works will never forget it; a student who merely memorised it will forget it the day after the exam.</p>
      <p>This lesson covers five fundamental domains of mathematics that recur throughout this course: algebra, geometry, calculus, statistics, and number theory. Each domain is introduced here conceptually and developed in depth in subsequent modules.</p>

      <h3>Key Concepts</h3>
      <h4>1. Algebra: The Language of Relationships</h4>
      <p>Algebra generalises arithmetic by replacing specific numbers with symbols (variables), enabling us to express and solve general relationships. The equation <em>2x + 5 = 13</em> doesn't just mean "find a number" — it expresses a relationship between quantities that holds under specific conditions. Solving for x (x = 4) is finding the precise condition where the relationship balances.</p>
      <p>Linear equations describe constant-rate relationships and graph as straight lines. Quadratic equations (ax² + bx + c = 0) model parabolic relationships — the trajectory of a projectile, the profit curve of a business, the shape of a satellite dish. The quadratic formula x = (-b ± √(b²-4ac)) / 2a is one of the most powerful tools in elementary algebra, giving the exact solutions to any quadratic equation. The discriminant (b²-4ac) tells you immediately whether solutions are real or complex, distinct or repeated.</p>

      <h4>2. Geometry: Space, Shape, and Measurement</h4>
      <p>Geometry is the study of spatial relationships. Euclidean geometry — the geometry of flat planes and 3D space — gave us the Pythagorean theorem (a² + b² = c² for right triangles), the formulae for areas and volumes of standard shapes, and the concept of geometric proof through logical deduction from axioms.</p>
      <p>The Pythagorean theorem is far more than a geometric curiosity. It is the foundation of the distance formula in coordinate geometry (d = √((x₂-x₁)² + (y₂-y₁)²)), which underlies everything from GPS calculations to the nearest-neighbour algorithms used in machine learning. Understanding geometry develops spatial reasoning — a cognitive skill strongly associated with performance in engineering, architecture, and data visualisation.</p>

      <h4>3. Calculus: The Mathematics of Change</h4>
      <p>Calculus was developed independently by Newton and Leibniz in the 17th century to describe motion and change. It has two main branches. Differential calculus studies rates of change: the derivative f'(x) gives the instantaneous rate at which f(x) changes at a given point. Integral calculus studies accumulation: the integral ∫f(x)dx gives the area under a curve, representing the total accumulation of a quantity over an interval.</p>
      <p>The derivative of x² is 2x — meaning that at any point x, the curve x² is rising at a rate of 2x per unit. At x = 3, it rises at rate 6; at x = 10, it rises at rate 20. This simple result underlies optimisation algorithms used in machine learning (gradient descent), economic marginal analysis, and physical modelling of velocity and acceleration. The Fundamental Theorem of Calculus — that differentiation and integration are inverse operations — is one of the most elegant results in all of mathematics.</p>

      <h4>4. Statistics: Reasoning Under Uncertainty</h4>
      <p>Statistics is the science of collecting, analysing, and drawing inferences from data in the presence of uncertainty. Descriptive statistics summarise data: mean (average), median (middle value), mode (most common value), variance (average squared deviation from mean), and standard deviation (square root of variance). These five measures together describe the centre, spread, and shape of a distribution.</p>
      <p>Inferential statistics uses samples to draw conclusions about populations. A clinical trial of 500 patients is meaningful only if the statistical analysis correctly accounts for sampling variability and the risk of false positives (Type I errors) and false negatives (Type II errors). The p-value — much misunderstood and misused — is the probability of observing results as extreme as those seen, assuming the null hypothesis is true. Bayesian statistics offers an alternative framework that incorporates prior knowledge and updates beliefs in light of new evidence.</p>

      <h4>5. Number Theory: The Pure Mathematics of Integers</h4>
      <p>Number theory is the study of the integers and their properties. Prime numbers — integers greater than 1 with no divisors other than 1 and themselves — are the atoms of the integers: every integer can be uniquely factored into primes (the Fundamental Theorem of Arithmetic). Prime factorisation is computationally easy but its reverse (factoring large numbers back into primes) is computationally hard — this asymmetry is the mathematical foundation of RSA cryptography, which secures the internet.</p>

      <h3>Practical Applications</h3>
      <p><strong>Financial Modelling:</strong> Compound interest, loan amortisation, net present value, option pricing (Black-Scholes), and portfolio optimisation all rely on algebra and calculus. A professional who understands the mathematics behind these models is far better placed to question their assumptions and avoid costly errors.</p>
      <p><strong>Engineering and Physics:</strong> Structural analysis, signal processing, control systems, and thermodynamics are mathematical disciplines. Differential equations — extensions of calculus — model everything from heat transfer to electrical circuits to population dynamics.</p>
      <p><strong>Data Science and Machine Learning:</strong> Linear algebra (vectors, matrices, eigenvalues) underlies neural networks and dimensionality reduction. Probability and statistics are the language of uncertainty in AI models. Calculus drives the optimisation algorithms that train every modern machine learning model.</p>
      <p><strong>Everyday Problem-Solving:</strong> Percentage calculations, unit conversions, estimation, geometric reasoning for space planning, and probabilistic thinking for risk assessment are all mathematical skills that directly improve everyday decision-making.</p>

      <h3>Summary</h3>
      <p>Mathematics is not a collection of isolated tricks — it is an interconnected edifice of ideas, each layer building on the last. In this lesson you have been introduced to: algebra as the language of general relationships; geometry as the study of spatial structure and measurement; calculus as the mathematics of change and accumulation; statistics as the framework for reasoning under uncertainty; and number theory as the pure study of integer properties.</p>
      <p>As you advance through this course, each of these domains will be explored in far greater depth. You will solve real problems, encounter counterintuitive results, and develop the kind of mathematical maturity that distinguishes those who use mathematics from those who truly understand it. The investment is entirely worthwhile: mathematical thinking is one of the most transferable and durable cognitive assets a professional can possess.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is the value of π (pi) approximately?",
        options: [
          "2.718",
          "3.142",
          "1.618",
          "1.414"
        ],
        correct_answer: 1
      },
      {
        question: "What is the Pythagorean theorem?",
        options: [
          "a + b = c",
          "a² + b² = c²",
          "a × b = c²",
          "(a + b)² = c"
        ],
        correct_answer: 1
      },
      {
        question: "What is the derivative of x²?",
        options: [
          "x",
          "2",
          "2x",
          "x³/3"
        ],
        correct_answer: 2
      },
      {
        question: "What is the sum of interior angles of a triangle?",
        options: [
          "90 degrees",
          "180 degrees",
          "270 degrees",
          "360 degrees"
        ],
        correct_answer: 1
      },
      {
        question: "What is a prime number?",
        options: [
          "A number divisible by 2",
          "A number greater than 100",
          "A number divisible only by 1 and itself",
          "Any odd number"
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
        <title>{lesson?.title} - Learn Math</title>
        <meta name="description" content={`Learn Math - Module ${moduleId}, Lesson ${lessonId}`} />
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

      <Footer />
    </>
  );
}
