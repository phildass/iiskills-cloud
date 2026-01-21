"use client"; // This page uses React hooks for user state management - must run on client side

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../../components/shared/InstallApp";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  return (
    <>
      <Head>
        <title>Learn Your Aptitude - Free Aptitude Testing Platform</title>
        <meta
          name="description"
          content="Discover your potential with free aptitude tests. Take the brief test (12 questions) or elaborate test (200 questions) to assess your skills and learning preferences."
        />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-cyan-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Learn Your Aptitude</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Discover your potential with free aptitude tests designed to assess your learning preferences, 
              problem-solving skills, and cognitive abilities.
            </p>

            {!user && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-lg font-semibold">🎯 100% Free - No Payment Required</p>
                <p className="text-sm mt-2">
                  Optional registration allows you to save your results and track your progress. 
                  All tests are completely free for everyone!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                href="#tests"
                className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Take a Test →
              </Link>
              {!user && (
                <Link
                  href="/register"
                  className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition"
                >
                  Register (Optional)
                </Link>
              )}
              <InstallApp appName="Learn Your Aptitude" />
            </div>
          </div>
        </section>

        {/* Test Options Section */}
        <section id="tests" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">Choose Your Test</h2>
            <p className="text-center text-charcoal mb-12 max-w-2xl mx-auto">
              Select the test that best fits your time and goals. Both tests are completely free!
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Brief Test Card */}
              <div className="bg-neutral p-8 rounded-lg shadow-lg border-2 border-transparent hover:border-primary transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary">Brief Test</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    Quick
                  </span>
                </div>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-charcoal mb-2">12 Questions</p>
                  <p className="text-lg text-gray-600">~7 minutes</p>
                </div>
                <ul className="space-y-3 mb-6 text-charcoal">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Learning Preferences (3 questions)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Problem-Solving Style (3 questions)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Motivation Drivers (3 questions)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Numerical Reasoning (3 questions)</span>
                  </li>
                </ul>
                <Link
                  href="/brief-test"
                  className="block w-full bg-primary text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Start Brief Test →
                </Link>
              </div>

              {/* Elaborate Test Card */}
              <div className="bg-neutral p-8 rounded-lg shadow-lg border-2 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary">Elaborate Test</h3>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                    Comprehensive
                  </span>
                </div>
                <div className="mb-6">
                  <p className="text-3xl font-bold text-charcoal mb-2">200 Questions</p>
                  <p className="text-lg text-gray-600">~40-50 minutes</p>
                </div>
                <ul className="space-y-3 mb-6 text-charcoal">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>20 comprehensive modules</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Learning & cognitive assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Aptitude & reasoning tests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Professional skills evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Personal effectiveness insights</span>
                  </li>
                </ul>
                <Link
                  href="/elaborate-test"
                  className="block w-full bg-primary text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Start Elaborate Test →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">What's Inside</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Learning Styles</h3>
                <p className="text-charcoal">
                  Discover how you prefer to learn and process information. Understand your 
                  cognitive patterns and optimize your learning approach.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🧠</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Aptitude & Reasoning</h3>
                <p className="text-charcoal">
                  Test your numerical, logical, spatial, and verbal reasoning abilities. 
                  All questions include an "I don't know" option for honest assessment.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Professional Skills</h3>
                <p className="text-charcoal">
                  Evaluate your critical thinking, time management, communication style, 
                  and decision-making processes for career growth.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Personal Development</h3>
                <p className="text-charcoal">
                  Assess your stress resilience, creativity, memory retention, and 
                  collaborative learning preferences.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🇮🇳</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Indian Context</h3>
                <p className="text-charcoal">
                  All monetary examples use Indian Rupee (₹) for relevance. Questions are 
                  designed with Indian educational and professional contexts in mind.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Detailed Results</h3>
                <p className="text-charcoal">
                  Get comprehensive insights into your strengths and areas for improvement. 
                  Register to save and track your progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Potential?</h2>
            <p className="text-xl mb-8">
              Join thousands of learners who have already taken the test. It's completely free!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#tests"
                className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg"
              >
                Choose Your Test
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition"
                >
                  Sign In to Save Results
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
