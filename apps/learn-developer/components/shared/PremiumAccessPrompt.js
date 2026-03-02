"use client";

import { getEffectivePricingBreakdown, formatINR } from "@iiskills/ui/pricing";

/**
 * Premium Access Prompt Component
 *
 * Post-sample conversion flow for paid apps
 * Shows pricing breakdown with GST and redirects to aienter.in/payments
 *
 * Pricing is derived from the canonical @iiskills/ui/pricing module.
 */

export default function PremiumAccessPrompt({ 
  appName = "this course",
  appHighlight = "Master the complete curriculum and unlock your potential.",
  appId = "",
  onCancel 
}) {
  const pricing = getEffectivePricingBreakdown();
  const handleUnlock = () => {
    const params = new URLSearchParams({
      ...(appId && { course: appId }),
      returnTo: "https://iiskills.cloud/otp-gateway",
    });
    window.location.href = `https://aienter.in/payments/iiskills?${params.toString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl">
        {/* Hook Message */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            🎯 You've Mastered the Basics
          </h2>
          <p className="text-xl text-gray-700">
            Ready to reach the Apex?
          </p>
        </div>

        {/* App-Specific Highlight */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl mb-6">
          <p className="text-gray-800 font-medium text-center">
            {appHighlight}
          </p>
        </div>

        {/* Pricing Breakdown - Transparency Phase */}
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Pricing Breakdown</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-gray-700">
              <span>Base Price:</span>
              <span className="font-semibold">{formatINR(pricing.base)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>Tax (GST {(pricing.gstRate * 100).toFixed(0)}%):</span>
              <span>{formatINR(pricing.gst)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2"></div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total Payable:</span>
              <span className="text-green-600">{formatINR(pricing.total)}</span>
            </div>
          </div>
          
          {/* Scarcity Tactic */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <p className="text-sm text-yellow-800 font-medium">
              ⚡ {pricing.messages[0]}
            </p>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">Full Course Access Includes:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Complete Tri-Level Curriculum (Basic → Intermediate → Advanced)</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All lessons, tests, and assessments</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Professional certification upon completion</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lifetime access to all course materials</span>
            </li>
          </ul>
        </div>

        {/* Commitment Question */}
        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-gray-800">
            Are you ready to invest in your professional mastery?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={onCancel} 
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
          >
            Not Yet
          </button>
          <button 
            onClick={handleUnlock} 
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Yes, Unlock Full Course →
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Secure payment powered by aienter.in • 100% money-back guarantee
        </p>
      </div>
    </div>
  );
}

