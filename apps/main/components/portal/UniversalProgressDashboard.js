import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { useUserProgress } from "../../contexts/UserProgressContext";

// Dynamic taglines based on top app
const APP_TAGLINES = {
  "learn-ai": "Welcome back, Architect of Intelligence",
  "learn-physics": "Ready to solve the universe's mysteries?",
  "learn-pr": "Welcome back, Architect of Reputation",
  "learn-math": "Welcome back, Master of Numbers",
  "learn-management": "Welcome back, Leader in the Making",
  "learn-apt": "Welcome back, Logical Thinker",
  "learn-chemistry": "Welcome back, Element Explorer",
  "learn-geography": "Welcome back, World Navigator",
  "learn-developer": "Welcome back, Code Creator",
  // MOVED TO apps-backup as per cleanup requirements
  // "learn-govt-jobs": "Welcome back, Future Civil Servant",
};

export default function UniversalProgressDashboard() {
  const { apps, totalProgress, topApp } = useUserProgress();
  const [radarData, setRadarData] = useState([]);
  const [currentTagline, setCurrentTagline] = useState("");

  useEffect(() => {
    // Prepare radar chart data
    const data = apps.map((app) => ({
      subject: app.name.replace("Learn ", ""),
      score: ((app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3).toFixed(0),
      fullMark: 100,
    }));
    setRadarData(data);
  }, [apps]);

  useEffect(() => {
    if (topApp) {
      setCurrentTagline(APP_TAGLINES[topApp.id] || "Welcome back, Learner!");
    }
  }, [topApp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-6 border-2 border-primary"
    >
      <div className="text-center mb-6">
        <motion.h2
          key={currentTagline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-primary mb-2"
        >
          {currentTagline}
        </motion.h2>
        <p className="text-lg text-charcoal">
          Total Human Capital: <span className="font-bold text-accent">{totalProgress.toFixed(1)}%</span>
        </p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#C77DDB" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#24272a", fontSize: 12 }}
              style={{ fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#0052CC" }} />
            <Radar 
              name="Progress" 
              dataKey="score" 
              stroke="#0052CC" 
              fill="#C77DDB" 
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "white",
                border: "2px solid #0052CC",
                borderRadius: "8px",
                padding: "8px",
              }}
              formatter={(value) => [`${value}%`, "Progress"]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 italic">
          Your progress across all learning apps visualized in one place
        </p>
      </div>
    </motion.div>
  );
}
