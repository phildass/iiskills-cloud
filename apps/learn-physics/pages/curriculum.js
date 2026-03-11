import Head from "next/head";
import Link from "next/link";
import { moduleTopics } from "../lib/curriculumGenerator";

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-blue-100 text-blue-800",
  Advanced: "bg-purple-100 text-purple-800",
};

export default function Curriculum() {
  return (
    <>
      <Head>
        <title>Physics Curriculum - iiskills Physics</title>
        <meta
          name="description"
          content="Complete Physics course curriculum with 10 modules and 100 lessons covering classical mechanics to quantum physics"
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Physics Course Curriculum</h1>
            <p className="text-gray-600 text-lg mb-8">
              A comprehensive journey from classical mechanics to advanced quantum physics — 10
              modules, 10 lessons each, with quizzes and certification.
            </p>

            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span>📚</span>
                  <span>
                    <strong>10 Comprehensive Modules</strong> — Beginner to Advanced
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📖</span>
                  <span>
                    <strong>100 Detailed Lessons</strong> with quizzes
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>
                    <strong>Self-Paced</strong> — typically 3 months
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🎓</span>
                  <span>
                    <strong>Certification Exam</strong> upon completion
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🆓</span>
                  <span>
                    <strong>Completely Free</strong> — no payment required
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Modules</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {moduleTopics.map((module) => (
                <div
                  key={module.id}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-bold text-gray-400">Module {module.id}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[module.difficulty] || "bg-gray-100 text-gray-600"}`}
                    >
                      {module.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <Link
                    href={`/modules/${module.id}/lesson/1`}
                    className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:underline"
                  >
                    Start Module {module.id} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
