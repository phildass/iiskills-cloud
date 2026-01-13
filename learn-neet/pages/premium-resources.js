import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCurrentUser, checkActiveSubscription, getUserProfile } from "../lib/supabaseClient";

export default function PremiumResources() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      router.push("/login?redirect=/premium-resources");
      return;
    }

    setUser(currentUser);
    const profile = getUserProfile(currentUser);
    setUserProfile(profile);

    const hasSubscription = checkActiveSubscription(currentUser);
    setHasActiveSubscription(hasSubscription);

    setIsLoading(false);
  };

  const premiumResources = [
    {
      id: 1,
      title: "NEET Previous Year Papers",
      description:
        "Complete collection of last 10 years NEET question papers with detailed solutions",
      category: "Practice Papers",
      icon: "📄",
      files: 10,
      unlockCondition: "Complete 50% of any subject",
    },
    {
      id: 2,
      title: "Physics Formula Handbook",
      description: "Comprehensive formula sheet with derivations and quick reference guide",
      category: "Study Material",
      icon: "📐",
      files: 1,
      unlockCondition: "Complete Physics Module 1-6",
    },
    {
      id: 3,
      title: "Chemistry Reaction Guide",
      description: "Important chemical reactions, mechanisms, and named reactions for NEET",
      category: "Study Material",
      icon: "⚗️",
      files: 1,
      unlockCondition: "Complete Chemistry Module 1-6",
    },
    {
      id: 4,
      title: "Biology Diagrams Collection",
      description: "High-quality diagrams for all important topics with detailed labeling",
      category: "Visual Aids",
      icon: "🖼️",
      files: 50,
      unlockCondition: "Complete Biology Module 1-5",
    },
    {
      id: 5,
      title: "Mock Test Series",
      description: "Full-length NEET mock tests simulating actual exam pattern and difficulty",
      category: "Practice Tests",
      icon: "✍️",
      files: 20,
      unlockCondition: "Complete all modules in any subject",
    },
    {
      id: 6,
      title: "Revision Notes - Physics",
      description: "Concise revision notes covering all physics topics for quick review",
      category: "Study Material",
      icon: "📝",
      files: 12,
      unlockCondition: "Complete Physics Module 1-12",
    },
    {
      id: 7,
      title: "Revision Notes - Chemistry",
      description: "Concise revision notes covering all chemistry topics for quick review",
      category: "Study Material",
      icon: "📝",
      files: 12,
      unlockCondition: "Complete Chemistry Module 1-12",
    },
    {
      id: 8,
      title: "Revision Notes - Biology",
      description: "Concise revision notes covering all biology topics for quick review",
      category: "Study Material",
      icon: "📝",
      files: 10,
      unlockCondition: "Complete Biology Module 1-10",
    },
    {
      id: 9,
      title: "NCERT Exemplar Solutions",
      description:
        "Detailed solutions to all NCERT Exemplar problems for Physics, Chemistry, and Biology",
      category: "Solutions",
      icon: "📚",
      files: 3,
      unlockCondition: "Complete 75% of all modules",
    },
    {
      id: 10,
      title: "Time Management Guide",
      description: "Strategies for effective time management during NEET preparation and exam",
      category: "Strategy",
      icon: "⏰",
      files: 1,
      unlockCondition: "Active subscription",
    },
    {
      id: 11,
      title: "Mnemonics and Memory Tricks",
      description: "Collection of mnemonics and memory techniques for important concepts",
      category: "Study Material",
      icon: "🧠",
      files: 1,
      unlockCondition: "Active subscription",
    },
    {
      id: 12,
      title: "Video Lectures - Important Topics",
      description: "Recorded video lectures for difficult and high-weightage topics",
      category: "Video Content",
      icon: "🎥",
      files: 30,
      unlockCondition: "Complete 50% of any subject",
    },
  ];

  const handleResourceClick = (resource) => {
    if (!hasActiveSubscription) {
      alert("Active subscription required to access premium resources");
      return;
    }

    // In production, this would check if unlock condition is met and download/display the resource
    alert(
      `Resource: ${resource.title}\n\nUnlock Condition: ${resource.unlockCondition}\n\nIn production, this would:\n1. Check if you've met the unlock condition\n2. Either download the resource or show it's still locked\n3. Track resource access for analytics`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Premium Resources - Learn NEET</title>
        <meta name="description" content="Access exclusive study materials and resources" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">Premium Resources 🎁</h1>
                <p className="text-gray-600">
                  Exclusive study materials unlocked as you progress through the course
                </p>
              </div>
              <Link
                href="/learn"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Subscription Status */}
          {hasActiveSubscription ? (
            <div className="bg-green-50 border-2 border-green-500 p-6 rounded-2xl mb-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Active Subscription</h3>
                  <p className="text-green-700">
                    You have access to all premium resources. Complete modules to unlock more
                    content!
                  </p>
                  {userProfile?.neetSubscriptionEnd && (
                    <p className="text-green-600 text-sm mt-2">
                      Valid until: {new Date(userProfile.neetSubscriptionEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-orange-50 border-2 border-orange-500 p-6 rounded-2xl mb-8">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-2">Subscription Required</h3>
                  <p className="text-orange-700">
                    Active subscription needed to access premium resources. Please complete your
                    payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => handleResourceClick(resource)}
              >
                <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
                  <div className="text-5xl mb-3">{resource.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                  <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                    {resource.category}
                  </span>
                </div>

                <div className="p-6">
                  <p className="text-gray-700 mb-4">{resource.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Files:</span>
                      <span className="font-semibold text-charcoal">{resource.files}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Unlock Condition:</p>
                      <p className="text-sm font-medium text-primary">{resource.unlockCondition}</p>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition">
                    {hasActiveSubscription ? "Access Resource" : "Locked 🔒"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-4">About Premium Resources</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                Premium resources are high-quality study materials designed to supplement your NEET
                preparation. These resources are unlocked progressively as you complete modules and
                demonstrate mastery of topics.
              </p>

              <h4 className="text-lg font-bold text-charcoal mt-6 mb-3">How to Unlock Resources</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Complete modules in each subject to unlock subject-specific resources</li>
                <li>Some resources unlock automatically with an active subscription</li>
                <li>Achieve specific completion milestones to unlock advanced materials</li>
                <li>All resources remain accessible throughout your 2-year subscription period</li>
              </ul>

              <h4 className="text-lg font-bold text-charcoal mt-6 mb-3">Resource Categories</h4>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h5 className="font-semibold">Study Materials</h5>
                    <p className="text-sm text-gray-600">
                      Formula sheets, revision notes, and guides
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <h5 className="font-semibold">Practice Tests</h5>
                    <p className="text-sm text-gray-600">Mock tests and previous year papers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🎥</span>
                  <div>
                    <h5 className="font-semibold">Video Content</h5>
                    <p className="text-sm text-gray-600">Recorded lectures on important topics</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🖼️</span>
                  <div>
                    <h5 className="font-semibold">Visual Aids</h5>
                    <p className="text-sm text-gray-600">Diagrams and illustrations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
