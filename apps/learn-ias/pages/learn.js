import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCurrentUser, getUserProfile } from "../lib/supabaseClient";
import { getAllPhases } from "../lib/iasSyllabus";
import Footer from "../components/Footer";

export default function Learn() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState("foundation");

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        // Redirect to login if not authenticated
        router.push("/login");
        return;
      }

      setUser(currentUser);
      setProfile(getUserProfile(currentUser));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const phases = getAllPhases();
  const currentPhase = phases.find((p) => p.id === selectedPhase) || phases[0];

  // Check if paywall is enabled via environment variable
  const paywallEnabled = process.env.NEXT_PUBLIC_PAYWALL_ENABLED !== "false";

  // Check if user has purchased the course
  const hasPurchased = !paywallEnabled || profile?.hasPurchasedIAS || false;

  return (
    <>
      <Head>
        <title>Dashboard - Learn IAS</title>
      </Head>

      <main className="min-h-screen bg-neutral py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Welcome, {profile?.firstName || profile?.email}!
            </h1>
            <p className="text-gray-600">Continue your UPSC Civil Services preparation journey</p>
          </div>

          {/* Payment Status */}
          {!hasPurchased && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">Subscription Required</h3>
                  <p className="mt-2 text-sm text-yellow-700">
                    Subscribe to unlock full access to all IAS preparation materials, AI features,
                    and mock tests.
                  </p>
                  <p className="mt-2 text-sm font-semibold text-yellow-800">
                    Annual Subscription: ₹116.82/year (₹99 + GST ₹17.82)
                  </p>
                  <div className="mt-4">
                    <a
                      href="https://www.aienter.in/payments"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:opacity-90 transition"
                    >
                      Subscribe Now
                    </a>
                  </div>
                  <p className="mt-3 text-xs text-yellow-600">
                    PLACEHOLDER: Payment integration with subscription management and expiry
                    tracking will be implemented.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Phase Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Learning Phases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {phases.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setSelectedPhase(phase.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedPhase === phase.id
                      ? "border-primary bg-primary bg-opacity-10"
                      : "border-gray-200 hover:border-primary"
                  }`}
                >
                  <h3 className="font-bold text-charcoal mb-1">{phase.name}</h3>
                  <p className="text-sm text-gray-600">{phase.duration || "Ongoing"}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Current Phase Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-2">{currentPhase.name}</h2>
            <p className="text-gray-600 mb-6">{currentPhase.description}</p>

            {/* Modules */}
            {currentPhase.modules && (
              <div>
                <h3 className="text-xl font-bold text-charcoal mb-4">Modules</h3>
                <div className="space-y-4">
                  {currentPhase.modules.map((module) => (
                    <div
                      key={module.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <h4 className="font-bold text-charcoal mb-2">{module.name}</h4>
                          {module.topics && (
                            <ul className="text-sm text-gray-600 space-y-1">
                              {module.topics.slice(0, 3).map((topic, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  {topic}
                                </li>
                              ))}
                              {module.topics.length > 3 && (
                                <li className="text-gray-500 italic">
                                  +{module.topics.length - 3} more topics
                                </li>
                              )}
                            </ul>
                          )}
                          {module.status && (
                            <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              {module.status}
                            </span>
                          )}
                        </div>
                        <button
                          disabled={!hasPurchased}
                          className={`ml-4 px-4 py-2 rounded-lg font-semibold transition ${
                            hasPurchased
                              ? "bg-primary text-white hover:opacity-90"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {hasPurchased ? "Start" : "Locked"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Subjects */}
            {currentPhase.availableOptionals && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-charcoal mb-2">Optional Subjects</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose one optional subject for Mains preparation
                </p>
                <p className="text-sm text-primary font-semibold mb-4">{currentPhase.note}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentPhase.availableOptionals.slice(0, 6).map((optional) => (
                    <div
                      key={optional.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary transition"
                    >
                      <h4 className="font-bold text-charcoal mb-1">{optional.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{optional.papers?.join(", ")}</p>
                      {optional.note && (
                        <p className="text-xs text-primary mb-2 italic">{optional.note}</p>
                      )}
                      <button
                        disabled={!hasPurchased}
                        className={`w-full mt-2 px-3 py-1 rounded text-sm font-semibold transition ${
                          hasPurchased
                            ? "bg-primary text-white hover:opacity-90"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {hasPurchased ? "Select" : "Locked"}
                      </button>
                    </div>
                  ))}
                </div>
                {currentPhase.availableOptionals.length > 6 && (
                  <p className="text-sm text-gray-600 mt-4">
                    +{currentPhase.availableOptionals.length - 6} more optional subjects available
                  </p>
                )}
              </div>
            )}
          </div>

          {/* AI Features Preview */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg p-6 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">🤖 AI-Powered Features (Coming Soon)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-bold mb-2">Daily AI Content</h3>
                <p className="text-sm opacity-90">Personalized daily lessons and current affairs</p>
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded mt-2 inline-block">
                  Planned
                </span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-bold mb-2">Mock Interviews</h3>
                <p className="text-sm opacity-90">AI-powered personality test simulation</p>
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded mt-2 inline-block">
                  Planned
                </span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-bold mb-2">Test Generation</h3>
                <p className="text-sm opacity-90">Adaptive tests based on your performance</p>
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded mt-2 inline-block">
                  Planned
                </span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-bold mb-2">Answer Evaluation</h3>
                <p className="text-sm opacity-90">AI evaluation with detailed feedback</p>
                <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded mt-2 inline-block">
                  Planned
                </span>
              </div>
            </div>
          </div>

          {/* Placeholder Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">Platform Under Development</h3>
                <p className="mt-2 text-sm text-blue-700">
                  This is the initial structure for the Learn IAS platform. Course content, AI
                  features, mock interviews, test generation, progress tracking, and notification
                  systems are currently placeholders and will be fully implemented in upcoming
                  phases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
