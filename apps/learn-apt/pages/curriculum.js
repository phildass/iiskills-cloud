import Head from "next/head";
import Link from "next/link";

const TESTS = [
  {
    href: "/tests/numerical",
    emoji: "💰",
    title: "Numerical Ability",
    description: "Master arithmetic, percentages, ratios, and financial calculations",
    meta: "8 questions · ~15 min",
    difficulty: "Beginner",
    careers: ["Banking", "Finance", "Engineering"],
  },
  {
    href: "/tests/logical",
    emoji: "🧩",
    title: "Logical Reasoning",
    description: "Sharpen pattern recognition, syllogisms, and coding-decoding",
    meta: "8 questions · ~15 min",
    difficulty: "Beginner",
    careers: ["Consulting", "Programming", "Strategy"],
  },
  {
    href: "/tests/verbal",
    emoji: "🎤",
    title: "Verbal Ability",
    description: "Excel in grammar, reading comprehension, and communication",
    meta: "8 questions · ~15 min",
    difficulty: "Beginner",
    careers: ["Marketing", "Management", "Sales"],
  },
  {
    href: "/tests/spatial",
    emoji: "🏗️",
    title: "Spatial / Abstract",
    description: "Visualize 3D figures, rotations, and spatial patterns",
    meta: "8 questions · ~15 min",
    difficulty: "Intermediate",
    careers: ["Architecture", "Design", "UI/UX"],
  },
  {
    href: "/tests/data-interpretation",
    emoji: "📊",
    title: "Data Interpretation",
    description: "Analyze charts, tables, and extract meaningful insights",
    meta: "8 questions · ~15 min",
    difficulty: "Intermediate",
    careers: ["Analytics", "Research", "Data Science"],
  },
  {
    href: "/tests/quick-fire",
    emoji: "⚡",
    title: "Quick-Fire",
    description: "5-minute timed dash across all domains — get your complete Aptitude Signature!",
    meta: "15 questions · ~5 min",
    difficulty: "Mixed",
    careers: ["All Domains"],
  },
  {
    href: "/tests/general-short",
    emoji: "🚀",
    title: "General Purpose – Short",
    description: "Quick 7-question assessment covering mixed aptitude skills",
    meta: "7 questions · ~10 min",
    difficulty: "Mixed",
    careers: ["Practice", "Warm-up"],
  },
  {
    href: "/tests/general-elaborate",
    emoji: "🎯",
    title: "General Purpose – Elaborate",
    description: "Comprehensive 120-question deep-dive across all aptitude areas",
    meta: "120 questions · ~90 min",
    difficulty: "Advanced",
    careers: ["Placement Prep", "Full Assessment"],
  },
];

const DIFFICULTY_COLORS = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-blue-100 text-blue-800",
  Advanced: "bg-purple-100 text-purple-800",
  Mixed: "bg-yellow-100 text-yellow-800",
};

export default function Curriculum() {
  return (
    <>
      <Head>
        <title>Aptitude Curriculum - iiskills Aptitude</title>
        <meta
          name="description"
          content="Complete Aptitude course curriculum: 5 cognitive domains, 8 tests, Brain-Print generator and career mapping."
        />
      </Head>

      <main className="min-h-screen bg-yellow-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-10">
            <h1 className="text-4xl font-bold mb-4">Aptitude Curriculum</h1>
            <p className="text-gray-600 text-lg mb-8">
              Scientific diagnostic engine across 5 cognitive domains — 8 tests, a unique
              Brain-Print, and real-time career mapping. 100% free.
            </p>

            <div className="bg-white rounded-2xl shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Course Overview</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span>🧠</span>
                  <span>
                    <strong>5 Cognitive Domains</strong> — Numerical, Logical, Verbal, Spatial, Data
                    Interpretation
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📊</span>
                  <span>
                    <strong>8 Tests</strong> — from quick 5-minute dashes to 120-question
                    assessments
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>
                    <strong>Adaptive Difficulty</strong> — tests get harder as you improve
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span>🖼️</span>
                  <span>
                    <strong>Brain-Print</strong> — unique skill graphic after each test
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
            <h2 className="text-2xl font-bold mb-6">All Tests</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {TESTS.map((test) => (
                <div
                  key={test.href}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{test.emoji}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[test.difficulty] || "bg-gray-100 text-gray-600"}`}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{test.title}</h3>
                  <p className="text-xs text-yellow-700 font-medium mb-1">{test.meta}</p>
                  <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                  <Link
                    href={test.href}
                    className="inline-flex items-center gap-1 text-yellow-700 font-semibold text-sm hover:underline"
                  >
                    Start Test →
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
