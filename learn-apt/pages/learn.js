import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCurrentUser, getUserProfile } from "../lib/supabaseClient";

export default function LearnAptitude() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { mode } = router.query; // 'short' or 'elaborate'

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      
      const profile = await getUserProfile(currentUser.id);
      setUserProfile(profile);
      
      setLoading(false);
    };

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Aptitude Assessment - iiskills.cloud</title>
        <meta name="description" content="Take your aptitude assessment and discover your strengths" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {userProfile?.first_name || user?.email}!
            </h1>
            <p className="text-gray-600">
              Ready to discover your aptitude strengths? Choose an assessment below to get started.
            </p>
          </div>

          {/* Assessment Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Short Assessment */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Short Assessment</h2>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <strong>Duration:</strong> ~7 minutes
                </p>
                <p className="text-gray-700">
                  <strong>Questions:</strong> 12 carefully selected
                </p>
                <p className="text-gray-700">
                  <strong>Coverage:</strong> Core competencies overview
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Best for:</strong> Quick skill assessment, time-constrained users, or getting a general overview of your aptitude.
                </p>
              </div>

              <button
                onClick={() => alert("Short assessment feature coming soon! This will launch a 12-question quick assessment.")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Start Short Assessment
              </button>
            </div>

            {/* Elaborate Assessment */}
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Elaborate Assessment</h2>
                  <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold mt-1">
                    Recommended
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-gray-700">
                  <strong>Duration:</strong> 40-50 minutes
                </p>
                <p className="text-gray-700">
                  <strong>Questions:</strong> 200 comprehensive
                </p>
                <p className="text-gray-700">
                  <strong>Coverage:</strong> Detailed skill analysis + career guidance
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <strong>Best for:</strong> Comprehensive career planning, detailed skill assessment, and personalized AI-powered recommendations.
                </p>
              </div>

              <button
                onClick={() => alert("Elaborate assessment feature coming soon! This will launch a comprehensive 200-question assessment with AI career guidance.")}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
              >
                Start Elaborate Assessment
              </button>
            </div>
          </div>

          {/* Skills Covered */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Skills Assessed</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Quantitative Aptitude</h3>
                  <p className="text-sm text-gray-600">Numerical reasoning and calculations</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Logical Reasoning</h3>
                  <p className="text-sm text-gray-600">Analytical and critical thinking</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Verbal Reasoning</h3>
                  <p className="text-sm text-gray-600">Language and comprehension</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Data Interpretation</h3>
                  <p className="text-sm text-gray-600">Charts, graphs, and analysis</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Pattern Recognition</h3>
                  <p className="text-sm text-gray-600">Sequences and patterns</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 rounded-lg p-2 mr-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1">Speed Mathematics</h3>
                  <p className="text-sm text-gray-600">Quick calculation techniques</p>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Results Section (Placeholder) */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Your Assessment History</h2>
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No assessments completed yet. Start your first assessment above!</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
