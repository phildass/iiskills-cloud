/**
 * Tier Selection UI Component
 * 
 * Universal landing page component for selecting learning tier
 * Features 3-tier progression: Basic → Intermediate → Advanced
 * 
 * Usage:
 * <TierSelection onTierSelect={(tier) => console.log(tier)} />
 */

import { motion } from "framer-motion";
import { useState } from "react";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    emoji: "🟢",
    title: "The Logic Foundations",
    description: "Fast entry - Build your fundamental understanding",
    features: [
      "Core concepts and principles",
      "Step-by-step guided learning",
      "Foundational problem-solving",
      "Perfect for beginners",
    ],
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    emoji: "🔵",
    title: "System Dynamics",
    description: "Apply concepts to real-world scenarios",
    features: [
      "Complex problem patterns",
      "Multi-step reasoning",
      "Application-based learning",
      "Industry-aligned challenges",
    ],
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "advanced",
    name: "Advanced",
    emoji: "🟣",
    title: "Apex Mastery",
    description: "Master-level expertise and optimization",
    features: [
      "Expert-level challenges",
      "Strategic optimization",
      "Research-grade depth",
      "Professional certification path",
    ],
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export default function TierSelection({ onTierSelect, appName = "this course" }) {
  const [selectedTier, setSelectedTier] = useState(null);

  const handleSelect = (tier) => {
    setSelectedTier(tier);
    if (onTierSelect) {
      onTierSelect(tier);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            This course is engineered in 3 Tiers
          </h2>
          <p className="text-2xl text-gray-700 mb-2">
            Where do you belong?
          </p>
          <p className="text-lg text-gray-600">
            Select your starting point to begin your diagnostic calibration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleSelect(tier)}
              className={`cursor-pointer rounded-2xl p-6 border-4 transition-all ${
                selectedTier?.id === tier.id
                  ? `${tier.borderColor} shadow-2xl`
                  : "border-gray-200 hover:border-gray-300 shadow-lg"
              } ${tier.bgColor} backdrop-blur-sm`}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{tier.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {tier.name}
                </h3>
                <p className="text-xl font-semibold bg-gradient-to-r {tier.color} bg-clip-text text-transparent mb-2">
                  {tier.title}
                </p>
                <p className="text-gray-700">{tier.description}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition ${
                  selectedTier?.id === tier.id
                    ? `bg-gradient-to-r ${tier.color} shadow-lg`
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                {selectedTier?.id === tier.id ? "Selected ✓" : "Select This Tier"}
              </button>
            </motion.div>
          ))}
        </div>

        {selectedTier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                🎯 You selected: <span className="text-blue-600">{selectedTier.name} Tier</span>
              </p>
              <p className="text-gray-700">
                Next: Complete the calibration gatekeeper to confirm your level
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
