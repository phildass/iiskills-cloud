import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = [
  {
    id: "math",
    name: "Math",
    color: "#3B82F6",
    basicHook: "Number Sense: The Power of Zero.",
    advancedHook: "Calculus: Limits & Derivatives.",
    ctaText: "Solve the Universe",
    icon: "∑",
  },
  {
    id: "physics",
    name: "Physics",
    color: "#8B5CF6",
    basicHook: "Motion: The Cheetah's Velocity.",
    advancedHook: "Quantum: Special Relativity.",
    ctaText: "Master the Laws",
    icon: "⚡",
  },
  {
    id: "geography",
    name: "Geography",
    color: "#10B981",
    basicHook: "The Grid: Equators & Compasses.",
    advancedHook: "Geopolitics: Global Trade Routes.",
    ctaText: "Command the Map",
    icon: "🌍",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "#F59E0B",
    basicHook: "The Atom: Protons & Electrons.",
    advancedHook: "Thermodynamics: Entropy.",
    ctaText: "Decode Matter",
    icon: "⚗️",
  },
];

export default function SubjectSwitcher() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Subject Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {SUBJECTS.map((subject) => (
          <button
            key={subject.id}
            onClick={() => setSelectedSubject(subject)}
            className={`relative p-4 rounded-lg font-mono font-bold text-lg transition-all duration-300 ${
              selectedSubject.id === subject.id
                ? "bg-white shadow-lg scale-105"
                : "bg-white/50 hover:bg-white/70 shadow"
            }`}
            style={{
              borderLeft: `4px solid ${subject.color}`,
              color: selectedSubject.id === subject.id ? subject.color : "#6B7280",
            }}
          >
            <div className="text-3xl mb-2">{subject.icon}</div>
            <div>{subject.name}</div>
            {selectedSubject.id === subject.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg border-2"
                style={{ borderColor: subject.color }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Subject Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSubject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-xl p-8 md:p-12"
          style={{
            borderTop: `6px solid ${selectedSubject.color}`,
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column: Basic Level */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: selectedSubject.color }}
                />
                <h3 className="text-sm font-mono uppercase tracking-wider text-gray-500">
                  Level 1: Basic
                </h3>
              </div>
              <p
                className="text-2xl font-bold leading-tight"
                style={{ color: selectedSubject.color }}
              >
                {selectedSubject.basicHook}
              </p>
              <p className="text-gray-600">
                Building foundational intuition and terminology. Master the basics in under 60 minutes.
              </p>
            </div>

            {/* Right Column: Advanced Level */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedSubject.color }}
                />
                <h3 className="text-sm font-mono uppercase tracking-wider text-gray-500">
                  Level 3: Advanced
                </h3>
              </div>
              <p
                className="text-2xl font-bold leading-tight"
                style={{ color: selectedSubject.color }}
              >
                {selectedSubject.advancedHook}
              </p>
              <p className="text-gray-600">
                Theoretical proofs and contemporary research. For the top 1% of learners.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <a
              href={`https://app${
                subject.id === "math"
                  ? "8"
                  : subject.id === "physics"
                    ? "6"
                    : subject.id === "chemistry"
                      ? "7"
                      : "9"
              }.learn-${selectedSubject.id}.iiskills.cloud`}
              className="inline-block px-8 py-4 rounded-lg font-bold text-lg text-white transition-all duration-300 hover:shadow-2xl hover:scale-105"
              style={{
                backgroundColor: selectedSubject.color,
              }}
            >
              {selectedSubject.ctaText} →
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
