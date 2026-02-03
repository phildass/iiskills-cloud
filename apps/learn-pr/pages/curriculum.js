"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import ModuleCard from '../components/ModuleCard';
import { getAllModules } from '../lib/curriculumGenerator';

export default function Curriculum() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    setModules(getAllModules());
  }, []);

  return (
    <>
      <Head>
        <title>Full Curriculum - Learn AI</title>
        <meta name="description" content="Complete AI course curriculum with 10 modules and 100 lessons" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-6">Complete AI Course Curriculum</h1>
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Course Structure</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📚</span>
                  <span><strong>10 Comprehensive Modules</strong> covering beginner to advanced topics</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📖</span>
                  <span><strong>100 Detailed Lessons</strong> with hands-on examples and exercises</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">⏱️</span>
                  <span><strong>Self-Paced Learning</strong> - Complete at your own speed, typically 3 months</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">✅</span>
                  <span><strong>Quiz After Each Lesson</strong> - Pass with 3/5 to unlock the next lesson</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🎓</span>
                  <span><strong>Final Certification Exam</strong> - 20 questions, pass with 13+ correct answers</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">💼</span>
                  <span><strong>5 Real-World Case Studies</strong> - Learn from practical applications</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🛠️</span>
                  <span><strong>5 Skill Simulators</strong> - Practice AI tools and techniques</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">All Modules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 card bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">Learning Pace</h2>
            <p className="text-gray-700 mb-4">
              This course is designed to be completed in approximately <strong>3 months</strong> with consistent effort:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Study 3-4 lessons per week</li>
              <li>Each lesson takes approximately 15-20 minutes</li>
              <li>Complete quizzes to reinforce learning</li>
              <li>Review case studies for practical insights</li>
              <li>Practice with skill simulators</li>
            </ul>
            <p className="text-gray-700 mt-4">
              <strong>Faster completion possible:</strong> Motivated learners can complete the course in as little as 6-8 weeks.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
