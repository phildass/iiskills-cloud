"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Head from "next/head";

const TEN_DAY_CURRICULUM = [
  {
    phase: "Phase 1: Blueprint",
    days: [
      {
        day: 1,
        title: "The Personal Audit & Brand Identity",
        focus: "Understanding your current image and crafting your ideal professional brand",
        culturalTopics: ["Western: Authenticity & Confidence", "Indian: Respect & Humility", "Eastern: Harmony & Composure"]
      },
      {
        day: 2,
        title: "Visual Impact: Grooming Across Borders",
        focus: "Dress codes, grooming standards, and visual presentation in different cultures",
        culturalTopics: ["Western: Business Casual", "Indian: Traditional with Modern", "Eastern: Conservative & Neat"]
      },
      {
        day: 3,
        title: "Digital Real Estate: LinkedIn & Social Footprints",
        focus: "Managing your online presence and professional digital identity globally",
        culturalTopics: ["Western: Personal Branding", "Indian: Credentials Focus", "Eastern: Group Achievements"]
      }
    ]
  },
  {
    phase: "Phase 2: Engagement",
    days: [
      {
        day: 4,
        title: "The Global Greeting: Handshakes, Namastes, & Bows",
        focus: "First impressions matter: Master greetings across three cultural contexts",
        culturalTopics: ["Western: Firm Handshake", "Indian: Namaste or Soft Handshake", "Eastern: Bowing Etiquette"]
      },
      {
        day: 5,
        title: "Verbal Artistry: The Multi-Cultural Elevator Pitch",
        focus: "Crafting and delivering compelling introductions adapted to cultural norms",
        culturalTopics: ["Western: Direct & Impactful", "Indian: Rapport-Building", "Eastern: Modest & Respectful"]
      },
      {
        day: 6,
        title: "High-Context Listening: Decoding Silence & 'Maybe'",
        focus: "Understanding unspoken communication and cultural subtleties",
        culturalTopics: ["Western: Explicit Communication", "Indian: Head Shake Nuances", "Eastern: Reading Between Lines"]
      },
      {
        day: 7,
        title: "The Global Table: Dining Etiquette",
        focus: "Navigate business meals from Western fork placement to Eastern chopstick protocol",
        culturalTopics: ["Western: BMW Rule", "Indian: Right Hand Etiquette", "Eastern: Chopstick Rules"]
      }
    ]
  },
  {
    phase: "Phase 3: Accelerator",
    days: [
      {
        day: 8,
        title: "Interview Gauntlet: Regional Mastery",
        focus: "STAR-P method and adapting interview strategies for different cultural contexts",
        culturalTopics: ["Western: 'I' Language", "Indian: Team + Personal", "Eastern: 'We' Language"]
      },
      {
        day: 9,
        title: "Corporate Hierarchy: Managing Up & Digital Ethics",
        focus: "Understanding chain of command and digital communication protocols",
        culturalTopics: ["Western: First Names", "Indian: Honorifics", "Eastern: Titles & Seniority"]
      },
      {
        day: 10,
        title: "Final Synthesis: The Global Networking Simulation",
        focus: "Real-world simulation: Switch etiquette modes seamlessly at an international gala",
        culturalTopics: ["All Cultures: Social Versatility & Adaptive Excellence"]
      }
    ]
  }
];

export default function CoursesPage() {
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <>
      <Head>
        <title>10-Day Bootcamp Curriculum - Learn Finesse | iiskills.cloud</title>
        <meta name="description" content="Explore the comprehensive 10-day curriculum covering Western, Indian, and Eastern etiquette, soft skills, and professional polish." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-transparent bg-clip-text finesse-gradient mb-4">
              10-Day Finesse Bootcamp
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Your transformative journey to mastering cross-cultural etiquette, soft skills, and professional polish.
              Each day features core lessons, cultural pivots, and actionable missions.
            </p>
          </motion.div>

          {/* Curriculum Phases */}
          {TEN_DAY_CURRICULUM.map((phase, phaseIdx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b-4 border-indigo-300 pb-2">
                {phase.phase}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {phase.days.map((day) => (
                  <motion.div
                    key={day.day}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                    className="finesse-card p-6 cursor-pointer border-2 border-transparent hover:border-indigo-400"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1 rounded-full">
                        Day {day.day}
                      </span>
                      <span className="text-2xl">
                        {selectedDay === day.day ? "▼" : "▶"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {day.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {day.focus}
                    </p>

                    {selectedDay === day.day && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-700 mb-2">Cultural Pivots:</h4>
                        <ul className="space-y-2">
                          {day.culturalTopics.map((topic, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>

                        <button className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all">
                          Start Day {day.day}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center bg-white rounded-2xl shadow-2xl p-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your professional presence with our immersive 10-day bootcamp.
              No certificates—just real skills, cultural confidence, and global polish.
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-lg py-4 px-12 rounded-full hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              Start Your Bootcamp
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
