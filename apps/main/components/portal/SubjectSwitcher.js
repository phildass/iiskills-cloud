import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = [
  {
    id: "math",
    name: "Math",
    color: "#DC143C", // Crimson Red
    gradient: "from-red-700 to-black",
    basicHook: "The Power of Zero & One",
    intermediateHook: "The Variable Hunter",
    advancedHook: "The Infinite Curve",
    pathName: "The Architect's Path",
    ctaText: "Start My Power Hour: Math",
    tagline: "Unlock the Language of Logic",
    icon: "∑",
  },
  {
    id: "physics",
    name: "Physics",
    color: "#0080FF", // Electric Blue
    gradient: "from-blue-500 to-blue-900",
    basicHook: "The Cheetah's Secret",
    intermediateHook: "The Invisible Hand",
    advancedHook: "The Fabric of Time",
    pathName: "The Force Path",
    ctaText: "Master the Laws Now",
    tagline: "Master the Laws of the Universe",
    icon: "⚡",
  },
  {
    id: "geography",
    name: "Geography",
    color: "#10B981", // Emerald Green
    gradient: "from-green-500 to-green-900",
    basicHook: "The Global Grid",
    intermediateHook: "The Moving Earth",
    advancedHook: "The Human Engine",
    pathName: "The Systems Path",
    ctaText: "Chart the Course",
    tagline: "Command the Systems of Earth",
    icon: "🌍",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    color: "#9B59B6", // Atomic Purple
    gradient: "from-purple-600 to-gray-800",
    basicHook: "The Atom's Heart",
    intermediateHook: "The Great Balance",
    advancedHook: "The Heat of Chaos",
    pathName: "The Elemental Path",
    ctaText: "Decode the Elements",
    tagline: "Decode the Ingredients of Reality",
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
          className="bg-white rounded-xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
          style={{
            borderTop: `6px solid ${selectedSubject.color}`,
          }}
        >
          {/* Glassmorphic background gradient */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${selectedSubject.color}40 0%, transparent 100%)`,
            }}
          />

          {/* Path Name Header */}
          <div className="text-center mb-8 relative z-10">
            <h3 
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: selectedSubject.color }}
            >
              {selectedSubject.pathName}
            </h3>
            <p className="text-gray-600 text-lg italic">
              {selectedSubject.tagline}
            </p>
          </div>

          {/* Tri-Level Progression */}
          <div className="space-y-6 relative z-10">
            {/* Level 1: Basic */}
            <motion.div 
              className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl">🟢</div>
                <div>
                  <h4 className="text-xl font-bold text-green-700">Level 1: BASIC</h4>
                  <p className="text-sm text-green-600 font-semibold">Building Intuition</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {selectedSubject.basicHook}
              </p>
              <p className="text-gray-600 text-sm">
                Foundational literacy and terminology. Master the basics in under 60 minutes.
              </p>
            </motion.div>

            {/* Level 2: Intermediate */}
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl">🔵</div>
                <div>
                  <h4 className="text-xl font-bold text-blue-700">Level 2: INTERMEDIATE</h4>
                  <p className="text-sm text-blue-600 font-semibold">The Systems</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {selectedSubject.intermediateHook}
              </p>
              <p className="text-gray-600 text-sm">
                Interactive problem solving and formula application. Predict system behaviors.
              </p>
            </motion.div>

            {/* Level 3: Advanced */}
            <motion.div 
              className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-4xl">🟣</div>
                <div>
                  <h4 className="text-xl font-bold text-purple-700">Level 3: ADVANCED</h4>
                  <p className="text-sm text-purple-600 font-semibold">The Architect</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {selectedSubject.advancedHook}
              </p>
              <p className="text-gray-600 text-sm">
                Theoretical proofs and contemporary research. For the top 1% of learners.
              </p>
            </motion.div>
          </div>

          {/* Enhanced CTA Button with Glow Effect */}
          <div className="mt-8 text-center relative z-10">
            <motion.a
              href={`https://app${
                selectedSubject.id === "math"
                  ? "8"
                  : selectedSubject.id === "physics"
                    ? "6"
                    : selectedSubject.id === "chemistry"
                      ? "7"
                      : "9"
              }.learn-${selectedSubject.id}.iiskills.cloud`}
              className="inline-block px-8 py-4 rounded-lg font-bold text-lg text-white transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden group"
              style={{
                backgroundColor: selectedSubject.color,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle, ${selectedSubject.color} 0%, transparent 70%)`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10">{selectedSubject.ctaText} →</span>
            </motion.a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
