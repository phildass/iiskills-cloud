"use client";

import { motion } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { COGNITIVE_DOMAINS, DOMAIN_SUPERPOWERS, getSuperpowerForScore } from "../lib/questionBank";

// Brain-Print SVG Generator Component
export function BrainPrintGenerator({ domainScores, onExport }) {
  // Prepare data for radar chart
  const chartData = [
    {
      domain: 'Numerical',
      score: domainScores[COGNITIVE_DOMAINS.NUMERICAL] || 0,
      fullMark: 100,
    },
    {
      domain: 'Logical',
      score: domainScores[COGNITIVE_DOMAINS.LOGICAL] || 0,
      fullMark: 100,
    },
    {
      domain: 'Verbal',
      score: domainScores[COGNITIVE_DOMAINS.VERBAL] || 0,
      fullMark: 100,
    },
    {
      domain: 'Spatial',
      score: domainScores[COGNITIVE_DOMAINS.SPATIAL] || 0,
      fullMark: 100,
    },
    {
      domain: 'Data',
      score: domainScores[COGNITIVE_DOMAINS.DATA_INTERPRETATION] || 0,
      fullMark: 100,
    },
  ];

  // Calculate overall statistics
  const scores = Object.values(domainScores);
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : 0;
  const topDomain = Object.entries(domainScores).reduce((a, b) => 
    b[1] > a[1] ? b : a, ['', 0]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-midnight-900 to-midnight-800 rounded-3xl p-8 border border-electric-violet-500/30 shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4 inline-block"
          >
            🧠
          </motion.div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-2">
            Your Brain-Print
          </h2>
          <p className="text-gray-300 text-lg">
            Unique cognitive signature based on your performance
          </p>
        </div>

        {/* Radar Chart */}
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="#a855f7" strokeOpacity={0.3} />
              <PolarAngleAxis 
                dataKey="domain" 
                tick={{ fill: '#fff', fontSize: 14 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#a855f7' }}
              />
              <Radar
                name="Your Score"
                dataKey="score"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.6}
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Domain Scores Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {Object.entries(domainScores).map(([domain, score]) => {
            const superpower = getSuperpowerForScore(domain, score);
            return (
              <motion.div
                key={domain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl mb-2">{superpower?.title?.split(' ')[0] || '💎'}</div>
                <div className="text-white font-semibold text-sm mb-1">
                  {domain.split(' ')[0]}
                </div>
                <div className="text-2xl font-bold text-electric-violet-400">
                  {score}%
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overall Statistics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-electric-violet-600/20 to-blue-600/20 rounded-xl p-6 border border-electric-violet-500/30">
            <div className="text-gray-400 text-sm mb-1">Overall Score</div>
            <div className="text-4xl font-bold text-white">{averageScore}%</div>
            <div className="text-electric-violet-300 mt-2">
              {averageScore >= 80 ? '🏆 Exceptional' : averageScore >= 60 ? '⭐ Strong' : averageScore >= 40 ? '💪 Growing' : '🌱 Building'}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-500/30">
            <div className="text-gray-400 text-sm mb-1">Top Domain</div>
            <div className="text-2xl font-bold text-white mb-1">
              {topDomain[0].split(' ')[0]}
            </div>
            <div className="text-3xl font-bold text-blue-400">{topDomain[1]}%</div>
          </div>
        </div>

        {/* Export Button */}
        {onExport && (
          <div className="text-center">
            <button
              onClick={onExport}
              className="px-8 py-4 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white rounded-xl font-bold hover:from-electric-violet-600 hover:to-blue-600 transition-all shadow-lg"
            >
              📥 Export Brain-Print as JSON
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Superpower Reveal Component
export function SuperpowerReveal({ domain, score, onContinue }) {
  const superpower = getSuperpowerForScore(domain, score);
  
  if (!superpower) return null;

  const domainEmojis = {
    [COGNITIVE_DOMAINS.NUMERICAL]: '💰',
    [COGNITIVE_DOMAINS.LOGICAL]: '🧩',
    [COGNITIVE_DOMAINS.VERBAL]: '🎤',
    [COGNITIVE_DOMAINS.SPATIAL]: '🏗️',
    [COGNITIVE_DOMAINS.DATA_INTERPRETATION]: '📊',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-midnight-900 to-midnight-800 rounded-3xl p-10 max-w-2xl mx-auto border-2 border-electric-violet-500 shadow-2xl"
      >
        <div className="text-center">
          {/* Animated emoji */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl mb-6"
          >
            {domainEmojis[domain] || '💎'}
          </motion.div>

          {/* Superpower Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-4"
          >
            {superpower.title}
          </motion.h2>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold text-white mb-6"
          >
            {score}%
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            {superpower.message}
          </motion.p>

          {/* Domain label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <span className="px-6 py-3 bg-gradient-to-r from-electric-violet-500 to-blue-500 text-white rounded-full font-semibold text-lg">
              {domain}
            </span>
          </motion.div>

          {/* Continue button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={onContinue}
            className="px-10 py-4 bg-white text-electric-violet-600 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
          >
            Continue to Results 🚀
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Career Aptitude Insights Component
export function CareerAptitudeInsights({ domainScores }) {
  // Determine top 3 domains
  const topDomains = Object.entries(domainScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const careerMappings = {
    [COGNITIVE_DOMAINS.NUMERICAL]: [
      { title: 'Banking & Finance', salary: '₹8-18 LPA', icon: '💼' },
      { title: 'Data Science', salary: '₹10-25 LPA', icon: '📊' },
      { title: 'Financial Analyst', salary: '₹7-15 LPA', icon: '💰' },
    ],
    [COGNITIVE_DOMAINS.LOGICAL]: [
      { title: 'Software Developer', salary: '₹8-20 LPA', icon: '💻' },
      { title: 'Management Consultant', salary: '₹12-30 LPA', icon: '🎯' },
      { title: 'Operations Research', salary: '₹9-18 LPA', icon: '⚙️' },
    ],
    [COGNITIVE_DOMAINS.VERBAL]: [
      { title: 'Content Strategist', salary: '₹6-15 LPA', icon: '✍️' },
      { title: 'Marketing Manager', salary: '₹8-20 LPA', icon: '📢' },
      { title: 'Sales Leader', salary: '₹10-25 LPA', icon: '💼' },
    ],
    [COGNITIVE_DOMAINS.SPATIAL]: [
      { title: 'Architect', salary: '₹7-18 LPA', icon: '🏛️' },
      { title: 'UI/UX Designer', salary: '₹8-20 LPA', icon: '🎨' },
      { title: '3D Designer', salary: '₹6-15 LPA', icon: '🖌️' },
    ],
    [COGNITIVE_DOMAINS.DATA_INTERPRETATION]: [
      { title: 'Business Analyst', salary: '₹8-18 LPA', icon: '📈' },
      { title: 'Data Analyst', salary: '₹7-16 LPA', icon: '📊' },
      { title: 'Research Analyst', salary: '₹6-14 LPA', icon: '🔬' },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-violet-400 to-blue-400 mb-6">
          🎯 Your Career Pathways
        </h3>

        <p className="text-gray-300 text-lg mb-8">
          Based on your cognitive profile, here are career paths where you'd excel:
        </p>

        {topDomains.map(([domain, score], index) => {
          const careers = careerMappings[domain] || [];
          const superpower = getSuperpowerForScore(domain, score);

          return (
            <motion.div
              key={domain}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{domain}</h4>
                  <p className="text-electric-violet-400 font-semibold">{superpower?.title}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{score}%</div>
                  <div className="text-sm text-gray-400">Top {index + 1} Domain</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {careers.map((career, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-electric-violet-600/20 to-blue-600/20 rounded-xl p-4 border border-electric-violet-500/30"
                  >
                    <div className="text-3xl mb-2">{career.icon}</div>
                    <div className="text-white font-semibold mb-1">{career.title}</div>
                    <div className="text-electric-violet-300 text-sm">{career.salary}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-electric-violet-600 to-blue-600 rounded-2xl p-6 text-center"
        >
          <h4 className="text-2xl font-bold text-white mb-3">
            🚀 Next Step: Career Mapper
          </h4>
          <p className="text-white/90 mb-4">
            Head to the Career Mapper to see how these aptitudes translate to market value, job opportunities, and skill development paths.
          </p>
          <a
            href="/career-mapper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-electric-violet-600 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            Explore Career Mapper →
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
