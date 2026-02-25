"use client";

import { getPricingDisplay, getBundleOfferNotice, isBundleOfferActive } from '../pricing/pricing';

/**
 * EnrollmentLandingPage Component
 *
 * Shown after sample test completion for paid apps.
 * Contains course details, fee structure (from centralized pricing), and CTA to Razorpay.
 *
 * Bundle: Learn AI + Learn Developer — Buy one, get one free (till 31 Mar 2026).
 */

const CHECK_ICON = (
  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default function EnrollmentLandingPage({
  appId = "learn-ai",
  appName = "this course",
  appHighlight = "Master the complete curriculum and unlock your potential.",
  syllabus = [],
  showAIDevBundle = false,
  onClose,
}) {
  const pricing = getPricingDisplay();
  const bundleActive = showAIDevBundle && isBundleOfferActive();
  const bundleNotice = bundleActive ? getBundleOfferNotice() : null;
  const partnerApp = appName.toLowerCase().includes("ai") ? "Learn Developer" : "Learn AI";

  const handleEnrol = () => {
    window.open("https://aienter.in/payments/iiskills", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-700 rounded-t-2xl px-8 py-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-purple-200 mb-1">
                🎓 Enrol Now
              </div>
              <h2 className="text-2xl font-bold">{appName}</h2>
              <p className="text-purple-200 mt-1">{appHighlight}</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/70 hover:text-white transition text-2xl leading-none" aria-label="Close">
                ×
              </button>
            )}
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">

          {/* Bundle Banner — vivid, eye-catching */}
          {bundleActive && bundleNotice && (
            <div className="bg-gradient-to-r from-yellow-400 to-amber-400 border-4 border-yellow-600 rounded-xl p-5 shadow-lg text-center">
              <div className="text-3xl font-extrabold text-yellow-900 mb-1 animate-pulse">
                🎁 BUY ONE, GET ONE FREE!
              </div>
              <p className="text-yellow-950 font-bold text-lg">
                Enrol in <strong>{appName}</strong> and unlock <strong>{partnerApp}</strong> at no extra cost!
              </p>
              <p className="text-yellow-900 text-sm font-semibold mt-1">
                ⏰ Exclusive offer — valid until <strong>31 March 2026 only</strong>. Don't miss out!
              </p>
            </div>
          )}

          {/* Syllabus */}
          {syllabus.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 Course Syllabus</h3>
              <ul className="space-y-2">
                {syllabus.map((item, i) => (
                  <li key={i} className="flex items-start text-gray-700">
                    {CHECK_ICON}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Validity */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-green-900">Validity: 1 Year</p>
              <p className="text-sm text-green-800">Full access to all lessons, tests, and updates for 12 months from enrollment date.</p>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Fee Structure</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Course Fee:</span>
                <span className="font-semibold">{pricing.basePrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>GST ({pricing.gstRate}):</span>
                <span>{pricing.gstAmount}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Payable:</span>
                  <span className="text-green-600">{pricing.totalPrice}</span>
                </div>
              </div>
              {bundleActive && (
                <p className="text-sm text-purple-700 font-semibold mt-2 text-center">
                  ✓ AI-Dev bundle: 2 courses for the price of 1 (till 31 Mar 2026)
                </p>
              )}
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-sm text-blue-800 font-medium">
                🔒 Payment to <strong>AI Cloud Enterprises</strong> through secure Razorpay gateway
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ What's Included</h3>
            <ul className="space-y-2 text-gray-700">
              {[
                "Complete Tri-Level Curriculum (Basic → Intermediate → Advanced)",
                "All lessons, quizzes, and module tests",
                "Professional certification upon completion",
                "1-year access to all course materials and updates",
                bundleActive ? `Bonus: ${partnerApp} included FREE (till 31 Mar 2026)` : null,
              ].filter(Boolean).map((item, i) => (
                <li key={i} className="flex items-start">
                  {CHECK_ICON}
                  <span className={i === 4 ? "font-semibold text-purple-700" : ""}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <button
              onClick={handleEnrol}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🎓 Enrol for {appName} — Pay Securely
            </button>
            {bundleActive && (
              <p className="text-center text-sm text-purple-600 font-semibold mt-2">
                + Get {partnerApp} FREE with this enrolment!
              </p>
            )}
            <p className="text-center text-xs text-gray-500 mt-3">
              Secure payment via Razorpay • AI Cloud Enterprises • 100% money-back guarantee
            </p>
          </div>

          {/* Submit Payment Reference */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">📝 After Payment:</p>
            <p>Once you have paid on the Razorpay portal, please contact our admin with your Razorpay Payment ID to activate your account access. Your enrolment will be activated within 24 hours.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
