import Head from "next/head";
import Link from "next/link";
import { moduleTopics, COURSES } from "../lib/curriculumGenerator";

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-blue-100 text-blue-800",
  Advanced: "bg-purple-100 text-purple-800",
};

export default function Curriculum() {
  const modulesByCourse = {
    Basic: moduleTopics.filter((m) => m.course === "Basic"),
    Intermediate: moduleTopics.filter((m) => m.course === "Intermediate"),
    Advanced: moduleTopics.filter((m) => m.course === "Advanced"),
  };

  return (
    <>
      <Head>
        <title>Physics Curriculum - iiskills Physics</title>
        <meta
          name="description"
          content="Complete Physics curriculum: 3 courses × 10 modules × 10 lessons = 300 lessons covering classical mechanics to quantum physics"
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">Physics Course Curriculum</h1>
              <Link href="/courses" className="text-primary font-semibold hover:underline text-sm">
                ← View Courses
              </Link>
            </div>
            <p className="text-gray-600 text-lg mb-8">
              Three structured courses from classical mechanics to advanced quantum physics — 30 modules, 10 lessons each.
            </p>

            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span>🎓</span>
                  <span><strong>3 Courses</strong> — Basic, Intermediate, Advanced</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📚</span>
                  <span><strong>30 Modules</strong> — 10 modules per course</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📖</span>
                  <span><strong>300 Lessons</strong> with quizzes</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span><strong>Self-Paced</strong> — typically 9 months for all 3 courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🎓</span>
                  <span><strong>Certification Exam</strong> upon completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🆓</span>
                  <span><strong>Completely Free</strong> — no payment required</span>
                </li>
              </ul>
            </div>
          </div>

          {COURSES.map((course) => (
            <div key={course.id} className="max-w-4xl mx-auto mb-16">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{course.emoji}</span>
                <h2 className="text-2xl font-bold">{course.title}</h2>
                <span className="text-sm text-gray-500 ml-auto">
                  Modules {course.moduleRange[0]}–{course.moduleRange[1]}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{course.description}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {(modulesByCourse[course.level] || []).map((module) => (
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
          ))}
        </div>
      </main>
    </>
  );
}
