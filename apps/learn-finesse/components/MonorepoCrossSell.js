"use client";

import { motion } from "framer-motion";

const BUNDLE_APPS = [
  {
    name: "Learn Management",
    description: "Master the process. Systems, strategy, and execution.",
    icon: "📊",
    color: "from-blue-600 to-cyan-500",
  },
  {
    name: "Learn Developer",
    description: "Master the craft. Code, architecture, and technical excellence.",
    icon: "💻",
    color: "from-green-600 to-emerald-500",
  },
  {
    name: "Learn Finesse",
    description: "Master the people. Influence, presence, and power dynamics.",
    icon: "✨",
    color: "from-amber-600 to-yellow-500",
  },
];

export default function MonorepoCrossSell() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-amber-600/20 border border-amber-600/30 rounded-full text-amber-400 text-sm font-semibold mb-6">
            The Professional Bundle
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Complete Mastery
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master the System. Master the People. Combine <span className="text-blue-400 font-semibold">Learn Management</span>{" "}
            (The Process) with <span className="text-amber-400 font-semibold">Learn Finesse</span>{" "}
            (The People) for unified leadership.
          </p>
        </motion.div>

        {/* Bundle Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {BUNDLE_APPS.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="backdrop-blur-xl rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
              style={{
                background: "linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.8) 100%)",
              }}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {app.icon}
              </div>
              
              <h3 className="text-2xl font-serif text-white mb-3">
                {app.name}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {app.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-amber-400/20 shadow-2xl mb-12"
          style={{
            background: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-serif text-amber-400 mb-4">
                Why Bundle?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 text-xl">→</span>
                  <span className="text-gray-300">
                    <span className="font-semibold">Holistic Leadership:</span> Technical + Social mastery
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 text-xl">→</span>
                  <span className="text-gray-300">
                    <span className="font-semibold">Unified Profile:</span> Showcase complete competency
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 text-xl">→</span>
                  <span className="text-gray-300">
                    <span className="font-semibold">Career Acceleration:</span> Stand out in competitive markets
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-2xl font-serif text-amber-400 mb-4">
                The Complete Leader
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Management gives you the frameworks. Developer gives you the craft. Finesse gives you the influence.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Together, they create the modern executive: <span className="italic">technically fluent, strategically sharp, and socially commanding</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <a
            href="https://iiskills.cloud"
            className="inline-block px-12 py-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 text-gray-900 font-bold text-xl rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 animate-pulse"
          >
            Get the Academy Bundle
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Access all iiskills Academy apps with a single subscription
          </p>
        </motion.div>
      </div>
    </div>
  );
}
