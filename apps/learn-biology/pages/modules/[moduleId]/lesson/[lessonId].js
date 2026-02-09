"use client";

import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const SAMPLE_LESSONS = {
  "1-1": {
    moduleId: 1,
    lessonId: 1,
    title: "Introduction to Cells",
    description: "Discover the building blocks of life",
    isFree: true,
    content: {
      intro: "Welcome to your first biology lesson! Let's explore the amazing world of cells—the fundamental units of all living things.",
      sections: [
        {
          title: "What is a Cell?",
          content: "A cell is the smallest unit of life that can function independently. Think of it like a tiny city, with different parts (organelles) working together to keep everything running smoothly.",
          analogy: "🏙️ Just like a city has power plants, transportation systems, and a control center, cells have organelles that perform similar functions!",
        },
        {
          title: "Two Types of Cells",
          content: "Prokaryotic Cells: Simple, no nucleus (bacteria). Eukaryotic Cells: Complex, with nucleus (animals, plants, fungi).",
          visual: "🦠 Prokaryotic vs 🧬 Eukaryotic",
        },
        {
          title: "The Powerhouse: Mitochondria",
          content: "Mitochondria are the energy factories of the cell. They convert nutrients into ATP (adenosine triphosphate)—the cell's energy currency.",
          analogy: "⚡ Mitochondria = Power Plant. Just like a power plant converts fuel into electricity, mitochondria convert glucose into energy your cells can use!",
          connection: "💡 This connects to Learn Chemistry's ATP synthesis lesson!",
        },
        {
          title: "Cell Membrane: The Gatekeeper",
          content: "The cell membrane controls what enters and exits the cell through selective permeability.",
          interactive: "🔐 Living Logic Challenge: Your cell's power level is at 10%. Which organelle do you optimize? A) Nucleus B) Mitochondria C) Ribosome",
          answer: "B) Mitochondria - they produce ATP energy!",
        },
      ],
      conclusion: "Congratulations! You've learned the basics of cell structure. Ready for the next lesson?",
    },
  },
};

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const lessonKey = `${moduleId}-${lessonId}`;
  const lesson = SAMPLE_LESSONS[lessonKey];

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">
            This lesson is currently being developed.
          </p>
          <Link href="/curriculum" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Back to Curriculum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Biology | iiskills</title>
        <meta name="description" content={lesson.description} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <span>›</span>
              <Link href="/curriculum" className="hover:text-green-600">Curriculum</Link>
              <span>›</span>
              <span>Module {lesson.moduleId}</span>
              <span>›</span>
              <span>Lesson {lesson.lessonId}</span>
            </div>
            
            {lesson.isFree && (
              <div className="inline-block px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg mb-4">
                <span className="font-semibold text-green-800">
                  ✨ FREE SAMPLE LESSON
                </span>
              </div>
            )}

            <h1 className="text-4xl font-bold text-green-800 mb-2">
              {lesson.title}
            </h1>
            <p className="text-xl text-gray-600">{lesson.description}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {/* Intro */}
            <div className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <p className="text-lg text-gray-700">{lesson.content.intro}</p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {lesson.content.sections.map((section, index) => (
                <div key={index} className="border-l-4 border-green-600 pl-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {section.content}
                  </p>
                  
                  {section.analogy && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg mb-4">
                      <p className="text-blue-900 font-medium">{section.analogy}</p>
                    </div>
                  )}
                  
                  {section.visual && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg mb-4">
                      <p className="text-3xl">{section.visual}</p>
                    </div>
                  )}
                  
                  {section.connection && (
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg mb-4">
                      <p className="text-purple-900 font-medium">{section.connection}</p>
                    </div>
                  )}
                  
                  {section.interactive && (
                    <div className="p-6 bg-amber-50 border-2 border-amber-300 rounded-lg mb-4">
                      <p className="font-semibold text-amber-900 mb-2">{section.interactive}</p>
                      <button className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        Submit Answer
                      </button>
                      {section.answer && (
                        <div className="mt-4 p-3 bg-white rounded border border-amber-200">
                          <p className="text-sm text-gray-700">
                            <strong>Hint:</strong> {section.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
              <p className="text-lg font-medium">{lesson.content.conclusion}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link
              href="/curriculum"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              ← Back to Curriculum
            </Link>
            <Link
              href={`/modules/${moduleId}/lesson/${parseInt(lessonId) + 1}`}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Next Lesson →
            </Link>
          </div>

          {/* Gatekeeper CTA */}
          {lessonId === "3" && (
            <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-300 rounded-xl text-center">
              <h3 className="text-2xl font-bold text-amber-900 mb-2">
                🚪 Ready for the Gatekeeper Test?
              </h3>
              <p className="text-amber-800 mb-4">
                Complete Level 1 Cell Mastery Test to unlock Module 2!
              </p>
              <button className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-bold text-lg">
                Take Gatekeeper Test
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
