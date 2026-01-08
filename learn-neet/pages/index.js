import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/supabaseClient'
import InstallApp from '../components/shared/InstallApp'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Learn NEET - Comprehensive NEET Preparation | iiskills.cloud</title>
        <meta name="description" content="Master NEET with AI-powered comprehensive content for Physics, Chemistry, and Biology. 2-year subscription with full syllabus coverage." />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-purple-900 text-white">
          <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Master NEET Preparation
              </h1>
              <p className="text-2xl md:text-3xl mb-8 max-w-3xl mx-auto">
                Comprehensive AI-powered learning for Physics, Chemistry, and Biology
              </p>
              <p className="text-xl mb-12 opacity-90">
                Following the official NEET syllabus with interactive lessons, quizzes, and explanations
              </p>
              
              {/* Pricing Badge */}
              <div className="inline-block bg-white text-primary px-10 py-6 rounded-2xl mb-10 shadow-2xl">
                <div className="text-2xl font-semibold mb-2">2-Year Premium Subscription</div>
                <div className="text-5xl font-bold mb-2">₹4,999</div>
                <div className="text-lg text-gray-600">Complete Access to All Subjects</div>
                <div className="text-sm text-gray-500 mt-2">Physics • Chemistry • Biology</div>
              </div>
              
              {!user && (
                <div className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                  <p className="text-lg font-semibold text-gray-800">
                    📝 Registration Required
                  </p>
                  <p className="text-sm mt-2 text-gray-700">
                    Create a free account to access all learning content. Register once, access all iiskills.cloud apps!
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                {user ? (
                  <Link href="/learn" className="inline-block bg-white text-primary px-12 py-5 rounded-lg font-bold text-xl hover:bg-gray-100 transition shadow-lg">
                    Go to Dashboard →
                  </Link>
                ) : (
                  <>
                    <Link href="/register" className="inline-block bg-accent text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-orange-600 transition shadow-lg">
                      Register Free Account
                    </Link>
                    <Link href="/login" className="inline-block bg-transparent border-2 border-white text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-white hover:text-primary transition">
                      Already Have Account? Sign In
                    </Link>
                  </>
                )}
                <InstallApp appName="Learn NEET" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">
              Why Choose Our NEET Program?
            </h2>
            <p className="text-center text-xl text-gray-600 mb-16">
              Everything you need to excel in NEET examination
            </p>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border-2 border-blue-100">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Complete Syllabus</h3>
                <p className="text-gray-700">
                  Full coverage of NEET Physics, Chemistry, and Biology syllabus with AI-generated lessons, explanations, and diagrams
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-100">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Module Tests</h3>
                <p className="text-gray-700">
                  Practice with comprehensive module tests and get instant feedback to track your progress and identify weak areas
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg border-2 border-orange-100">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Premium Resources</h3>
                <p className="text-gray-700">
                  Unlock exclusive premium resources, study materials, and practice papers after completing modules
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg border-2 border-green-100">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-primary mb-4">AI-Powered Content</h3>
                <p className="text-gray-700">
                  Benefit from AI-generated explanations, interactive quizzes, and visual diagrams for better understanding
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg border-2 border-red-100">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Progress Tracking</h3>
                <p className="text-gray-700">
                  Monitor your learning journey with detailed analytics and performance insights across all subjects
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-2xl shadow-lg border-2 border-yellow-100">
                <div className="text-5xl mb-4">⏰</div>
                <h3 className="text-2xl font-bold text-primary mb-4">2-Year Access</h3>
                <p className="text-gray-700">
                  Full access to all content and features for 2 years - plenty of time to prepare thoroughly for NEET
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Subject Overview */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-16">
              What You'll Learn
            </h2>
            
            <div className="space-y-8">
              {/* Physics */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">⚛️</div>
                  <div>
                    <h3 className="text-3xl font-bold text-blue-700">Physics</h3>
                    <p className="text-gray-600">12 comprehensive modules</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  From Physical World and Measurement to Modern Physics, covering mechanics, thermodynamics, 
                  electromagnetism, optics, and more
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Kinematics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Laws of Motion</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Thermodynamics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Electrostatics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Optics</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Modern Physics</span>
                </div>
              </div>

              {/* Chemistry */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🧪</div>
                  <div>
                    <h3 className="text-3xl font-bold text-purple-700">Chemistry</h3>
                    <p className="text-gray-600">12 comprehensive modules</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  Complete coverage of Physical, Organic, and Inorganic Chemistry including atomic structure, 
                  chemical bonding, organic reactions, and more
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Atomic Structure</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Chemical Bonding</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Thermodynamics</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Organic Chemistry</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Biomolecules</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">Polymers</span>
                </div>
              </div>

              {/* Biology */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">🧬</div>
                  <div>
                    <h3 className="text-3xl font-bold text-green-700">Biology</h3>
                    <p className="text-gray-600">10 comprehensive modules</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  In-depth study of Botany and Zoology covering cell biology, genetics, human physiology, 
                  ecology, and biotechnology
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Cell Biology</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Genetics</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Human Physiology</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Plant Physiology</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Biotechnology</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Ecology</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your NEET Journey?</h2>
            <p className="text-xl mb-8">
              Join thousands of students preparing for NEET with our comprehensive platform
            </p>
            
            {/* Pricing Display */}
            <div className="bg-white text-primary rounded-2xl p-8 mb-8 inline-block">
              <div className="text-2xl font-bold mb-3">2-Year Premium Subscription</div>
              <div className="text-6xl font-bold text-accent mb-3">₹4,999</div>
              <div className="text-lg text-gray-700 mb-4">Complete Access to All Subjects</div>
              <ul className="text-left text-gray-700 space-y-2 mb-4">
                <li>✓ Full Physics, Chemistry & Biology syllabus</li>
                <li>✓ AI-powered lessons and explanations</li>
                <li>✓ Module tests with instant feedback</li>
                <li>✓ Premium resources and study materials</li>
                <li>✓ Progress tracking and analytics</li>
                <li>✓ 2-year unlimited access</li>
              </ul>
            </div>
            
            {!user && (
              <div>
                <Link href="/register" className="inline-block bg-accent text-white px-14 py-5 rounded-lg font-bold text-xl hover:bg-orange-600 transition shadow-2xl">
                  Subscribe Now →
                </Link>
                <p className="text-sm mt-4 opacity-90">Secure payment • Instant access</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
