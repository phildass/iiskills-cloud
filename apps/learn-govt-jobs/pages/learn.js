import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getCurrentUser, signOutUser, getUserProfile } from "../lib/supabaseClient";
import SubdomainNavbar from "../components/SubdomainNavbar";

/**
 * Learn Government Jobs - Main Learning Page
 *
 * Provides comprehensive preparation for various government examinations
 * Protected Route: Redirects to login if user is not authenticated
 */
export default function Learn() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.push("/login");
        return;
      }

      setUser(currentUser);
      setUserProfile(getUserProfile(currentUser));
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    const { success } = await signOutUser();
    if (success) {
      setUser(null);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  const sections = [
    {
      label: "Home",
      href: "/",
      description: "Return to main page",
    },
    {
      label: "Dashboard",
      href: "/learn",
      description: "Learning dashboard",
    },
  ];

  const examCategories = [
    {
      title: "UPSC Civil Services",
      icon: "🏛️",
      description: "Comprehensive preparation for UPSC Prelims and Mains",
      topics: ["General Studies", "Current Affairs", "Essay Writing", "Interview Prep"],
    },
    {
      title: "Banking Exams",
      icon: "🏦",
      description: "IBPS PO, Clerk, SBI and other banking sector exams",
      topics: ["Quantitative Aptitude", "Reasoning", "English", "Banking Awareness"],
    },
    {
      title: "Railway Exams",
      icon: "🚆",
      description: "RRB NTPC, Group D and technical positions",
      topics: ["Mathematics", "General Intelligence", "General Awareness", "Technical Subjects"],
    },
    {
      title: "SSC Exams",
      icon: "📋",
      description: "Staff Selection Commission - CGL, CHSL, MTS and more",
      topics: ["Reasoning", "Quantitative Aptitude", "English", "General Knowledge"],
    },
    {
      title: "State PSC",
      icon: "🗺️",
      description: "State Public Service Commission examinations",
      topics: ["State Affairs", "General Studies", "Regional Knowledge", "Current Events"],
    },
    {
      title: "Defense Exams",
      icon: "🎖️",
      description: "NDA, CDS, AFCAT and other defense services",
      topics: ["Mathematics", "English", "General Knowledge", "Physical Fitness"],
    },
  ];

  return (
    <>
      <Head>
        <title>Learn Government Jobs - Exam Preparation</title>
        <meta name="description" content="Comprehensive preparation for government examinations" />
      </Head>

      <SubdomainNavbar subdomainName="Learn Government Jobs" sections={sections} />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                  Welcome, {userProfile?.firstName || "Learner"}! 🎓
                </h1>
                <p className="text-xl text-gray-700 mb-4">
                  Start your journey towards a successful government career
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <p className="text-gray-700">
                    <strong>Account:</strong> {user?.email || "Unknown"}
                  </p>
                  {userProfile?.age && (
                    <p className="text-gray-700">
                      <strong>Age:</strong> {userProfile.age} | <strong>Qualification:</strong>{" "}
                      {userProfile.qualification || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold mb-4">Government Exam Preparation Platform</h2>
            <p className="text-lg mb-4">
              Build strong fundamentals in reasoning, quantitative aptitude, general knowledge, and
              English to excel across multiple competitive government examinations.
            </p>
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="font-bold">Comprehensive Content</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="font-bold">Practice Tests</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">📊</div>
                <div className="font-bold">Performance Tracking</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-bold">Exam Strategies</div>
              </div>
            </div>
          </div>

          {/* Exam Categories */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Exam Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md border-2 border-blue-100 hover:border-blue-600 transition-all hover:shadow-xl"
                >
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">{category.icon}</div>
                    <h3 className="text-xl font-bold text-blue-600">{category.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">{category.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-600">Key Topics:</p>
                    {category.topics.map((topic, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-sm text-gray-700">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Resources */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Study Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg border-2 border-purple-200">
                <div className="text-3xl mb-3">📖</div>
                <h3 className="text-xl font-bold text-purple-600 mb-3">Study Materials</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Comprehensive notes and guides</li>
                  <li>• Topic-wise practice questions</li>
                  <li>• Previous year question papers</li>
                  <li>• Important formulas and shortcuts</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg border-2 border-green-200">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-green-600 mb-3">Mock Tests</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Full-length mock examinations</li>
                  <li>• Subject-wise practice tests</li>
                  <li>• Timed assessments</li>
                  <li>• Detailed performance analysis</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-lg border-2 border-orange-200">
                <div className="text-3xl mb-3">📰</div>
                <h3 className="text-xl font-bold text-orange-600 mb-3">Current Affairs</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Daily news updates</li>
                  <li>• Monthly compilations</li>
                  <li>• Important events and dates</li>
                  <li>• Government schemes and policies</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border-2 border-blue-200">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">Exam Tips</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Time management strategies</li>
                  <li>• Effective revision techniques</li>
                  <li>• Exam day preparation</li>
                  <li>• Stress management tips</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
