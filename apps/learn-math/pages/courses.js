"use client";

import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import { COURSES } from "../lib/curriculumGenerator";

const LEVEL_STYLES = {
  Basic:        { bg: "bg-green-50",  border: "border-green-200",  badge: "bg-green-100 text-green-800",  btn: "bg-green-600 hover:bg-green-700" },
  Intermediate: { bg: "bg-blue-50",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-800",    btn: "bg-blue-600 hover:bg-blue-700"   },
  Advanced:     { bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-800", btn: "bg-purple-600 hover:bg-purple-700" },
};

export default function Courses() {
  return (
    <>
      <Head>
        <title>Courses — Learn Mathematics</title>
        <meta
          name="description"
          content="Choose from 3 structured courses: Basic, Intermediate, and Advanced Mathematics. Each course contains 10 modules and 100 lessons."
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mathematics Courses</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three structured courses — from foundational skills to expert-level mastery.
              Each course contains <strong>10 modules</strong> and <strong>100 lessons</strong>.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              🆓 Completely Free — No payment required
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {COURSES.map((course) => {
              const style = LEVEL_STYLES[course.level] || LEVEL_STYLES.Basic;
              return (
                <div
                  key={course.id}
                  className={`rounded-2xl border-2 ${style.border} ${style.bg} p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{course.emoji}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${style.badge}`}>
                      {course.level}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm flex-1 mb-6">{course.description}</p>

                  <div className="space-y-2 mb-6 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      <span><strong>{course.moduleCount}</strong> modules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📖</span>
                      <span><strong>{course.lessonCount}</strong> lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span>Modules {course.moduleRange[0]}–{course.moduleRange[1]}</span>
                    </div>
                  </div>

                  <Link
                    href={`/modules/${course.startModuleId}/lesson/1`}
                    className={`w-full text-center text-white font-semibold py-2.5 px-4 rounded-lg ${style.btn} transition-colors`}
                  >
                    Start {course.level} Course →
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Want to see all modules at once?
            </p>
            <Link
              href="/curriculum"
              className="text-primary font-semibold hover:underline"
            >
              View full curriculum →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
