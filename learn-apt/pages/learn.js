import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SharedNavbar from '../../components/shared/SharedNavbar'
import Footer from '../components/Footer'
import { getCurrentUser, signOutUser, getUserProfile } from '../lib/supabaseClient'

/**
 * Learn Page - Main Learning Content
 * 
 * This is the first page users see after successful authentication.
 * Currently a scaffold/placeholder for the actual learning content.
 * 
 * Protected Route: Redirects to login if user is not authenticated
 */
export default function Learn() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      // User is not authenticated, redirect to login
      router.push('/login?redirect=/learn')
      return
    }
    
    setUser(currentUser)
    setUserProfile(getUserProfile(currentUser))
    setIsLoading(false)
  }

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
        <title>Learn - Learn Your Aptitude</title>
        <meta name="description" content="Learn Your Aptitude - Start your learning journey" />
      </Head>
      
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn Your Aptitude"
        homeUrl="/"
        showAuthButtons={true}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome, {userProfile?.firstName || 'Learner'}! 🎓
            </h1>
            <p className="text-xl text-charcoal mb-4">
              You're now ready to begin your aptitude learning journey.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-gray-700">
                <strong>Account:</strong> {user.email}
              </p>
            </div>
          </div>
          
          {/* Learning Modules - Placeholder */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Your Learning Modules</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Module 1 */}
              <div className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary transition cursor-pointer">
                <div className="text-4xl mb-3">🧮</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Quantitative Aptitude</h3>
                <p className="text-gray-600 mb-4">Master numerical reasoning and calculations</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">10 Lessons</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              
              {/* Module 2 */}
              <div className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary transition cursor-pointer">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Logical Reasoning</h3>
                <p className="text-gray-600 mb-4">Develop analytical thinking skills</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">12 Lessons</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              
              {/* Module 3 */}
              <div className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary transition cursor-pointer">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Data Interpretation</h3>
                <p className="text-gray-600 mb-4">Analyze charts, graphs, and tables</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">8 Lessons</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              
              {/* Module 4 */}
              <div className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary transition cursor-pointer">
                <div className="text-4xl mb-3">🔤</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Verbal Reasoning</h3>
                <p className="text-gray-600 mb-4">Improve language and comprehension skills</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">9 Lessons</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              
              {/* Module 5 */}
              <div className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary transition cursor-pointer">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Pattern Recognition</h3>
                <p className="text-gray-600 mb-4">Identify sequences and patterns</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">7 Lessons</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
              
              {/* Module 6 */}
              <div className="border-2 border-gray-200 p-6 rounded-lg hover:border-primary transition cursor-pointer">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-bold text-xl mb-2 text-primary">Speed Mathematics</h3>
                <p className="text-gray-600 mb-4">Quick calculation techniques</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">11 Lessons</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Section - Placeholder */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-primary mb-6">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-charcoal">Overall Completion</span>
                  <span className="text-accent font-bold">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="bg-accent h-4 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <p className="text-gray-600">Lessons Completed</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-accent">0</div>
                  <p className="text-gray-600">Quizzes Taken</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600">0</div>
                  <p className="text-gray-600">Certificates Earned</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-r from-primary to-accent text-white p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">🚧 Development in Progress</h3>
            <p className="text-lg">
              This learning platform is currently being built. The learning modules, 
              quizzes, and interactive content will be added soon. Thank you for your patience!
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
