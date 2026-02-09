"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PremiumHero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 border border-amber-600/20 rounded-full"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 border border-amber-600/10 rounded-full"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        {/* Glass texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-amber-900/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        {/* iiskills Academy Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-6 py-3 mb-8 backdrop-blur-xl rounded-full border border-amber-600/30 bg-amber-600/10"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">iS</span>
          </div>
          <span className="text-amber-400 font-semibold tracking-wider text-sm">
            iiskills Academy Premium
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300 mb-6 leading-tight"
        >
          The Art of the
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
            Unspoken
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-4 leading-relaxed"
        >
          Logic gets you the meeting. Finesse gets you the deal.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 italic"
        >
          Master the invisible mechanics of social intelligence, executive presence, and high-stakes
          negotiation.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/courses"
            className="group px-10 py-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 text-gray-900 font-bold text-xl rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Elevate My Presence
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>

          <Link
            href="#gatekeeper"
            className="px-10 py-5 backdrop-blur-xl bg-white/5 text-white border border-gray-600 hover:border-amber-500 font-semibold text-lg rounded-full transition-all duration-300 hover:bg-white/10"
          >
            Test Your Instinct
          </Link>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { icon: "🎯", text: "Power Dynamics" },
            { icon: "🗣️", text: "Verbal Aikido" },
            { icon: "⚡", text: "Executive Gravitas" },
          ].map((item, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-gray-800 hover:border-amber-600/50 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <div className="text-gray-300 font-semibold">{item.text}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
