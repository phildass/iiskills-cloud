import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getCurrentUser, signOutUser, getUserProfile } from '../lib/supabaseClient'
import UserProtectedRoute from '../components/UserProtectedRoute'

/**
 * Learning Content Page for Learn-Geography
 * 
 * This page provides free access to all geography learning content.
 * Only requires authentication (registration) - no payment required.
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
        <title>Learning Content - Learn Geography</title>
        <meta name="description" content="Explore world geography learning materials" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome, {userProfile?.firstName || 'Learner'}! 🌍
            </h1>
            <p className="text-xl text-charcoal mb-4">
              Ready to explore the world through geography?
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
          
          {/* Learning Modules */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Geography Learning Modules</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Module 1: Introduction to Geography */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg shadow border-2 border-blue-200 hover:border-primary transition">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="text-2xl font-bold text-primary mb-3">Introduction to Geography</h3>
                <p className="text-gray-700 mb-4">
                  Learn the fundamentals of geography, key concepts, and the importance of spatial thinking.
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-600">
                  <li>✓ What is Geography?</li>
                  <li>✓ Branches of Geography</li>
                  <li>✓ Geographic Thinking</li>
                  <li>✓ Tools and Techniques</li>
                </ul>
                <button className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  Start Module
                </button>
              </div>
              
              {/* Module 2: Physical Geography */}
              <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-lg shadow border-2 border-green-200 hover:border-primary transition">
                <div className="text-4xl mb-3">🏔️</div>
                <h3 className="text-2xl font-bold text-primary mb-3">Physical Geography</h3>
                <p className="text-gray-700 mb-4">
                  Explore Earth's physical features, landforms, and natural processes.
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-600">
                  <li>✓ Landforms and Topography</li>
                  <li>✓ Plate Tectonics</li>
                  <li>✓ Weathering and Erosion</li>
                  <li>✓ Water Bodies</li>
                </ul>
                <button className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  Start Module
                </button>
              </div>
              
              {/* Module 3: Climate and Weather */}
              <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-lg shadow border-2 border-yellow-200 hover:border-primary transition">
                <div className="text-4xl mb-3">☁️</div>
                <h3 className="text-2xl font-bold text-primary mb-3">Climate and Weather</h3>
                <p className="text-gray-700 mb-4">
                  Understand climate patterns, weather systems, and atmospheric phenomena.
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-600">
                  <li>✓ Climate Zones</li>
                  <li>✓ Weather Patterns</li>
                  <li>✓ Atmospheric Circulation</li>
                  <li>✓ Climate Change</li>
                </ul>
                <button className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  Start Module
                </button>
              </div>
              
              {/* Module 4: World Regions */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow border-2 border-purple-200 hover:border-primary transition">
                <div className="text-4xl mb-3">🗺️</div>
                <h3 className="text-2xl font-bold text-primary mb-3">World Regions</h3>
                <p className="text-gray-700 mb-4">
                  Discover the diversity of continents, countries, and regions around the world.
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-600">
                  <li>✓ Continents and Oceans</li>
                  <li>✓ Major Countries</li>
                  <li>✓ Regional Characteristics</li>
                  <li>✓ Cultural Landscapes</li>
                </ul>
                <button className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  Start Module
                </button>
              </div>
              
              {/* Module 5: Human Geography */}
              <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-lg shadow border-2 border-pink-200 hover:border-primary transition">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="text-2xl font-bold text-primary mb-3">Human Geography</h3>
                <p className="text-gray-700 mb-4">
                  Study population distribution, migration patterns, and urbanization.
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-600">
                  <li>✓ Population Geography</li>
                  <li>✓ Migration Patterns</li>
                  <li>✓ Urban Development</li>
                  <li>✓ Settlement Patterns</li>
                </ul>
                <button className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  Start Module
                </button>
              </div>
              
              {/* Module 6: Map Reading and GIS */}
              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-lg shadow border-2 border-indigo-200 hover:border-primary transition">
                <div className="text-4xl mb-3">🧭</div>
                <h3 className="text-2xl font-bold text-primary mb-3">Map Reading and GIS</h3>
                <p className="text-gray-700 mb-4">
                  Master cartography skills and geographic information systems.
                </p>
                <ul className="space-y-2 mb-4 text-sm text-gray-600">
                  <li>✓ Map Types and Symbols</li>
                  <li>✓ Scale and Projection</li>
                  <li>✓ GIS Fundamentals</li>
                  <li>✓ Spatial Analysis</li>
                </ul>
                <button className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  Start Module
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional Resources */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">Additional Learning Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-neutral p-6 rounded-lg">
                <div className="text-3xl mb-3">📚</div>
                <h4 className="font-bold text-primary mb-2">Study Materials</h4>
                <p className="text-sm text-charcoal">Comprehensive guides and reference materials for each topic.</p>
              </div>
              
              <div className="bg-neutral p-6 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-primary mb-2">Practice Quizzes</h4>
                <p className="text-sm text-charcoal">Test your knowledge with interactive quizzes and assessments.</p>
              </div>
              
              <div className="bg-neutral p-6 rounded-lg">
                <div className="text-3xl mb-3">🏆</div>
                <h4 className="font-bold text-primary mb-2">Certification</h4>
                <p className="text-sm text-charcoal">Earn certificates upon completing modules and assessments.</p>
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
    <UserProtectedRoute>
      <LearnContent />
    </UserProtectedRoute>
  )
}
