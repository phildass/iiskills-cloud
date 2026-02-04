"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import { curriculumData } from '../lib/curriculumData';

export default function Curriculum() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    setModules(curriculumData.modules);
  }, []);

  return (
    <>
      <Head>
        <title>Web Developer Bootcamp Curriculum - Learn Developer</title>
        <meta name="description" content="Complete Web Developer Bootcamp curriculum with 10 comprehensive modules" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-6">Web Developer Bootcamp Curriculum</h1>
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Course Structure</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📚</span>
                  <span><strong>10 Comprehensive Modules</strong> covering beginner to advanced web development</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📖</span>
                  <span><strong>Deep Dive Lessons</strong> with high-impact analogies and practical examples</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">💻</span>
                  <span><strong>Clean Code Labs</strong> demonstrating core syntax and best practices</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">⚡</span>
                  <span><strong>Rapid-Fire Tests</strong> - 5 questions per module with instant transitions</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🎓</span>
                  <span><strong>Certification System</strong> - Pass (30-70%), Excellence (&gt;90%)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🏆</span>
                  <span><strong>Skills Metadata</strong> - Showcase your mastered technologies</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">All Modules</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => (
                <div key={module.id} className="card hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{module.emoji}</span>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Module {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>⏱️ {module.duration}</span>
                    <span className={`px-2 py-1 rounded ${
                      module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {module.difficulty}
                    </span>
                  </div>
                  <Link 
                    href={`/modules/${module.id}/lesson`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Start Module
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-16 card bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">Certification Criteria</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">❌</span>
                <div>
                  <strong className="text-red-700">Below 30%:</strong> Review lessons and retry. No certificate awarded.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <strong className="text-green-700">30% - 70%:</strong> Pass! Certificate of Completion awarded.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🏆</span>
                <div>
                  <strong className="text-purple-700">Above 90%:</strong> Honors! Certificate of Excellence awarded.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
