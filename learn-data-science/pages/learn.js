import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getCurrentUser, signOutUser, getUserProfile } from '../lib/supabaseClient'
import PaidUserProtectedRoute from '../../components/PaidUserProtectedRoute'

/**
 * Test Selection Page
 * 
 * Users select between Short (5 min) and Elaborate (20 min) test modes
 * Protected Route: Requires authentication and payment
 */
function LearnContent() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      
      if (currentUser) {
        setUser(currentUser)
        setUserProfile(getUserProfile(currentUser))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    const { success } = await signOutUser()
    if (success) {
      setUser(null)
      router.push('/')
    }
  }

  const startTest = (mode) => {
    router.push(`/test?mode=${mode}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Select Assessment - Learn-Apt</title>
        <meta name="description" content="Choose your assessment mode" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome, {userProfile?.firstName || 'Learner'}! 🎓
            </h1>
            <p className="text-xl text-charcoal mb-4">
              Ready to discover your strengths and unlock your potential?
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-gray-700">
                <strong>Account:</strong> {user?.email || "Unknown"}
              </p>
              {userProfile?.age && (
                <p className="text-gray-700">
                  <strong>Age:</strong> {userProfile.age} | <strong>Qualification:</strong> {userProfile.qualification || 'Not specified'}
                </p>
              )}
            </div>
          </div>
          
          {/* Test Selection */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Choose Your Assessment Mode</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Short Test */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-primary transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-3xl font-bold text-primary mb-2">Short Test</h3>
                  <div className="text-2xl font-bold text-accent mb-4">5 Minutes</div>
                </div>
                
                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>5 modules with 5 questions each (25 total)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Objective multiple-choice format</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>AI-generated from reliable sources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Quick insights into your strengths</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Concise AI-generated report</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => startTest('short')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Short Test
                </button>
              </div>
              
              {/* Elaborate Test */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-200 hover:border-accent transition">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-3xl font-bold text-accent mb-2">Elaborate Test</h3>
                  <div className="text-2xl font-bold text-primary mb-4">20 Minutes</div>
                </div>
                
                <ul className="space-y-3 mb-8 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>20 modules with 5 questions each (100 total)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Comprehensive assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Navigable by clicking answers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>In-depth career guidance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 font-bold">✓</span>
                    <span>Detailed ~700-word AI report</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => startTest('elaborate')}
                  className="w-full bg-gradient-to-r from-purple-500 to-accent text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Start Elaborate Test
                </button>
              </div>
            </div>
          </div>
          
          {/* What We Assess */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">What We Assess</h2>
            <p className="text-gray-700 mb-6">
              Our comprehensive assessment evaluates multiple dimensions of your abilities and experiences:
            </p>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🎓</div>
                <h4 className="font-bold text-primary">Education</h4>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">💪</div>
                <h4 className="font-bold text-primary">Talents & Skills</h4>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                <h4 className="font-bold text-primary">Family</h4>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">👥</div>
                <h4 className="font-bold text-primary">Friends</h4>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🌟</div>
                <h4 className="font-bold text-primary">Influencers</h4>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-bold text-primary">Interests</h4>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">🧠</div>
                <h4 className="font-bold text-primary">Cognitive Abilities</h4>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl mb-2">💼</div>
                <h4 className="font-bold text-primary">Career Goals</h4>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </>
  )
}

export default function Learn() {
  return (
    <PaidUserProtectedRoute>
      <LearnContent />
    </PaidUserProtectedRoute>
  )
}
