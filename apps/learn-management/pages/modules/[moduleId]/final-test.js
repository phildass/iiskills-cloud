"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ModuleFinalTestComponent from '../../../components/ModuleFinalTestComponent';
import { getCurrentUser } from '../../../lib/supabaseClient';

const APP_KEY = 'learn-management';
const APP_DISPLAY = 'Learn Management';

function generateFinalTestQuestions(moduleId) {
  // Placeholder 20-question final test — replace with real Supabase content
  const base = [
    { question: `Module ${moduleId} – Final Test Q1: Which concept is foundational to this module?`, options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'], correct_answer: 0 },
    { question: `Module ${moduleId} – Final Test Q2: What is the primary goal of this module's framework?`, options: ['Goal A', 'Goal B', 'Goal C', 'Goal D'], correct_answer: 1 },
    { question: `Module ${moduleId} – Final Test Q3: Which principle governs the main topic?`, options: ['Principle A', 'Principle B', 'Principle C', 'Principle D'], correct_answer: 2 },
    { question: `Module ${moduleId} – Final Test Q4: What is the correct application of the key concept?`, options: ['Application A', 'Application B', 'Application C', 'Application D'], correct_answer: 0 },
    { question: `Module ${moduleId} – Final Test Q5: Which statement best describes the outcome?`, options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'], correct_answer: 3 },
    { question: `Module ${moduleId} – Final Test Q6: What defines successful mastery of this module?`, options: ['Definition A', 'Definition B', 'Definition C', 'Definition D'], correct_answer: 1 },
    { question: `Module ${moduleId} – Final Test Q7: Which factor most influences the result?`, options: ['Factor A', 'Factor B', 'Factor C', 'Factor D'], correct_answer: 2 },
    { question: `Module ${moduleId} – Final Test Q8: What is the standard measurement for this topic?`, options: ['Measure A', 'Measure B', 'Measure C', 'Measure D'], correct_answer: 0 },
    { question: `Module ${moduleId} – Final Test Q9: How is the core method applied?`, options: ['Method A', 'Method B', 'Method C', 'Method D'], correct_answer: 3 },
    { question: `Module ${moduleId} – Final Test Q10: What is the most efficient approach?`, options: ['Approach A', 'Approach B', 'Approach C', 'Approach D'], correct_answer: 1 },
    { question: `Module ${moduleId} – Final Test Q11: Which process describes the workflow?`, options: ['Process A', 'Process B', 'Process C', 'Process D'], correct_answer: 0 },
    { question: `Module ${moduleId} – Final Test Q12: What enables progression to the next stage?`, options: ['Stage A', 'Stage B', 'Stage C', 'Stage D'], correct_answer: 2 },
    { question: `Module ${moduleId} – Final Test Q13: Which tool is used for this objective?`, options: ['Tool A', 'Tool B', 'Tool C', 'Tool D'], correct_answer: 1 },
    { question: `Module ${moduleId} – Final Test Q14: What is the expected output?`, options: ['Output A', 'Output B', 'Output C', 'Output D'], correct_answer: 3 },
    { question: `Module ${moduleId} – Final Test Q15: Which error is most common?`, options: ['Error A', 'Error B', 'Error C', 'Error D'], correct_answer: 0 },
    { question: `Module ${moduleId} – Final Test Q16: What validates the result?`, options: ['Validation A', 'Validation B', 'Validation C', 'Validation D'], correct_answer: 2 },
    { question: `Module ${moduleId} – Final Test Q17: Which strategy improves efficiency?`, options: ['Strategy A', 'Strategy B', 'Strategy C', 'Strategy D'], correct_answer: 1 },
    { question: `Module ${moduleId} – Final Test Q18: What is the professional standard?`, options: ['Standard A', 'Standard B', 'Standard C', 'Standard D'], correct_answer: 3 },
    { question: `Module ${moduleId} – Final Test Q19: Which outcome is most desirable?`, options: ['Outcome A', 'Outcome B', 'Outcome C', 'Outcome D'], correct_answer: 0 },
    { question: `Module ${moduleId} – Final Test Q20: What completes the module framework?`, options: ['Framework A', 'Framework B', 'Framework C', 'Framework D'], correct_answer: 2 },
  ];
  return base;
}

export default function ModuleFinalTestPage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleComplete = async (testPassed, score) => {
    setPassed(testPassed);
    if (user) {
      try {
        await fetch('/api/module-final-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId, appKey: APP_KEY, score, userId: user.id }),
        });
      } catch (err) {
        console.error('Error saving final test result:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Module {moduleId} Final Test – {APP_DISPLAY}</title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.push(`/modules/${moduleId}/lesson/1`)}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Module
            </button>
          </div>

          <div className="card mb-8">
            <h1 className="text-3xl font-bold mb-2">Module {moduleId} – Final Test</h1>
            <p className="text-gray-600">
              Complete all 20 questions. You need to score 14/20 or higher to pass and unlock the
              next level.
            </p>
          </div>

          <ModuleFinalTestComponent
            questions={generateFinalTestQuestions(moduleId)}
            moduleId={moduleId}
            appKey={APP_KEY}
            onComplete={handleComplete}
          />

          {passed && (
            <div className="card bg-green-50 border-2 border-green-500 mt-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Module Complete – Next Level Unlocked!
              </h3>
              <button
                onClick={() => router.push('/curriculum')}
                className="btn-primary"
              >
                Continue to Curriculum
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
