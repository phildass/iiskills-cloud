import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CommandCenterSidebar from "../components/CommandCenterSidebar";
import { useUserProgress } from "../contexts/UserProgressContext";

// Career path definitions with prerequisite mappings (static data)
const CAREER_PATHS = [
    {
      id: "fintech-architect",
      title: "FinTech Architect",
      icon: "💰",
      description: "Design and build financial technology platforms and payment systems",
      salaryRange: "₹18-30 LPA",
      avgSalary: 24,
      prerequisites: [
        { app: "learn-apt", minProgress: 70, weight: 0.3 },
        { app: "learn-math", minProgress: 30, weight: 0.3 },
        { app: "learn-developer", minProgress: 50, weight: 0.4 },
      ],
      trendingSkills: ["Blockchain", "API Design", "Payment Gateways", "Security"],
      marketTrend: "High demand - Growing 25% annually",
    },
    {
      id: "ai-ml-engineer",
      title: "AI/ML Engineer",
      icon: "🤖",
      description: "Build and deploy machine learning models and AI systems",
      salaryRange: "₹15-28 LPA",
      avgSalary: 22,
      prerequisites: [
        { app: "learn-ai", minProgress: 50, weight: 0.5 },
        { app: "learn-developer", minProgress: 40, weight: 0.3 },
        { app: "learn-math", minProgress: 40, weight: 0.2 },
      ],
      trendingSkills: ["Deep Learning", "Python", "TensorFlow", "Data Analysis"],
      marketTrend: "Very High demand - 30% growth",
    },
    {
      id: "full-stack-developer",
      title: "Full Stack Developer",
      icon: "💻",
      description: "Create complete web applications from frontend to backend",
      salaryRange: "₹8-18 LPA",
      avgSalary: 13,
      prerequisites: [
        { app: "learn-developer", minProgress: 60, weight: 0.7 },
        { app: "learn-apt", minProgress: 30, weight: 0.3 },
      ],
      trendingSkills: ["React", "Node.js", "Databases", "Cloud Deployment"],
      marketTrend: "High demand - Stable growth",
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      icon: "📊",
      description: "Extract insights from data using statistical analysis and ML",
      salaryRange: "₹12-25 LPA",
      avgSalary: 18,
      prerequisites: [
        { app: "learn-ai", minProgress: 40, weight: 0.4 },
        { app: "learn-math", minProgress: 50, weight: 0.3 },
        { app: "learn-apt", minProgress: 40, weight: 0.3 },
      ],
      trendingSkills: ["Statistics", "Python", "SQL", "Data Visualization"],
      marketTrend: "High demand - Growing steadily",
    },
    {
      id: "product-manager-tech",
      title: "Product Manager (Tech)",
      icon: "🎯",
      description: "Lead product development and strategy for tech products",
      salaryRange: "₹15-35 LPA",
      avgSalary: 25,
      prerequisites: [
        { app: "learn-management", minProgress: 50, weight: 0.4 },
        { app: "learn-developer", minProgress: 30, weight: 0.3 },
        { app: "learn-apt", minProgress: 50, weight: 0.3 },
      ],
      trendingSkills: ["Product Strategy", "Analytics", "Agile", "User Research"],
      marketTrend: "Very High demand - Premium salaries",
    },
    {
      id: "govt-services-officer",
      title: "Government Services Officer",
      icon: "🏛️",
      description: "Civil services and administrative positions in government",
      salaryRange: "₹8-15 LPA",
      avgSalary: 11,
      prerequisites: [
        { app: "learn-govt-jobs", minProgress: 50, weight: 0.4 },
        { app: "learn-geography", minProgress: 40, weight: 0.3 },
        { app: "learn-apt", minProgress: 60, weight: 0.3 },
      ],
      trendingSkills: ["Current Affairs", "Policy Analysis", "Administration", "Law"],
      marketTrend: "Stable - High job security",
    },
    {
      id: "physics-researcher",
      title: "Physics Researcher/Educator",
      icon: "⚛️",
      description: "Research, teaching, and innovation in physics domains",
      salaryRange: "₹6-20 LPA",
      avgSalary: 13,
      prerequisites: [
        { app: "learn-physics", minProgress: 60, weight: 0.5 },
        { app: "learn-math", minProgress: 50, weight: 0.3 },
        { app: "learn-chemistry", minProgress: 30, weight: 0.2 },
      ],
      trendingSkills: ["Research Methods", "Lab Techniques", "Data Analysis", "Teaching"],
      marketTrend: "Moderate demand - Academic growth",
    },
    {
      id: "pr-communications-head",
      title: "PR & Communications Head",
      icon: "📣",
      description: "Lead public relations and corporate communications",
      salaryRange: "₹10-22 LPA",
      avgSalary: 16,
      prerequisites: [
        { app: "learn-pr", minProgress: 60, weight: 0.5 },
        { app: "learn-management", minProgress: 40, weight: 0.3 },
        { app: "learn-ai", minProgress: 20, weight: 0.2 },
      ],
      trendingSkills: ["Media Relations", "Crisis Management", "Content Strategy", "Digital PR"],
      marketTrend: "Growing - AI tools integration",
    },
    {
      id: "climate-analyst",
      title: "Climate & Geography Analyst",
      icon: "🌍",
      description: "Analyze environmental data and geographical patterns",
      salaryRange: "₹7-18 LPA",
      avgSalary: 12,
      prerequisites: [
        { app: "learn-geography", minProgress: 60, weight: 0.5 },
        { app: "learn-physics", minProgress: 30, weight: 0.2 },
        { app: "learn-ai", minProgress: 30, weight: 0.3 },
      ],
      trendingSkills: ["GIS", "Climate Modeling", "Data Analysis", "Sustainability"],
      marketTrend: "Growing - Climate focus",
    },
    {
      id: "operations-manager",
      title: "Operations Manager",
      icon: "⚙️",
      description: "Optimize business operations and process efficiency",
      salaryRange: "₹12-24 LPA",
      avgSalary: 18,
      prerequisites: [
        { app: "learn-management", minProgress: 60, weight: 0.5 },
        { app: "learn-apt", minProgress: 50, weight: 0.3 },
        { app: "learn-math", minProgress: 30, weight: 0.2 },
      ],
      trendingSkills: ["Process Optimization", "Analytics", "Supply Chain", "Leadership"],
      marketTrend: "High demand - Cross-industry",
    },
  ];

/**
 * Universal Career Mapper - Skill Constellation Page
 * 
 * Features:
 * - Interactive skill constellation with 10 app nodes
 * - Glassmorphism career path cards
 * - Weighted suitability algorithm for career matching
 * - Dynamic salary ticker based on skill combinations
 * - Missing link nudges for high-value opportunities
 * - PDF roadmap export
 * - Free access for all users
 * 
 * Planned API: Real-time user progress from all 10 apps
 */
export default function CareerMapper() {
  const { apps } = useUserProgress();
  const [selectedCareerPath, setSelectedCareerPath] = useState(null);
  const [salaryEstimate, setSalaryEstimate] = useState(0);
  const [targetSalary, setTargetSalary] = useState(0);
  const [missingLinks, setMissingLinks] = useState([]);
  const canvasRef = useRef(null);

  // Calculate app completion percentage
  const getAppCompletion = (appId) => {
    const app = apps.find(a => a.id === appId);
    if (!app) return 0;
    return (app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3;
  };

  // Calculate career path suitability score
  const calculateSuitability = (path) => {
    let totalScore = 0;
    let totalWeight = 0;
    let missingRequirements = [];

    path.prerequisites.forEach(req => {
      const completion = getAppCompletion(req.app);
      const app = apps.find(a => a.id === req.app);
      
      if (completion >= req.minProgress) {
        totalScore += (completion / 100) * req.weight;
      } else {
        const deficit = req.minProgress - completion;
        missingRequirements.push({
          app: app?.name || req.app,
          appId: req.app,
          current: completion,
          required: req.minProgress,
          deficit: deficit,
        });
      }
      totalWeight += req.weight;
    });

    const score = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
    return {
      score: Math.round(score),
      missing: missingRequirements,
      unlocked: missingRequirements.length === 0,
    };
  };

  // Calculate salary estimate based on strongest matches
  useEffect(() => {
    const suitabilities = CAREER_PATHS.map(path => ({
      ...path,
      suitability: calculateSuitability(path),
    }));

    // Calculate weighted average salary
    const topMatches = suitabilities
      .filter(p => p.suitability.score > 30)
      .sort((a, b) => b.suitability.score - a.suitability.score)
      .slice(0, 3);

    if (topMatches.length > 0) {
      const weightedSalary = topMatches.reduce((sum, match) => 
        sum + (match.avgSalary * match.suitability.score / 100), 0
      ) / topMatches.length;
      setTargetSalary(Math.round(weightedSalary));
    } else {
      setTargetSalary(8); // Base salary
    }

    // Find missing links with high value
    const potentialGaps = [];
    suitabilities.forEach(path => {
      if (!path.suitability.unlocked && path.suitability.score > 50) {
        path.suitability.missing.forEach(missing => {
          const potentialIncrease = (path.avgSalary - (targetSalary || 8)) * 0.7;
          if (potentialIncrease > 2) {
            potentialGaps.push({
              ...missing,
              careerPath: path.title,
              salaryIncrease: Math.round(potentialIncrease),
            });
          }
        });
      }
    });

    // Deduplicate and sort by salary increase
    const uniqueGaps = potentialGaps.reduce((acc, gap) => {
      const existing = acc.find(g => g.appId === gap.appId);
      if (!existing || gap.salaryIncrease > existing.salaryIncrease) {
        return [...acc.filter(g => g.appId !== gap.appId), gap];
      }
      return acc;
    }, []);

    setMissingLinks(uniqueGaps.sort((a, b) => b.salaryIncrease - a.salaryIncrease).slice(0, 3));
  }, [apps]);

  // Animate salary ticker
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = targetSalary / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, targetSalary);
      setSalaryEstimate(Math.round(current));

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetSalary]);

  // Render constellation stars (optimized for mobile)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Reduce star count on mobile devices for better performance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const starCount = isMobile ? 50 : 100;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5,
    }));

    let animationFrame;
    const animate = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Generate PDF roadmap
  const generatePDF = async () => {
    // Import jsPDF dynamically to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text('My Career Roadmap', 20, 20);

    // Current Salary Estimate
    doc.setFontSize(14);
    doc.text(`Estimated Market Value: ₹${salaryEstimate} LPA`, 20, 35);

    // App Progress
    doc.setFontSize(12);
    doc.text('My Learning Progress:', 20, 50);
    let yPos = 60;
    apps.forEach((app, index) => {
      const completion = getAppCompletion(app.id);
      doc.setFontSize(10);
      doc.text(`${app.name}: ${Math.round(completion)}%`, 25, yPos);
      yPos += 7;
    });

    // Career Recommendations
    yPos += 10;
    doc.setFontSize(12);
    doc.text('Top Career Matches:', 20, yPos);
    yPos += 10;

    const suitabilities = CAREER_PATHS
      .map(path => ({ ...path, suitability: calculateSuitability(path) }))
      .filter(p => p.suitability.score > 40)
      .sort((a, b) => b.suitability.score - a.suitability.score)
      .slice(0, 5);

    suitabilities.forEach((path, index) => {
      doc.setFontSize(11);
      doc.text(`${index + 1}. ${path.title} (${path.suitability.score}% match)`, 25, yPos);
      yPos += 6;
      doc.setFontSize(9);
      doc.text(`   ${path.salaryRange} - ${path.marketTrend}`, 25, yPos);
      yPos += 8;
    });

    // Missing Links
    if (missingLinks.length > 0) {
      yPos += 5;
      doc.setFontSize(12);
      doc.text('Unlock Higher Salaries:', 20, yPos);
      yPos += 10;

      missingLinks.forEach((link, index) => {
        doc.setFontSize(10);
        doc.text(`• Complete ${link.app} to unlock ₹${link.salaryIncrease}+ LPA`, 25, yPos);
        yPos += 7;
      });
    }

    // Footer (use dynamic position based on content)
    yPos = Math.max(yPos + 10, 270); // Ensure minimum spacing, but use content position
    doc.setFontSize(8);
    doc.text('Generated by iiskills.cloud Career Mapper', 20, yPos);
    doc.text(new Date().toLocaleDateString(), 20, yPos + 5);

    // Download
    doc.save('my-career-roadmap.pdf');
  };

  return (
    <>
      <Head>
        <title>Universal Career Mapper - Skill Constellation | iiskills.cloud</title>
        <meta
          name="description"
          content="Interactive skill constellation showing your progress across all learning apps and personalized career path recommendations with salary estimates."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <CommandCenterSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              🌌 Universal Career Mapper
            </h1>
            <p className="text-gray-600 text-lg">
              Your skill constellation across all learning tracks and personalized career guidance
            </p>
          </div>

          {/* Streak Challenge Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-lg shadow-md text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {missingLinks.length > 0 ? '🎯 Unlock Higher Salaries' : '🎉 No Missing Links!'}
                </p>
                <p className="text-sm opacity-90">
                  {missingLinks.length > 0 
                    ? `${missingLinks.length} high-value opportunities identified`
                    : 'You have great coverage across learning tracks!'}
                </p>
              </div>
              <div className="text-2xl font-bold">
                {missingLinks.length > 0 ? `${missingLinks.length}` : '✓'}
              </div>
            </div>
          </motion.div>

          {/* Salary Ticker */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl text-white"
          >
            <p className="text-sm font-medium opacity-90 mb-2">Your Estimated Market Value</p>
            <div className="flex items-baseline gap-2">
              <motion.span
                key={salaryEstimate}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl font-bold tabular-nums"
              >
                ₹{salaryEstimate}
              </motion.span>
              <span className="text-2xl">LPA</span>
            </div>
            <p className="text-sm opacity-90 mt-2">
              Based on your skill profile and market trends
            </p>
          </motion.div>

          {/* Constellation Visualization */}
          <div className="mb-8 relative">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full rounded-2xl"
              style={{ height: '400px' }}
            />
            <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700" style={{ minHeight: '400px' }}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Your Skill Constellation
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {apps.map((app, index) => {
                  const completion = getAppCompletion(app.id);
                  const isPulsing = completion >= 30;

                  return (
                    <motion.div
                      key={app.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative"
                    >
                      <motion.div
                        animate={isPulsing ? {
                          boxShadow: [
                            '0 0 0 0 rgba(59, 130, 246, 0.7)',
                            '0 0 0 20px rgba(59, 130, 246, 0)',
                          ],
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border-2 border-gray-700 hover:border-blue-500 transition-all cursor-pointer group"
                        style={{
                          borderColor: completion >= 30 ? app.color : undefined,
                        }}
                      >
                        {/* Completion Ring */}
                        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gray-900 border-4 flex items-center justify-center text-xs font-bold text-white"
                          style={{
                            borderColor: app.color,
                            background: `conic-gradient(${app.color} ${completion * 3.6}deg, #1f2937 0deg)`,
                          }}
                        >
                          <span className="bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center">
                            {Math.round(completion)}%
                          </span>
                        </div>

                        <div className="text-center">
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                            {app.id === 'learn-ai' && '🤖'}
                            {app.id === 'learn-apt' && '🎯'}
                            {app.id === 'learn-math' && '📐'}
                            {app.id === 'learn-physics' && '⚛️'}
                            {app.id === 'learn-chemistry' && '🧪'}
                            {app.id === 'learn-geography' && '🌍'}
                            {app.id === 'learn-pr' && '📣'}
                            {app.id === 'learn-management' && '💼'}
                            {app.id === 'learn-developer' && '💻'}
                            {app.id === 'learn-govt-jobs' && '🏛️'}
                          </div>
                          <p className="text-white text-xs font-medium">
                            {app.name.replace('Learn ', '')}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Missing Link Nudges */}
          {missingLinks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Unlock Higher Salaries
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {missingLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div className="flex-1">
                        <p className="font-bold text-orange-900 mb-1">
                          You're leaving ₹{link.salaryIncrease}+ LPA on the table!
                        </p>
                        <p className="text-sm text-orange-800 mb-2">
                          Complete {link.app} ({Math.round(link.current)}% → {link.required}%) to unlock {link.careerPath}
                        </p>
                        <Link
                          href={`/${link.appId}`}
                          className="inline-block px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Quick Start →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Career Path Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                🎯 Career Paths For You
              </h2>
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                📄 Download Roadmap
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {CAREER_PATHS.map((path) => {
                const suitability = calculateSuitability(path);
                const isHighMatch = suitability.score >= 70;
                const isMediumMatch = suitability.score >= 40;

                return (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedCareerPath(
                      selectedCareerPath?.id === path.id ? null : path
                    )}
                    className={`
                      relative p-6 rounded-2xl cursor-pointer transition-all
                      ${isHighMatch ? 'bg-green-50 border-2 border-green-400' : 
                        isMediumMatch ? 'bg-blue-50 border-2 border-blue-300' : 
                        'bg-white border border-gray-200'}
                      ${isHighMatch ? 'shadow-lg shadow-green-200' : 'shadow-md'}
                      hover:shadow-xl
                      backdrop-blur-sm bg-opacity-90
                    `}
                    style={{
                      backgroundImage: isHighMatch ? 
                        'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)' : 
                        undefined,
                    }}
                  >
                    {/* Match Badge */}
                    {isHighMatch && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                      >
                        ⭐ Best Match
                      </motion.div>
                    )}

                    {/* Icon and Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-4xl">{path.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {path.title}
                        </h3>
                        <p className="text-sm text-gray-600">{path.salaryRange}</p>
                      </div>
                    </div>

                    {/* Suitability Score */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Match Score</span>
                        <span className={`font-bold ${
                          isHighMatch ? 'text-green-600' : 
                          isMediumMatch ? 'text-blue-600' : 
                          'text-gray-600'
                        }`}>
                          {suitability.score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${suitability.score}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-2 rounded-full ${
                            isHighMatch ? 'bg-green-500' : 
                            isMediumMatch ? 'bg-blue-500' : 
                            'bg-gray-400'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-3">
                      {path.description}
                    </p>

                    {/* Missing Requirements */}
                    {suitability.missing.length > 0 && (
                      <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">
                          Missing Requirements:
                        </p>
                        {suitability.missing.slice(0, 2).map((missing, index) => (
                          <p key={index} className="text-xs text-yellow-700">
                            • {missing.app}: {Math.round(missing.current)}% → {missing.required}%
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Expand indicator */}
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {selectedCareerPath?.id === path.id ? '▲ Click to collapse' : '▼ Click for details'}
                    </p>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedCareerPath?.id === path.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="space-y-3">
                            {/* Trending Skills */}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">
                                Trending Skills:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {path.trendingSkills.map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Market Trend */}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-1">
                                Market Trend:
                              </p>
                              <p className="text-sm text-gray-700">{path.marketTrend}</p>
                            </div>

                            {/* Supporting Modules */}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">
                                Required Learning Tracks:
                              </p>
                              <div className="space-y-1">
                                {path.prerequisites.map((prereq, index) => {
                                  const app = apps.find(a => a.id === prereq.app);
                                  const completion = getAppCompletion(prereq.app);
                                  const isMet = completion >= prereq.minProgress;

                                  return (
                                    <div key={index} className="flex items-center justify-between text-xs">
                                      <span className={isMet ? 'text-green-700' : 'text-gray-600'}>
                                        {isMet ? '✓' : '○'} {app?.name}
                                      </span>
                                      <span className={isMet ? 'text-green-600' : 'text-gray-500'}>
                                        {Math.round(completion)}% / {prereq.minProgress}%
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-gray-500 mt-8 p-4 bg-blue-50 rounded-lg">
            <p>
              💡 <strong>Note:</strong> Salary estimates and career recommendations are based on current market trends and your learning progress.
              Complete more modules to unlock better career opportunities!
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
