import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProgress } from "../../contexts/UserProgressContext";

/**
 * Map app IDs to their subdomain numbers
 * Format: app{number}.{app-name}.iiskills.cloud
 */
const APP_SUBDOMAIN_MAP = {
  "learn-ai": 1,
  "learn-management": 2,
  "learn-pr": 3,
  "learn-developer": 4,
  "learn-apt": 5,
  "learn-physics": 6,
  "learn-chemistry": 7,
  "learn-math": 8,
  "learn-geography": 9,
  "learn-govt-jobs": 10,
  "learn-finesse": 11,
};

/**
 * Get the full subdomain URL for an app
 * @param {string} appId - The app identifier
 * @returns {string} The full subdomain URL
 */
function getAppUrl(appId) {
  const appNumber = APP_SUBDOMAIN_MAP[appId];
  if (!appNumber) return `/${appId}`; // Fallback to local path
  return `https://app${appNumber}.${appId}.iiskills.cloud`;
}

export default function BentoBoxGrid() {
  const { apps } = useUserProgress();
  const [hoveredApp, setHoveredApp] = useState(null);
  const [quizState, setQuizState] = useState({});
  const [selectedPath, setSelectedPath] = useState(null);

  const PATHS = {
    technical: {
      name: "The Technical Executive",
      apps: ["learn-ai", "learn-developer", "learn-math"],
    },
    leader: {
      name: "The Leader",
      apps: ["learn-management", "learn-pr"],
    },
    scientist: {
      name: "The Scientist",
      apps: ["learn-physics", "learn-chemistry", "learn-math"],
    },
  };

  const handleQuizAnswer = (appId, selectedOption) => {
    const app = apps.find((a) => a.id === appId);
    const isCorrect = selectedOption === app.microQuiz.correctAnswer;
    setQuizState({
      ...quizState,
      [appId]: { answered: true, correct: isCorrect },
    });
  };

  const getProgressColor = (app) => {
    const avgProgress =
      (app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3;
    if (avgProgress >= 30) return "border-yellow-400 shadow-yellow-200";
    if (avgProgress >= 20) return "border-blue-400";
    return "border-gray-300";
  };

  const shouldHighlight = (appId) => {
    if (!selectedPath) return true;
    return PATHS[selectedPath].apps.includes(appId);
  };

  return (
    <div className="space-y-6">
      {/* Path Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSelectedPath(null)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedPath === null
              ? "bg-primary text-white shadow-lg"
              : "bg-gray-200 text-charcoal hover:bg-gray-300"
          }`}
        >
          All Apps
        </button>
        {Object.entries(PATHS).map(([key, path]) => (
          <button
            key={key}
            onClick={() => setSelectedPath(key)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedPath === key
                ? "bg-accent text-white shadow-lg"
                : "bg-gray-200 text-charcoal hover:bg-gray-300"
            }`}
          >
            {path.name}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {apps.map((app, index) => {
          const avgProgress =
            (app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3;
          const isHighlighted = shouldHighlight(app.id);
          const hasAdvancedGate = app.progress.advanced >= 30;

          return (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHighlighted ? 1 : 0.4,
                scale: isHighlighted ? 1 : 0.95,
              }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onHoverStart={() => setHoveredApp(app.id)}
              onHoverEnd={() => setHoveredApp(null)}
              className={`relative bg-white rounded-lg shadow-lg p-6 border-4 ${getProgressColor(
                app
              )} transition-all cursor-pointer hover:shadow-xl ${
                hasAdvancedGate
                  ? "ring-4 ring-yellow-300 bg-gradient-to-br from-yellow-50 to-white"
                  : ""
              } ${avgProgress > 20 && avgProgress < 30 ? "animate-pulse" : ""}`}
              style={{
                opacity: isHighlighted ? 1 : 0.5,
              }}
            >
              {/* Icon/Title */}
              <div className="text-center mb-4">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: app.color + "20", color: app.color }}
                >
                  {app.name.charAt(6)}
                </div>
                <h3 className="font-bold text-lg text-charcoal">{app.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{app.category}</p>
              </div>

              {/* Progress Ring */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Basics</span>
                  <span className="text-xs font-bold" style={{ color: app.color }}>
                    {app.progress.basics}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${app.progress.basics}%`, backgroundColor: app.color }}
                  />
                </div>
              </div>

              {/* Hover: Micro Quiz */}
              <AnimatePresence>
                {hoveredApp === app.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm font-semibold text-charcoal mb-3">
                      {app.microQuiz.question}
                    </p>
                    <div className="space-y-2">
                      {app.microQuiz.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuizAnswer(app.id, idx)}
                          className={`w-full text-left text-xs px-3 py-2 rounded transition-colors ${
                            quizState[app.id]?.answered
                              ? idx === app.microQuiz.correctAnswer
                                ? "bg-green-500 text-white"
                                : quizState[app.id]?.correct === false &&
                                    idx === quizState[app.id]?.selected
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-200 text-charcoal"
                              : "bg-white border border-gray-300 hover:bg-gray-100"
                          }`}
                          disabled={quizState[app.id]?.answered}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {quizState[app.id]?.answered && (
                      <p className="text-xs mt-2 text-center font-semibold">
                        {quizState[app.id]?.correct ? "✅ Correct!" : "❌ Try again in the course!"}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Start CTA */}
              <a
                href={getAppUrl(app.id)}
                className="block text-center mt-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                style={{
                  backgroundColor: app.color,
                  color: "white",
                }}
              >
                {avgProgress > 0 ? "Continue" : "Quick Start"} →
              </a>

              {/* Advanced Gate Badge */}
              {hasAdvancedGate && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  🏆 Gold
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
