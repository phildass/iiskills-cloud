"use client";

import { motion } from "framer-motion";

export default function PremiumCertification() {
  return (
    <div className="py-20 px-4 bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Academy Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-amber-600/20 border border-amber-600/30 rounded-full text-amber-400 text-sm font-semibold mb-6">
              iiskills Academy Premium
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif text-white mb-6">
              The Final Layer
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              You've mastered <span className="text-amber-400 font-semibold">Learn Developer</span> or{" "}
              <span className="text-amber-400 font-semibold">Learn Management</span>.
            </p>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Now, master the <span className="italic">people who hire them</span>. Finesse is the final layer that turns technical skill into <span className="text-amber-400 font-semibold">career velocity</span>.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-600/20 text-amber-400">
                  ✓
                </div>
                <p className="text-gray-300">
                  Transform technical expertise into executive presence
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-600/20 text-amber-400">
                  ✓
                </div>
                <p className="text-gray-300">
                  Navigate high-stakes rooms with commanding authority
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-600/20 text-amber-400">
                  ✓
                </div>
                <p className="text-gray-300">
                  Close deals, negotiate offers, and influence outcomes
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Certification Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div
              className="backdrop-blur-xl rounded-2xl p-8 border border-amber-400/30 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(15, 15, 15, 0.95) 100%)",
              }}
            >
              {/* Badge Mockup */}
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  {/* Outer Ring */}
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-400 p-1 shadow-2xl">
                    {/* Inner Circle */}
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      {/* Badge Icon */}
                      <div className="text-5xl">🏆</div>
                    </div>
                  </div>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                </div>
              </div>

              <h3 className="text-3xl font-serif text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 mb-4">
                Executive Gravitas
              </h3>

              <p className="text-center text-gray-400 mb-6 text-sm">
                Social Intelligence Portfolio
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300 text-sm">Power Dynamics</span>
                  <span className="text-amber-400 font-bold">Mastered</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300 text-sm">Verbal Aikido</span>
                  <span className="text-amber-400 font-bold">Mastered</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300 text-sm">Negotiation Psychology</span>
                  <span className="text-amber-400 font-bold">Mastered</span>
                </div>
              </div>

              <div className="p-4 bg-amber-600/10 border border-amber-600/30 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                  Displays on your <span className="text-amber-400 font-semibold">iiskills Global Profile</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="/courses"
            className="inline-block px-12 py-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 text-gray-900 font-bold text-xl rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
          >
            Elevate My Presence
          </a>
          <p className="text-gray-500 text-sm mt-4">
            Join the iiskills Academy. Master the invisible mechanics of power.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
