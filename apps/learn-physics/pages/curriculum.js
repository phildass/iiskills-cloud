"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import ModuleCard from '../components/ModuleCard';
import CurriculumTable, { SubjectComparisonTable } from '../../../components/shared/CurriculumTable';
import { getAllModules, getContentByLevel } from '../lib/curriculumGenerator';

export default function Curriculum() {
  const [modules, setModules] = useState([]);
  const [content, setContent] = useState(null);

  useEffect(() => {
    setModules(getAllModules());
    setContent(getContentByLevel());
  }, []);

  return (
    <>
      <Head>
        <title>Full Curriculum - Learn Physics</title>
        <meta name="description" content="Complete Physics course curriculum organized by difficulty levels" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-6 text-center">Complete Physics Course Curriculum</h1>
            
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-4">Course Structure</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📚</span>
                  <span><strong>Three Levels:</strong> Basic → Intermediate → Advanced</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📖</span>
                  <span><strong>20 Comprehensive Modules</strong> covering fundamental to advanced topics</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🎓</span>
                  <span><strong>Structured Learning Path:</strong> Each level unlocks the next</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">✅</span>
                  <span><strong>Quiz After Each Lesson</strong> - Prove your understanding</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🎯</span>
                  <span><strong>Standard Lesson Format:</strong> Hook → Core Concept → Formula → Interactive → Test</span>
                </li>
              </ul>
            </div>

            {/* Curriculum Table by Level */}
            {content && (
              <CurriculumTable
                subject="Physics"
                basicModules={content.basic}
                intermediateModules={content.intermediate}
                advancedModules={content.advanced}
              />
            )}
          </div>

          {/* Subject Comparison */}
          <div className="max-w-6xl mx-auto mt-16">
            <SubjectComparisonTable />
          </div>

          <div className="max-w-4xl mx-auto mt-16 card bg-blue-50">
            <h2 className="text-2xl font-semibold mb-4">Learning Pace</h2>
            <p className="text-gray-700 mb-4">
              This course is designed to be completed at your own pace:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Start with Basic level to build foundation</li>
              <li>Progress to Intermediate once comfortable with basics</li>
              <li>Master Advanced topics for deep understanding</li>
              <li>Each lesson takes approximately 15-20 minutes</li>
              <li>Complete quizzes to reinforce learning</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
