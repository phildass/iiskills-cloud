"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ModuleCard from "../components/ModuleCard";
import Footer from "../components/Footer";
import { getCourses, getModulesByCourse } from "../lib/curriculumGenerator";

const COURSE_COLORS = {
  Beginner: {
    tab: "bg-green-600 text-white",
    tabInactive: "bg-white text-green-700 border border-green-300 hover:bg-green-50",
    badge: "bg-green-100 text-green-800",
    header: "bg-green-50 border-l-4 border-green-500",
  },
  Intermediate: {
    tab: "bg-blue-600 text-white",
    tabInactive: "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50",
    badge: "bg-blue-100 text-blue-800",
    header: "bg-blue-50 border-l-4 border-blue-500",
  },
  Advanced: {
    tab: "bg-purple-600 text-white",
    tabInactive: "bg-white text-purple-700 border border-purple-300 hover:bg-purple-50",
    badge: "bg-purple-100 text-purple-800",
    header: "bg-purple-50 border-l-4 border-purple-500",
  },
};

export default function Curriculum() {
  const courses = getCourses();
  const [activeCourse, setActiveCourse] = useState(courses[0]?.id ?? 1);

  const selectedCourse = courses.find((c) => c.id === activeCourse) ?? courses[0];
  const modules = selectedCourse ? getModulesByCourse(selectedCourse.id) : [];
  const colors = COURSE_COLORS[selectedCourse?.difficulty] ?? COURSE_COLORS.Beginner;

  return (
    <>
      <Head>
        <title>Chemistry Mastery Curriculum - Learn Chemistry</title>
        <meta
          name="description"
          content="Chemistry Mastery: 3 courses (Basic, Intermediate, Advanced), each with 10 modules and 10 lessons."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-3">Chemistry Mastery Curriculum</h1>
            <p className="text-gray-600 text-lg">
              3 courses &bull; 30 modules &bull; 300 lessons &bull; quiz after every lesson
            </p>
          </div>

          {/* Course summary cards */}
          <div className="max-w-5xl mx-auto mb-10 grid md:grid-cols-3 gap-6">
            {courses.map((course) => {
              const cc = COURSE_COLORS[course.difficulty] ?? COURSE_COLORS.Beginner;
              return (
                <button
                  key={course.id}
                  onClick={() => setActiveCourse(course.id)}
                  className={`rounded-xl p-5 text-left shadow transition-all duration-200 ${
                    activeCourse === course.id
                      ? cc.tab + " shadow-lg scale-105"
                      : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{course.title}</div>
                  <div className={`text-sm mb-2 ${activeCourse === course.id ? "text-white/80" : "text-gray-500"}`}>
                    {course.subtitle}
                  </div>
                  <div className={`text-xs ${activeCourse === course.id ? "text-white/70" : "text-gray-400"}`}>
                    {course.module_count} modules &bull; {course.lesson_count} lessons
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected course detail */}
          {selectedCourse && (
            <div className="max-w-5xl mx-auto">
              <div className={`rounded-xl p-6 mb-8 ${colors.header}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors.badge}`}>
                    {selectedCourse.difficulty}
                  </span>
                  <h2 className="text-2xl font-bold">{selectedCourse.title}: {selectedCourse.subtitle}</h2>
                </div>
                <p className="text-gray-700">{selectedCourse.description}</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => (
                  <div key={module.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">
                        {module.difficulty === "Beginner" ? "🌱" : module.difficulty === "Intermediate" ? "🚀" : "⭐"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                        Module {module.order}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mb-2 flex-1">{module.title}</h3>
                    <p className="text-gray-500 text-sm mb-4">{module.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>📖 10 lessons</span>
                      <span>⏱️ ~2.5 hrs</span>
                    </div>
                    <Link
                      href={`/modules/${module.id}/lesson/1`}
                      className={`block text-center text-sm font-semibold py-2 px-4 rounded-lg transition-colors ${colors.tab} hover:opacity-90`}
                    >
                      Start Module
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certification info */}
          <div className="max-w-4xl mx-auto mt-16 bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-semibold mb-4">Certification Criteria</h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div><strong className="text-red-700">Below 30%:</strong> Review lessons and retry. No certificate awarded.</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <div><strong className="text-green-700">30% – 70%:</strong> Pass! Certificate of Completion awarded.</div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div><strong className="text-purple-700">Above 90%:</strong> Honors! Certificate of Excellence awarded.</div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
