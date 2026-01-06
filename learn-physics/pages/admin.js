import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getCurrentUser, getUserProfile, isAdmin } from '../lib/supabaseClient'
import { physicsCurriculum } from '../data/curriculum'

/**
 * Admin Panel for Learn Physics
 * 
 * Access controlled by Supabase user role
 * Allows admins to view platform statistics and user progress
 */
export default function Admin() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    // Check if user has admin access
    if (!isAdmin(currentUser)) {
      setHasAccess(false)
      setIsLoading(false)
      return
    }
    
    setUser(currentUser)
    setUserProfile(getUserProfile(currentUser))
    setHasAccess(true)
    setIsLoading(false)
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

  if (!hasAccess) {
    return (
      <>
        <Head>
          <title>Access Denied - Learn Physics</title>
        </Head>
        
        <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-6xl mb-6">🚫</div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-xl text-charcoal mb-8">
              You do not have permission to access the admin panel.
            </p>
            <p className="text-gray-600 mb-8">
              This area is restricted to administrators only. If you believe you should have access, 
              please contact the system administrator.
            </p>
            <a
              href="/learn"
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Back to Learning Platform
            </a>
          </div>
        </main>
      </>
    )
  }

  // Calculate statistics
  const totalLevels = physicsCurriculum.levels.length
  const totalModules = physicsCurriculum.levels.reduce((sum, level) => sum + level.modules.length, 0)
  const totalLessons = physicsCurriculum.levels.reduce((sum, level) => 
    sum + level.modules.reduce((mSum, module) => mSum + module.lessons.length, 0), 0
  )

  return (
    <>
      <Head>
        <title>Admin Panel - Learn Physics</title>
        <meta name="description" content="Admin panel for Learn Physics platform" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">Admin Panel</h1>
                <p className="text-xl text-charcoal">
                  Welcome, {userProfile?.firstName || 'Admin'} 👋
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg font-bold">
                  Administrator
                </span>
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-gray-700">
                <strong>Role:</strong> {userProfile?.role || 'admin'} | <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-2xl font-bold text-charcoal mb-1">{totalLevels}</h3>
              <p className="text-gray-600">Learning Levels</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="text-2xl font-bold text-charcoal mb-1">{totalModules}</h3>
              <p className="text-gray-600">Total Modules</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
              <div className="text-3xl mb-2">📖</div>
              <h3 className="text-2xl font-bold text-charcoal mb-1">{totalLessons}</h3>
              <p className="text-gray-600">Total Lessons</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-2xl font-bold text-charcoal mb-1">{totalModules}</h3>
              <p className="text-gray-600">Module Tests</p>
            </div>
          </div>

          {/* Curriculum Overview */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Curriculum Overview</h2>
            
            <div className="space-y-6">
              {physicsCurriculum.levels.map((level, levelIndex) => (
                <div key={level.id} className="border-l-4 border-primary pl-6">
                  <h3 className="text-2xl font-bold text-charcoal mb-2">
                    Level {levelIndex + 1}: {level.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{level.description}</p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {level.modules.map((module, moduleIndex) => (
                      <div key={module.id} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-primary mb-1">
                          Module {moduleIndex + 1}: {module.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📚 {module.lessons.length} lessons</span>
                          <span>✅ 1 test</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Information */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">Platform Information</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-charcoal mb-2">Authentication System</h3>
                <p className="text-gray-700">
                  Supabase-powered authentication with cross-subdomain session support. 
                  Users registered here can access all iiskills.cloud services.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-bold text-charcoal mb-2">Progress Tracking</h3>
                <p className="text-gray-700">
                  User progress is tracked through localStorage (development). In production, 
                  this would be stored in Supabase database for persistence across devices.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold text-charcoal mb-2">AI-Generated Content</h3>
                <p className="text-gray-700">
                  Lessons, quizzes, and tests are designed to be AI-generated. The current implementation 
                  uses placeholder content demonstrating the structure and flow.
                </p>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-bold text-charcoal mb-2">Role-Based Access</h3>
                <p className="text-gray-700">
                  Admin panel access is controlled via Supabase user metadata. Users with 
                  'admin' role in user_metadata or app_metadata can access this panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
