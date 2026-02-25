import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Mock cross-pollination data
const BRIDGE_DATA = [
  {
    id: 1,
    from: "Learn Physics",
    to: "Learn Management",
    fromModule: "Entropy",
    toModule: "Organizational Decay",
    description: "Today's Learn-Physics lesson on Entropy helps explain Learn-Management's module on Organizational Decay.",
    stats: "4,000 users",
  },
  {
    id: 2,
    from: "Learn Math",
    to: "Learn AI",
    fromModule: "Statistics",
    toModule: "Machine Learning",
    description: "Understanding statistical foundations in Learn-Math makes Learn-AI's Machine Learning concepts crystal clear.",
    stats: "6,200 users",
  },
  {
    id: 3,
    from: "Learn Geography",
    to: "Learn Govt Jobs",
    fromModule: "Indian States",
    toModule: "State Service Exams",
    description: "Learn-Geography's coverage of Indian states directly supports Learn-Govt-Jobs state service exam preparation.",
    stats: "3,500 users",
  },
  {
    id: 4,
    from: "Learn PR",
    to: "Learn Management",
    fromModule: "Media Relations",
    toModule: "Stakeholder Communication",
    description: "Learn-PR's media strategies enhance Learn-Management's stakeholder communication module.",
    stats: "2,800 users",
  },
];

export default function CrossPollinationFeed() {
  const [bridges, setBridges] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setBridges(BRIDGE_DATA);
  }, []);

  useEffect(() => {
    // Rotate through bridges every 10 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bridges.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [bridges.length]);

  const totalUsers = bridges.reduce((sum, bridge) => {
    const num = parseInt(bridge.stats.replace(/[^0-9]/g, ""));
    return sum + num;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">Daily Sync Feed</h2>
        <span className="text-sm text-accent font-semibold bg-white px-3 py-1 rounded-full">
          🔄 Live
        </span>
      </div>

      <p className="text-sm text-charcoal mb-6">
        Discover how learning one app enhances understanding in another
      </p>

      <div className="space-y-4 mb-6">
        {bridges.map((bridge, index) => (
          <motion.div
            key={bridge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0.5,
              y: 0,
              scale: index === currentIndex ? 1 : 0.95
            }}
            transition={{ duration: 0.5 }}
            className={`bg-white rounded-lg p-4 shadow-md border-2 ${
              index === currentIndex ? "border-accent" : "border-transparent"
            } transition-all`}
          >
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">🔗</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-1">
                  <span>{bridge.from}</span>
                  <span className="text-accent">→</span>
                  <span>{bridge.to}</span>
                </div>
                <p className="text-charcoal text-sm leading-relaxed">{bridge.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-600">{bridge.stats} are bridging</span>
              <button className="text-xs text-accent hover:text-purple-700 font-semibold transition-colors">
                Explore the Bridge →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Global Stats */}
      <div className="bg-white rounded-lg p-4 border-2 border-accent">
        <div className="text-center">
          <p className="text-sm text-charcoal mb-1">Total Active Connections</p>
          <p className="text-3xl font-bold text-accent">{totalUsers.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">
            learners are making cross-app connections today
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {bridges.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-accent w-8" : "bg-gray-300"
            }`}
            aria-label={`View bridge ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
