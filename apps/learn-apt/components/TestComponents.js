"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Progress Orbit Component with glowing ring animation
export function ProgressOrbit({ current, total, score }) {
  const progress = (current / total) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      {/* Background circle */}
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle with glow */}
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{current}</span>
        <span className="text-xs text-gray-400">of {total}</span>
      </div>
    </div>
  );
}

// Glassmorphism Question Card
export function QuestionCard({ question, selectedAnswer, onSelectAnswer, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-violet-600/20 to-blue-600/20 rounded-3xl blur-xl -z-10" />
      
      {children}
    </motion.div>
  );
}

// Answer feedback with haptic-style animation
export function AnswerFeedback({ isCorrect, show }) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.8, 0],
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl ${
            isCorrect 
              ? 'bg-emerald-glow/30 border-4 border-emerald-glow' 
              : 'bg-ruby-fade/30 border-4 border-ruby-fade'
          }`}
        >
          {isCorrect ? '✓' : '✗'}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Brain Fact Insight Pop-up
export function BrainFactPopup({ fact, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative bg-gradient-to-br from-electric-violet-600 to-blue-600 rounded-3xl p-8 max-w-lg mx-auto border-2 border-electric-violet-400 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              💡
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">Brain Fact!</h3>
            <p className="text-lg text-white/90 mb-6">{fact}</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white text-electric-violet-600 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Continue Testing 🚀
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Live Leaderboard Sidebar (collapsed on mobile)
export function LeaderboardSidebar({ isOpen, onToggle, topScorers }) {
  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-20 right-4 z-40 w-12 h-12 bg-gradient-to-r from-electric-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg"
      >
        {isOpen ? '✕' : '🏆'}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : '100%'
        }}
        className="fixed top-0 right-0 h-full w-80 bg-midnight-900/95 backdrop-blur-md border-l border-white/10 shadow-2xl z-30 overflow-y-auto lg:translate-x-0"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              🏆 Top Scorers
            </h3>
          </div>
          
          <p className="text-sm text-gray-400 mb-4">Live - Last Hour in India</p>

          <div className="space-y-3">
            {topScorers.map((scorer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </span>
                    <span className="text-white font-semibold">{scorer.name}</span>
                  </div>
                  <span className="text-electric-violet-400 font-bold">{scorer.score}%</span>
                </div>
                <div className="text-xs text-gray-400">{scorer.domain}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-electric-violet-600/20 to-blue-600/20 rounded-xl border border-electric-violet-500/30">
            <p className="text-sm text-white/80 text-center">
              💎 Your rank updates in real-time as you complete tests
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Difficulty Indicator Badge
export function DifficultyBadge({ level }) {
  const configs = {
    1: { label: 'Easy', color: 'from-green-500 to-emerald-500', emoji: '⭐' },
    2: { label: 'Medium', color: 'from-blue-500 to-cyan-500', emoji: '⭐⭐' },
    3: { label: 'Hard', color: 'from-orange-500 to-red-500', emoji: '⭐⭐⭐' },
    4: { label: 'Expert', color: 'from-purple-500 to-pink-500', emoji: '⭐⭐⭐⭐' },
  };

  const config = configs[level] || configs[1];

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.color} rounded-full text-white text-sm font-semibold shadow-lg`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </motion.div>
  );
}

// Timer with pulsing animation when time is low
export function TestTimer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = percentage < 20;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      animate={isLow ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.5, repeat: isLow ? Infinity : 0 }}
      className={`px-6 py-3 rounded-xl ${
        isLow 
          ? 'bg-gradient-to-r from-red-500 to-orange-500' 
          : 'bg-gradient-to-r from-electric-violet-500 to-blue-500'
      } text-white font-bold text-xl shadow-lg`}
    >
      ⏱️ {formatTime(timeLeft)}
    </motion.div>
  );
}

// Domain Tag Component
export function DomainTag({ domain, color }) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${color} rounded-full text-white text-sm font-semibold`}>
      <span>{domain}</span>
    </div>
  );
}

// Question Navigation Dots
export function QuestionNavigation({ total, current, answers, onNavigate }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <motion.button
          key={i}
          onClick={() => onNavigate(i)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`w-10 h-10 rounded-full font-semibold text-sm transition-all ${
            i === current
              ? 'bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white ring-4 ring-electric-violet-300'
              : answers[i] !== undefined
              ? 'bg-emerald-glow text-white'
              : 'bg-white/10 text-gray-400 border border-white/20'
          }`}
        >
          {i + 1}
        </motion.button>
      ))}
    </div>
  );
}
