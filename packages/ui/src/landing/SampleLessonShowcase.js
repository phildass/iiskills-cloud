"use client";

/**
 * Sample Lesson Showcase Component
 * 
 * Universal access module structure for paid apps:
 * - Overview: High-impact highlights
 * - Sample Lesson: Choose Basic or Intermediate level (no test tab)
 * 
 * Zero-Barrier Sample for every paid app
 */

import { useState } from "react";
import Link from "next/link";

/**
 * Helper function to get sample lesson URL based on app structure
 */
function getSampleLessonUrl(appId, moduleId, lessonId) {
  if (appId === "learn-finesse") {
    return "/lessons/day4"; // Learn Finesse uses day-based structure
  }
  return `/modules/${moduleId}/lesson/${lessonId}`; // Standard module-based structure
}

export default function SampleLessonShowcase({ 
  appId,
  appName,
  appHighlight,
  sampleModuleId = 1,
  sampleLessonId = 1
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sampleLevel, setSampleLevel] = useState(null);

  // App-specific highlights as per requirements
  const appHighlights = {
    "learn-finesse": {
      title: "Master Social Intelligence & Executive Presence",
      description: "Master social intelligence, executive presence, and the logic of power dynamics.",
      keyPoints: [
        "Executive presence in high-stakes business environments",
        "Cultural intelligence across Western, Indian, and Eastern contexts",
        "Power dynamics and influence strategies",
        "Advanced communication and negotiation techniques",
        "Professional etiquette and social positioning"
      ],
      triLevelPreview: {
        level1: "Building Intuition: Foundation of social intelligence and professional presence",
        level2: "The Systems: Strategic frameworks for executive communication",
        level3: "The Architect: Mastering power dynamics and influence at scale"
      }
    },
    "learn-ai": {
      title: "Move from AI User to AI Architect",
      description: "Move from user to architect; understand neural logic and AI business models.",
      keyPoints: [
        "Neural networks and machine learning fundamentals",
        "Prompt engineering and AI tool mastery",
        "AI business models and monetization strategies",
        "Building AI-powered products and services",
        "Ethical AI and responsible deployment"
      ],
      triLevelPreview: {
        level1: "Building Intuition: Prompts, models, and AI basics",
        level2: "The Systems: ML algorithms and neural architectures",
        level3: "The Architect: AI monetization and product development"
      }
    },
    "learn-developer": {
      title: "Standardize Your Coding Logic",
      description: "Standardize your coding logic and master full-stack system architecture.",
      keyPoints: [
        "Full-stack development from frontend to backend",
        "System architecture and design patterns",
        "Database design and API development",
        "DevOps and deployment strategies",
        "Code quality and professional standards"
      ],
      triLevelPreview: {
        level1: "Building Intuition: HTML, CSS, JavaScript fundamentals",
        level2: "The Systems: Frameworks, APIs, and databases",
        level3: "The Architect: System design and scalable architecture"
      }
    },
    "learn-pr": {
      title: "Master the Science of Public Perception",
      description: "Master the science of public perception and brand influence.",
      keyPoints: [
        "Public relations strategy and media management",
        "Crisis communication and reputation management",
        "Brand positioning and messaging frameworks",
        "Digital PR and social media influence",
        "Stakeholder engagement and relationship building"
      ],
      triLevelPreview: {
        level1: "Building Intuition: PR fundamentals and media landscape",
        level2: "The Systems: Campaign management and crisis response",
        level3: "The Architect: Brand influence and perception engineering"
      }
    },
    "learn-management": {
      title: "Standardize Your Leadership Systems",
      description: "Standardize your leadership systems and optimize team efficiency.",
      keyPoints: [
        "Strategic business management and planning",
        "Team leadership and organizational behavior",
        "Operations management and process optimization",
        "Financial management and resource allocation",
        "Change management and innovation leadership"
      ],
      triLevelPreview: {
        level1: "Building Intuition: Management fundamentals and team basics",
        level2: "The Systems: Strategic frameworks and operational excellence",
        level3: "The Architect: Organizational design and transformational leadership"
      }
    }
  };

  const highlight = appHighlights[appId] || {
    title: appName,
    description: appHighlight || "Master professional skills with the iiskills Tri-Level approach.",
    keyPoints: [],
    triLevelPreview: {
      level1: "Building Intuition: Foundation concepts",
      level2: "The Systems: Strategic frameworks",
      level3: "The Architect: Advanced mastery"
    }
  };

  // Intermediate lesson is module 2
  const intermediateLessonUrl = getSampleLessonUrl(appId, 2, 1);
  const basicLessonUrl = getSampleLessonUrl(appId, sampleModuleId, sampleLessonId);

  return (
    <div className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Try Before You Enroll
          </h2>
          <p className="text-xl text-gray-600">
            Experience our Tri-Level learning system with a complete sample lesson
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "overview"
                ? "border-b-4 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setActiveTab("sample")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "sample"
                ? "border-b-4 border-purple-600 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📚 Sample Lesson
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 rounded-2xl p-8 min-h-[400px]">
          {activeTab === "overview" && (
            <div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">{highlight.title}</h3>
              <p className="text-xl text-gray-700 mb-6 italic">{highlight.description}</p>
              
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Why This Skill Is a Career Multiplier</h4>
                <ul className="space-y-3">
                  {highlight.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                <h4 className="text-xl font-semibold mb-4 text-gray-900">🎯 The Tri-Level Logic</h4>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">Level 1</span>
                    <p className="text-gray-700">{highlight.triLevelPreview.level1}</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">Level 2</span>
                    <p className="text-gray-700">{highlight.triLevelPreview.level2}</p>
                  </div>
                  <div className="flex items-start">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold mr-3">Level 3</span>
                    <p className="text-gray-700">{highlight.triLevelPreview.level3}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "sample" && (
            <div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Sample Lesson: Choose Your Level</h3>
              <p className="text-lg text-gray-700 mb-6">
                Choose a sample lesson to experience our teaching style. Both are <strong>100% free</strong>—no login required!
              </p>

              {!sampleLevel ? (
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <button
                    onClick={() => setSampleLevel("basic")}
                    className="flex-1 bg-white rounded-xl p-6 border-2 border-green-300 hover:border-green-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="text-3xl mb-2">🟢</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Basic</h4>
                    <p className="text-gray-600 text-sm">Foundations and core concepts — perfect for beginners</p>
                    <span className="inline-block mt-3 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Choose Basic →</span>
                  </button>
                  <button
                    onClick={() => setSampleLevel("intermediate")}
                    className="flex-1 bg-white rounded-xl p-6 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all text-left"
                  >
                    <div className="text-3xl mb-2">🔵</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Intermediate</h4>
                    <p className="text-gray-600 text-sm">Apply concepts to real-world scenarios and complex patterns</p>
                    <span className="inline-block mt-3 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">Choose Intermediate →</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-white rounded-xl p-6 mb-6 border-2 border-blue-200">
                    <p className="text-gray-700 mb-2">
                      🎓 You selected: <strong>{sampleLevel === "basic" ? "Basic" : "Intermediate"}</strong> sample lesson.
                    </p>
                    <p className="text-gray-700">
                      This lesson is <strong>100% free</strong> and accessible to everyone—no login required!
                    </p>
                  </div>

                  <div className="flex gap-4 flex-wrap">
                    <Link
                      href={sampleLevel === "basic" ? basicLessonUrl : intermediateLessonUrl}
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Start {sampleLevel === "basic" ? "Basic" : "Intermediate"} Sample Lesson →
                    </Link>
                    <button
                      onClick={() => setSampleLevel(null)}
                      className="inline-block bg-gray-200 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                      ← Change Level
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


