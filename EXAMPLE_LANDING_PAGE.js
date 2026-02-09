/**
 * Example Universal Landing Page with Diagnostic Funnel
 * 
 * This is a reference implementation showing how to integrate:
 * 1. Tier Selection UI
 * 2. Calibration Gatekeeper
 * 3. Payment Preview UI (for paid apps)
 * 4. AI Content Fallback
 * 
 * Copy this pattern to any app landing page for consistent UX
 */

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import TierSelection from "@/components/shared/TierSelection";
import CalibrationGatekeeper from "@/components/shared/CalibrationGatekeeper";
import PremiumAccessPrompt from "@/components/shared/PremiumAccessPrompt";
import AIContentFallback from "@/components/shared/AIContentFallback";

export default function ExampleLandingPage() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibrationPassed, setCalibrationPassed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Configuration - Customize per app
  const appConfig = {
    name: "Learn Math",
    type: "math", // math, physics, chemistry, biology, geography, aptitude, ai, developer, etc.
    isPaid: false, // Set to true for Academy apps
    showAIDevBundle: false, // Set to true for Learn AI or Learn Developer
    tagline: "Master the Language of Logic",
    description: "Build mathematical foundations from algebra to calculus with our tri-level diagnostic engine",
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
    setShowCalibration(true);
  };

  const handleCalibrationSuccess = () => {
    setCalibrationPassed(true);
    if (appConfig.isPaid) {
      setShowPayment(true);
    } else {
      // For free apps, directly show content
      setTimeout(() => {
        setShowContent(true);
      }, 1500);
    }
  };

  const handlePaymentRequired = () => {
    setShowPayment(true);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  return (
    <>
      <Head>
        <title>{appConfig.name} - {appConfig.tagline} | iiskills.cloud</title>
        <meta name="description" content={appConfig.description} />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-7xl mb-6">🎯</div>
              <h1 className="text-6xl font-bold text-gray-900 mb-4">
                {appConfig.name}
              </h1>
              <p className="text-3xl text-gray-700 mb-6">
                {appConfig.tagline}
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {appConfig.description}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Diagnostic Funnel: Step 1 - Tier Selection */}
        {!selectedTier && (
          <TierSelection onTierSelect={handleTierSelect} appName={appConfig.name} />
        )}

        {/* Diagnostic Funnel: Step 2 - Calibration Gatekeeper */}
        {selectedTier && showCalibration && !calibrationPassed && (
          <CalibrationGatekeeper
            appName={appConfig.name}
            appType={appConfig.type}
            tier={selectedTier.id}
            isPaid={appConfig.isPaid}
            onCalibrationSuccess={handleCalibrationSuccess}
            onPaymentRequired={handlePaymentRequired}
          />
        )}

        {/* Diagnostic Funnel: Step 3 - Payment Preview (Paid Apps Only) */}
        {showPayment && (
          <PremiumAccessPrompt
            appName={appConfig.name}
            appHighlight={`Unlock the complete ${selectedTier?.name} tier curriculum and achieve professional mastery in ${appConfig.name}.`}
            showAIDevBundle={appConfig.showAIDevBundle}
            onCancel={handlePaymentCancel}
          />
        )}

        {/* Diagnostic Funnel: Step 4 - Content Access */}
        {showContent && (
          <AIContentFallback
            appName={appConfig.name}
            appType={appConfig.type}
            contentType="module"
          />
        )}

        {/* Features Section - Always Visible */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Why {appConfig.name}?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Diagnostic-First
                </h3>
                <p className="text-gray-600">
                  Know exactly where you stand before you start learning
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tri-Level System
                </h3>
                <p className="text-gray-600">
                  Basic → Intermediate → Advanced progression tailored to you
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No 404 Errors
                </h3>
                <p className="text-gray-600">
                  Every button leads to real content - guaranteed
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!selectedTier && (
          <section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-xl mb-8">
                Select your tier above to start the diagnostic calibration
              </p>
              <button
                onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
                className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-xl"
              >
                Choose Your Tier ↑
              </button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
