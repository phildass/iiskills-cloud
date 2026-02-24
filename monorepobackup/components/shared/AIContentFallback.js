/**
 * AI Content Fallback Component
 * 
 * Auto-populates sample lessons, tests, and modules when content is missing
 * Prevents 404 errors by providing placeholder educational content
 * 
 * Usage:
 * <AIContentFallback appName="Learn Math" contentType="lesson" />
 */

import { motion } from "framer-motion";
import Link from "next/link";

// AI-generated sample content templates per app
const SAMPLE_CONTENT = {
  math: {
    headline: "Welcome to Learn Math!",
    summary: "This is your entry point to mathematical mastery. Sample lessons and diagnostics are available to preview the real course progression.",
    lesson: {
      title: "Foundations of Algebra",
      intro: "Algebra is the language of mathematics. In this introductory lesson, you'll learn how variables, constants, and operations work together to solve real-world problems.",
      concepts: [
        "Understanding variables and constants",
        "Basic algebraic operations",
        "Solving linear equations",
        "Word problems and applications"
      ],
      example: {
        question: "If 2x + 5 = 15, what is x?",
        solution: "2x + 5 = 15 → 2x = 10 → x = 5",
        explanation: "We isolate the variable by performing inverse operations on both sides of the equation."
      }
    },
    test: {
      question: "Simplify: 3(x + 2) - 2(x - 1)",
      options: ["x + 8", "x + 4", "5x + 4", "x - 4"],
      correctAnswer: 0,
      explanation: "3(x + 2) - 2(x - 1) = 3x + 6 - 2x + 2 = x + 8"
    }
  },
  physics: {
    headline: "Welcome to Learn Physics!",
    summary: "Discover the laws that govern our universe. Sample lessons explore fundamental physics concepts with real-world applications.",
    lesson: {
      title: "Newton's Laws of Motion",
      intro: "Sir Isaac Newton's three laws of motion form the foundation of classical mechanics. These principles explain how objects move and interact.",
      concepts: [
        "Law of Inertia (First Law)",
        "Force and Acceleration (Second Law: F=ma)",
        "Action-Reaction Pairs (Third Law)",
        "Real-world applications"
      ],
      example: {
        question: "A 10kg object is pushed with 50N of force. What is its acceleration?",
        solution: "Using F = ma: a = F/m = 50N / 10kg = 5 m/s²",
        explanation: "Newton's Second Law relates force, mass, and acceleration."
      }
    },
    test: {
      question: "If you push a wall with 100N of force, how much force does the wall exert on you?",
      options: ["0N", "50N", "100N", "200N"],
      correctAnswer: 2,
      explanation: "Newton's Third Law: For every action, there is an equal and opposite reaction. The wall pushes back with 100N."
    }
  },
  chemistry: {
    headline: "Welcome to Learn Chemistry!",
    summary: "Explore the molecular world. Sample lessons introduce you to atoms, bonds, and chemical reactions.",
    lesson: {
      title: "Introduction to Chemical Bonding",
      intro: "Chemical bonds are the forces that hold atoms together. Understanding bonding is key to predicting molecular properties and reactions.",
      concepts: [
        "Ionic bonding: electron transfer",
        "Covalent bonding: electron sharing",
        "Metallic bonding: electron sea model",
        "Bond polarity and electronegativity"
      ],
      example: {
        question: "What type of bond forms between Na and Cl in table salt?",
        solution: "Ionic bond",
        explanation: "Sodium (Na) donates an electron to Chlorine (Cl), creating oppositely charged ions that attract."
      }
    },
    test: {
      question: "Which type of bond involves sharing electrons?",
      options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
      correctAnswer: 1,
      explanation: "Covalent bonds form when atoms share electrons to achieve stability."
    }
  },
  biology: {
    headline: "Welcome to Learn Biology!",
    summary: "Decode the ingredients of life. Sample lessons explore cells, genetics, and living systems.",
    lesson: {
      title: "Cell Structure and Function",
      intro: "Cells are the basic units of life. From bacteria to humans, all organisms are made of cells with specialized structures.",
      concepts: [
        "Cell membrane and transport",
        "Nucleus and genetic material",
        "Mitochondria: energy production",
        "Chloroplasts in plant cells"
      ],
      example: {
        question: "Why is the mitochondria called the 'powerhouse of the cell'?",
        solution: "It generates ATP through cellular respiration",
        explanation: "Mitochondria convert glucose and oxygen into ATP, the energy currency of cells."
      }
    },
    test: {
      question: "Which organelle is responsible for protein synthesis?",
      options: ["Nucleus", "Ribosome", "Golgi apparatus", "Lysosome"],
      correctAnswer: 1,
      explanation: "Ribosomes are the sites of protein synthesis, translating mRNA into proteins."
    }
  },
  geography: {
    headline: "Welcome to Learn Geography!",
    summary: "Understand our planet Earth. Sample lessons cover landforms, climate, and human-environment interactions.",
    lesson: {
      title: "Plate Tectonics and Earthquakes",
      intro: "Earth's crust is divided into tectonic plates that slowly move, causing earthquakes, volcanoes, and mountain formation.",
      concepts: [
        "Types of plate boundaries",
        "Convection currents in the mantle",
        "Earthquake measurement (Richter scale)",
        "Ring of Fire: global seismic zones"
      ],
      example: {
        question: "What causes most earthquakes?",
        solution: "Movement of tectonic plates",
        explanation: "When plates slide past, collide, or separate, they release energy as seismic waves."
      }
    },
    test: {
      question: "Which type of plate boundary forms mountains?",
      options: ["Divergent", "Convergent", "Transform", "Subduction"],
      correctAnswer: 1,
      explanation: "Convergent boundaries, where plates collide, push up mountain ranges like the Himalayas."
    }
  },
  aptitude: {
    headline: "Welcome to Learn Aptitude!",
    summary: "Sharpen your logical thinking. Sample diagnostics test reasoning, quantitative, and verbal skills.",
    lesson: {
      title: "Logical Reasoning Fundamentals",
      intro: "Logical reasoning helps you identify patterns, make deductions, and solve problems systematically.",
      concepts: [
        "Syllogisms and deductive logic",
        "Pattern recognition",
        "Coding-decoding problems",
        "Blood relations and seating arrangements"
      ],
      example: {
        question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are:",
        solution: "Definitely Lazzies",
        explanation: "This is a valid syllogism: If A⊆B and B⊆C, then A⊆C"
      }
    },
    test: {
      question: "What comes next in the series: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "46"],
      correctAnswer: 1,
      explanation: "Pattern: n(n+1). Next is 6×7 = 42"
    }
  }
};

export default function AIContentFallback({ 
  appName = "this app",
  appType = "math", // math, physics, chemistry, biology, geography, aptitude
  contentType = "lesson" // lesson, test, module
}) {
  const content = SAMPLE_CONTENT[appType] || SAMPLE_CONTENT.math;

  if (contentType === "module") {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-300 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">📚</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {content.headline}
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {content.summary}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-blue-200">
              <div className="text-4xl mb-3">📖</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Sample Lessons</h3>
              <p className="text-gray-600 text-sm">
                Explore foundational concepts with guided examples
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-purple-200">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Practice Tests</h3>
              <p className="text-gray-600 text-sm">
                Challenge yourself with qualifying questions
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border border-green-200">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Diagnostics</h3>
              <p className="text-gray-600 text-sm">
                Map your strengths and areas for growth
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>📌 Note:</strong> This is sample onboarding content. Full curriculum modules
              are being developed and will be available soon.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (contentType === "test") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-blue-300"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎯</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sample Diagnostic Question
            </h2>
            <p className="text-gray-600">
              {appName} Qualifying Test
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-xl text-gray-900 font-medium">
              {content.test.question}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {content.test.options.map((option, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  idx === content.test.correctAnswer
                    ? "bg-green-50 border-green-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <span className="font-bold text-blue-600 mr-3">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="text-gray-900">{option}</span>
                {idx === content.test.correctAnswer && (
                  <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                )}
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
            <h4 className="font-bold text-blue-900 mb-2">Explanation:</h4>
            <p className="text-blue-800">{content.test.explanation}</p>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transition"
            >
              Back to {appName}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Default: Lesson content
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-2xl"
      >
        <div className="mb-8">
          <div className="inline-block bg-blue-100 px-4 py-2 rounded-full text-blue-700 font-semibold mb-4">
            Sample Lesson • {appName}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.lesson.title}
          </h1>
          <p className="text-lg text-gray-700">
            {content.lesson.intro}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Concepts</h3>
          <ul className="space-y-2">
            {content.lesson.concepts.map((concept, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-500 mr-2 flex-shrink-0 mt-1">✓</span>
                <span className="text-gray-700">{concept}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Example Problem</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-700 mb-2">Question:</p>
              <p className="text-gray-900">{content.lesson.example.question}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Solution:</p>
              <p className="text-gray-900 font-mono bg-white p-3 rounded border border-gray-300">
                {content.lesson.example.solution}
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">Explanation:</p>
              <p className="text-gray-700">{content.lesson.example.explanation}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-8">
          <p className="text-yellow-800 text-sm">
            <strong>📌 Sample Content:</strong> This is AI-generated educational content to
            preview the course structure. Full lessons with interactive elements are coming soon.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
          >
            ← Back to Course
          </Link>
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl transition">
            Continue Learning →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
