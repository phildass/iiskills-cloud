"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import ModuleCard from "../components/ModuleCard";
import { getAllModules, COURSES } from "../lib/curriculumGenerator";

export default function Curriculum() {
  const [modulesByCourse, setModulesByCourse] = useState({ Basic: [], Intermediate: [], Advanced: [] });

  useEffect(() => {
    const all = getAllModules();
    setModulesByCourse({
      Basic: all.filter((m) => m.course === "Basic"),
      Intermediate: all.filter((m) => m.course === "Intermediate"),
      Advanced: all.filter((m) => m.course === "Advanced"),
    });
  }, []);

  return (
    <>
      <Head>
        <title>Full Curriculum - Learn Ai</title>
        <meta
          name="description"
          content="Complete Ai curriculum: 3 courses × 10 modules × 10 lessons = 300 lessons total"
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Complete Ai Curriculum</h1>
              <Link href="/courses" className="text-primary font-semibold hover:underline text-sm">
                ← View Courses
              </Link>
            </div>
            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Course Structure</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🎓</span>
                  <span><strong>3 Courses</strong> — Basic, Intermediate, and Advanced</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">��</span>
                  <span><strong>30 Modules</strong> — 10 modules per course</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">📖</span>
                  <span><strong>300 Lessons</strong> — 10 lessons per module</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">⏱️</span>
                  <span><strong>Self-Paced Learning</strong> - Complete at your own speed</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">✅</span>
                  <span><strong>Quiz After Each Lesson</strong> - Pass with 3/5 to unlock the next lesson</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold mr-2">🎓</span>
                  <span><strong>Final Certification Exam</strong> - 20 questions, pass with 13+ correct answers</span>
                </li>
              </ul>
            </div>
          </div>

          {COURSES.map((course) => (
            <div key={course.id} className="max-w-6xl mx-auto mb-16">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{course.emoji}</span>
                <h2 className="text-3xl font-bold">{course.title}</h2>
                <span className="text-sm text-gray-500 ml-auto">
                  Modules {course.moduleRange[0]}–{course.moduleRange[1]}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(modulesByCourse[course.level] || []).map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
