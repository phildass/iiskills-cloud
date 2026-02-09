"use client";

/**
 * AI-Developer Bundle Pitch Component
 * 
 * Special bundle offer:
 * - Purchase Learn AI → Unlock Learn Developer
 * - Purchase Learn Developer → Unlock Learn AI
 * - Pay for one, get both for Rs 116.82
 * 
 * "AI and Development are two sides of the same coin"
 */

export default function AIDevBundlePitch({ currentApp = "learn-ai" }) {
  const bundleInfo = {
    "learn-ai": {
      otherApp: "Learn Developer",
      otherAppUrl: "https://app4.learn-developer.iiskills.cloud",
      icon: "💻",
      pitch: "Master both AI and full-stack development. Understanding code makes you a better AI architect."
    },
    "learn-developer": {
      otherApp: "Learn AI",
      otherAppUrl: "https://app1.learn-ai.iiskills.cloud",
      icon: "🤖",
      pitch: "AI is transforming software development. Master both to stay ahead of the curve."
    }
  };

  const info = bundleInfo[currentApp];
  
  if (!info) return null;

  return (
    <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            🎁 Special Bundle: Pay for One, Get Both Free
          </h2>
          <p className="text-2xl mb-2">
            AI and Development are two sides of the same coin
          </p>
          <p className="text-xl text-purple-200">
            We ensure you master both for a single investment
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Current App */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold mb-3">
                {currentApp === "learn-ai" ? "🤖 Learn AI" : "💻 Learn Developer"}
              </h3>
              <p className="text-purple-200 mb-2">Your Current Choice</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Complete curriculum access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>All levels & assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Professional certification</span>
                </li>
              </ul>
            </div>

            {/* Bundled App */}
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl p-6 border-2 border-yellow-400/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold">
                  {info.icon} {info.otherApp}
                </h3>
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                  FREE
                </span>
              </div>
              <p className="text-yellow-200 mb-2">Unlocked Automatically</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Complete curriculum access</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>All levels & assessments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Professional certification</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 mb-6">
            <p className="text-lg mb-3">
              <strong>💡 Why This Bundle?</strong>
            </p>
            <p className="text-purple-200">
              {info.pitch}
            </p>
          </div>

          <div className="text-center">
            <div className="inline-block bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-purple-200 mb-1">One-Time Investment</p>
              <p className="text-4xl font-bold">Rs 116.82</p>
              <p className="text-sm text-purple-300 mt-1">(Incl. GST)</p>
            </div>
            <p className="text-lg">
              Unlock <strong>BOTH apps</strong> with a single payment
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-purple-300">
            Your progress syncs across both apps. Complete shared modules once, benefit twice.
          </p>
        </div>
      </div>
    </div>
  );
}
