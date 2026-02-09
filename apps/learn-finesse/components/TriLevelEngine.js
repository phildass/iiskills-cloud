"use client";

import { motion } from "framer-motion";

const LEVELS = [
  {
    level: 1,
    tier: "BASIC",
    title: "The Foundation of Presence",
    hook: "Decoding the Social Blueprint.",
    modules: ["Micro-expressions", "Posture Archetypes", "The First 7 Seconds"],
    outcome: "Eliminate awkwardness, project baseline confidence.",
    gradient: "from-amber-600 via-yellow-500 to-amber-400",
    borderColor: "border-amber-400/30",
  },
  {
    level: 2,
    tier: "INTERMEDIATE",
    title: "The Systems of Influence",
    hook: "Strategic Communication.",
    modules: ["Active Listening Logic", "The Art of the Pivot", "Conversational Calibration"],
    outcome: "Navigate complex social rooms, lead any conversation.",
    gradient: "from-amber-500 via-yellow-400 to-amber-300",
    borderColor: "border-amber-300/30",
  },
  {
    level: 3,
    tier: "ADVANCED",
    title: "The Apex of Power",
    hook: "High-Stakes Manipulation & Magnetism.",
    modules: ["Negotiation Psychology", "Crisis Charisma", "Executive Gravitas"],
    outcome: "Command authority, master power dynamics in elite settings.",
    gradient: "from-yellow-400 via-amber-300 to-yellow-200",
    borderColor: "border-yellow-300/30",
  },
];

export default function TriLevelEngine() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">The Finesse Engine</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A rigorous, engineered system for social intelligence. Ascend through three levels of
            mastery.
          </p>
        </motion.div>

        {/* Levels Container */}
        <div className="relative">
          {/* Vertical Connector Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 via-yellow-500 to-yellow-300 transform -translate-x-1/2 hidden md:block" />

          {/* Level Cards */}
          <div className="space-y-12">
            {LEVELS.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`relative ${index % 2 === 0 ? "md:pr-1/2" : "md:pl-1/2 md:ml-auto"} max-w-3xl`}
              >
                <div
                  className={`backdrop-blur-xl rounded-2xl p-8 border ${level.borderColor} shadow-2xl`}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(15, 15, 15, 0.95) 100%)",
                  }}
                >
                  {/* Level Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`inline-block bg-gradient-to-r ${level.gradient} text-gray-900 px-6 py-2 rounded-full font-bold text-sm tracking-wider`}
                    >
                      LEVEL {level.level}: {level.tier}
                    </div>
                    <div className="text-4xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                      0{level.level}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-serif text-white mb-3">{level.title}</h3>

                  {/* Hook */}
                  <p className="text-xl text-amber-400 italic mb-6">{level.hook}</p>

                  {/* Modules */}
                  <div className="mb-6">
                    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3 font-semibold">
                      Core Modules
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {level.modules.map((module, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 text-sm"
                        >
                          {module}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Outcome */}
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-gray-300 leading-relaxed">
                      <span className="text-amber-400 font-semibold">Outcome:</span> {level.outcome}
                    </p>
                  </div>
                </div>

                {/* Connector Dot */}
                <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${level.gradient} shadow-lg`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/courses"
            className="inline-block px-10 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 text-gray-900 font-bold rounded-full text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
          >
            Begin Your Ascent
          </a>
        </motion.div>
      </div>
    </div>
  );
}
