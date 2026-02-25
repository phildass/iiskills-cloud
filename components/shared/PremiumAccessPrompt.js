"use client";

import { getEffectivePricingBreakdown, formatINR } from "@iiskills/ui/pricing";

/**
 * Premium Access Prompt Component
 *
 * Internal Payment Preview UI for paid apps
 * Shows after successful calibration qualifier
 *
 * Pricing is derived from the canonical @iiskills/ui/pricing module.
 */

export default function PremiumAccessPrompt({ 
  appName = "this course",
  appHighlight = "Master the complete curriculum and unlock your potential.",
  showAIDevBundle = false, // Set to true for Learn AI or Learn Developer apps
  onCancel 
}) {
  const pricing = getEffectivePricingBreakdown();
  const handleUnlock = () => {
    // Redirect to unified payment hub
    window.location.href = "https://aienter.in/payments";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl">
        {/* Premium Calibration Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full mb-3">
            <span className="text-purple-700 font-bold text-sm">iiskills Premium Calibration</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-gray-900">
            🎉 Qualification Successful!
          </h2>
          <p className="text-xl text-gray-700">
            You have successfully qualified for the <strong>{appName}</strong> Professional Track
          </p>
        </div>

        {/* App-Specific Highlight */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl mb-6">
          <p className="text-gray-800 font-medium text-center">
            {appHighlight}
          </p>
        </div>

        {/* AI-Dev Bundle Special Offer */}
        {showAIDevBundle && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 p-5 rounded-xl mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-800 mb-2">
                🎁 Special AI-Dev Bundle
              </div>
              <p className="text-yellow-900 font-semibold mb-2">
                Pay for one, get BOTH courses!
              </p>
              <p className="text-sm text-yellow-800">
                Purchase {appName} and get{" "}
                {appName.includes("AI") ? "Learn Developer" : "Learn AI"} included at no extra
                cost
              </p>
            </div>
          </div>
        )}

        {/* Fee Structure */}
        <div className="bg-gray-50 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Fee Structure</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-gray-700">
              <span>Professional Access:</span>
              <span className="font-semibold">{formatINR(pricing.base)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 text-sm">
              <span>GST ({(pricing.gstRate * 100).toFixed(0)}%):</span>
              <span>{formatINR(pricing.gst)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2"></div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span className="text-green-600">{formatINR(pricing.total)}</span>
            </div>
            {showAIDevBundle && (
              <div className="text-center pt-2">
                <span className="text-sm text-purple-600 font-semibold">
                  ✓ Includes AI-Dev bundle (2 courses for price of 1)
                </span>
              </div>
            )}
          </div>
          
          {/* Price Validity Notice */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
            <p className="text-sm text-yellow-800 font-medium">
              ⚡ {pricing.messages[0]}
            </p>
          </div>
        </div>

        {/* What You'll Get */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">What's Included:</h3>
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
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {onCancel && (
            <button 
              onClick={onCancel} 
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
            >
              Not Yet
            </button>
          )}
          <button 
            onClick={handleUnlock} 
            className={`${onCancel ? 'flex-1' : 'w-full'} px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl`}
          >
            I am satisfied, I will pay for the course
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
