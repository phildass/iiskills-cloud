"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    goals: [],
    background: "",
    pace: "",
  });

  const goals = [
    { id: "school", label: "🎓 Prepare for School/College Exams", value: "school" },
    { id: "career", label: "🔬 Career in Life Sciences", value: "career" },
    { id: "medical", label: "🏥 Medical/Healthcare Path", value: "medical" },
    { id: "curiosity", label: "🧬 Pure Curiosity & Knowledge", value: "curiosity" },
  ];

  const backgrounds = [
    { id: "beginner", label: "🌱 Beginner - New to Biology", value: "beginner" },
    { id: "intermediate", label: "🌿 Intermediate - Some Knowledge", value: "intermediate" },
    { id: "advanced", label: "🌳 Advanced - Strong Foundation", value: "advanced" },
  ];

  const paces = [
    { id: "relaxed", label: "🐢 Relaxed - Learn at my own pace", value: "relaxed" },
    { id: "moderate", label: "🏃 Moderate - Steady progress", value: "moderate" },
    { id: "intensive", label: "🚀 Intensive - Fast-track learning", value: "intensive" },
  ];

  const toggleGoal = (goal) => {
    setUserData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleComplete = () => {
    // Store preferences
    localStorage.setItem("biology-onboarding", JSON.stringify(userData));
    // Redirect to curriculum
    router.push("/curriculum");
  };

  return (
    <>
      <Head>
        <title>Welcome to Learn Biology - Get Started | iiskills</title>
        <meta
          name="description"
          content="Personalize your biology learning journey with Learn Biology"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              🧬 Welcome to Learn Biology!
            </h1>
            <p className="text-xl text-green-100">
              Let's personalize your learning journey
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s <= step ? "bg-white" : "bg-green-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Step 1: Goals */}
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  What are your learning goals?
                </h2>
                <p className="text-gray-600 mb-6">Select all that apply</p>
                <div className="space-y-3">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        userData.goals.includes(goal.value)
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-lg font-semibold">
                        {goal.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Background */}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  What's your biology background?
                </h2>
                <p className="text-gray-600 mb-6">Help us customize your experience</p>
                <div className="space-y-3">
                  {backgrounds.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() =>
                        setUserData((prev) => ({ ...prev, background: bg.value }))
                      }
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        userData.background === bg.value
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-lg font-semibold">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Pace */}
            {step === 3 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Choose your learning pace
                </h2>
                <p className="text-gray-600 mb-6">You can always adjust this later</p>
                <div className="space-y-3">
                  {paces.map((pace) => (
                    <button
                      key={pace.id}
                      onClick={() =>
                        setUserData((prev) => ({ ...prev, pace: pace.value }))
                      }
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        userData.pace === pace.value
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <span className="text-lg font-semibold">{pace.label}</span>
                    </button>
                  ))}
                </div>

                {/* Welcome Message */}
                {userData.pace && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
                    <h3 className="text-2xl font-bold mb-2">
                      🎉 You're All Set!
                    </h3>
                    <p className="mb-4">
                      Welcome to the iiskills Foundation Suite! Learn Biology is
                      completely free, forever. Start with Module 1 to master
                      cellular structures, then progress through our Tri-Level
                      system.
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li>✅ Free sample lesson (Module 1, Lesson 1)</li>
                      <li>✅ Gatekeeper tests to track mastery</li>
                      <li>✅ XP & Badges across all 12 iiskills apps</li>
                      <li>✅ Cross-app connections to Chemistry & AI</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  ← Back
                </button>
              ) : (
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  ← Home
                </Link>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && userData.goals.length === 0) ||
                    (step === 2 && !userData.background)
                  }
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    (step === 1 && userData.goals.length === 0) ||
                    (step === 2 && !userData.background)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!userData.pace}
                  className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
                    !userData.pace
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Start Learning 🚀
                </button>
              )}
            </div>
          </div>

          {/* Foundation Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-lg shadow-lg">
              <span className="text-2xl mr-3">🟢</span>
              <span className="font-bold text-green-800">
                Free Forever | iiskills Foundation Suite
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
