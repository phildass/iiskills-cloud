import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getCurrentUser, getUserProfile, checkActiveSubscription, signOutUser } from '../lib/supabaseClient'
import { physicsSyllabus, chemistrySyllabus, biologySyllabus, generateQuizQuestions } from '../lib/neetSyllabus'

export default function Learn() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('physics') // physics, chemistry, biology
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login?redirect=/learn')
      return
    }
    
    setUser(currentUser)
    const profile = getUserProfile(currentUser)
    setUserProfile(profile)
    
    // Check subscription status
    const hasSubscription = checkActiveSubscription(currentUser)
    setHasActiveSubscription(hasSubscription)
    
    setIsLoading(false)
  }

  const handleSignOut = async () => {
    await signOutUser()
    router.push('/')
  }

  const handleTopicClick = (moduleId, topicId) => {
    if (!hasActiveSubscription) {
      alert('Your subscription is not active. Please contact admin to activate your 2-year subscription.')
      return
    }

    // In production, this would navigate to a lesson page or open a modal with content
    setSelectedModule(moduleId)
    setSelectedTopic(topicId)
    
    // For demo, show alert with quiz generation
    const quizzes = generateQuizQuestions(selectedSubject, moduleId, topicId)
    alert(`Opening lesson content for ${selectedSubject} module ${moduleId}, topic ${topicId}\n\nThis would display:\n- Lesson content with AI-generated explanations\n- Diagrams and visual aids\n- Interactive quizzes (${quizzes.length} questions)\n- Practice exercises`)
  }

  const handleModuleTest = (moduleId) => {
    if (!hasActiveSubscription) {
      alert('Your subscription is not active. Please contact admin to activate your 2-year subscription.')
      return
    }

    router.push(`/module-test?subject=${selectedSubject}&module=${moduleId}`)
  }

  const getSyllabusForSubject = () => {
    switch (selectedSubject) {
      case 'physics':
        return physicsSyllabus
      case 'chemistry':
        return chemistrySyllabus
      case 'biology':
        return biologySyllabus
      default:
        return physicsSyllabus
    }
  }

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'physics':
        return '⚛️'
      case 'chemistry':
        return '🧪'
      case 'biology':
        return '🧬'
      default:
        return '📚'
    }
  }

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'physics':
        return 'blue'
      case 'chemistry':
        return 'purple'
      case 'biology':
        return 'green'
      default:
        return 'gray'
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

  const syllabus = getSyllabusForSubject()
  const color = getSubjectColor(selectedSubject)

  return (
    <>
      <Head>
        <title>Learn NEET - Your Dashboard</title>
        <meta name="description" content="Access your NEET preparation dashboard" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Learn NEET</h1>
                <p className="text-sm text-gray-600">Comprehensive NEET Preparation</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-charcoal">
                    {userProfile?.firstName || userProfile?.first_name || 'Student'}
                  </p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-primary mb-2">
              Welcome, {userProfile?.firstName || userProfile?.first_name || 'Student'}! 🎓
            </h2>
            <p className="text-gray-700 mb-4">
              Your comprehensive NEET preparation platform with Physics, Chemistry, and Biology
            </p>
            
            {hasActiveSubscription ? (
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
                <p className="text-green-800 font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>Active Subscription</span>
                </p>
                {userProfile?.neetSubscriptionEnd && (
                  <p className="text-green-700 text-sm mt-1">
                    Valid until: {new Date(userProfile.neetSubscriptionEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-orange-50 border-2 border-orange-500 p-4 rounded-lg">
                <p className="text-orange-800 font-semibold">⚠️ Subscription Pending</p>
                <p className="text-orange-700 text-sm mt-1">
                  Please complete your payment to access all content. Contact admin for assistance.
                </p>
              </div>
            )}
          </div>

          {/* Subject Tabs */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <h3 className="text-xl font-bold text-primary mb-4">Select Subject</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedSubject('physics')}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedSubject === 'physics'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-4xl mb-2">⚛️</div>
                <h4 className="text-xl font-bold text-blue-700">Physics</h4>
                <p className="text-sm text-gray-600 mt-1">12 Modules</p>
              </button>

              <button
                onClick={() => setSelectedSubject('chemistry')}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedSubject === 'chemistry'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-2">🧪</div>
                <h4 className="text-xl font-bold text-purple-700">Chemistry</h4>
                <p className="text-sm text-gray-600 mt-1">12 Modules</p>
              </button>

              <button
                onClick={() => setSelectedSubject('biology')}
                className={`p-6 rounded-xl border-2 transition ${
                  selectedSubject === 'biology'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-4xl mb-2">🧬</div>
                <h4 className="text-xl font-bold text-green-700">Biology</h4>
                <p className="text-sm text-gray-600 mt-1">10 Modules</p>
              </button>
            </div>
          </div>

          {/* Course Modules */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
                <span>{getSubjectIcon(selectedSubject)}</span>
                <span>{selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Modules</span>
              </h3>
              <Link href="/premium-resources" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-600 transition text-sm font-semibold">
                Premium Resources →
              </Link>
            </div>

            {syllabus.map((module) => (
              <div key={module.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r from-${color}-600 to-${color}-700 text-white p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-bold mb-2">
                        Module {module.id}: {module.title}
                      </h4>
                      <p className="text-sm opacity-90">{module.topics.length} topics</p>
                    </div>
                    <button
                      onClick={() => handleModuleTest(module.id)}
                      className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      📝 Module Test
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {module.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(module.id, topic.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          hasActiveSubscription
                            ? `border-${color}-300 hover:border-${color}-500 hover:bg-${color}-50 cursor-pointer`
                            : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-75'
                        }`}
                        disabled={!hasActiveSubscription}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {hasActiveSubscription ? '▶️' : '🔒'}
                              </span>
                              <div>
                                <h5 className="font-semibold text-lg text-charcoal">
                                  {topic.id}. {topic.title}
                                </h5>
                                <p className="text-sm text-gray-600">Duration: {topic.duration}</p>
                              </div>
                            </div>
                          </div>
                          {hasActiveSubscription && (
                            <span className={`bg-${color}-500 text-white px-3 py-1 rounded-full text-sm font-bold`}>
                              UNLOCKED
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Link href="/premium-resources" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-3xl mb-2">🎁</div>
              <h4 className="font-bold text-lg text-primary mb-2">Premium Resources</h4>
              <p className="text-sm text-gray-600">Access exclusive study materials and practice papers</p>
            </Link>

            <Link href="/admin" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-3xl mb-2">⚙️</div>
              <h4 className="font-bold text-lg text-primary mb-2">Admin Panel</h4>
              <p className="text-sm text-gray-600">Manage settings and view analytics (Admin only)</p>
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-lg text-primary mb-2">Your Progress</h4>
              <p className="text-sm text-gray-600">Coming soon - Track your learning progress</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
