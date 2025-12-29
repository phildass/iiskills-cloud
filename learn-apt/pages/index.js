import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SharedNavbar from '../components/shared/SharedNavbar'
import Footer from '../components/Footer'
import { getCurrentUser, signOutUser } from '../lib/supabaseClient'

/**
 * Learn Your Aptitude - Landing Page
 * 
 * This is the main landing page for the Learn-Apt standalone app.
 * Features:
 * - Welcome message for Learn Your Aptitude
 * - Three action buttons: ENTER, SIGN IN, LOG IN
 * - ENTER button verifies Supabase auth and proceeds to learning content
 * - SIGN IN links to registration
 * - LOG IN links to login page
 */
export default function Home() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }

  const handleLogout = async () => {
    const { success } = await signOutUser()
    if (success) {
      setUser(null)
      router.push('/')
    }
  }

  const handleEnter = async () => {
    // Verify auth session
    const currentUser = await getCurrentUser()
    
    if (currentUser) {
      // User is authenticated, proceed to learning content
      router.push('/learn')
    } else {
      // User is not authenticated, redirect to login
      router.push('/login')
    }
  }

  return (
    <>
      <Head>
        <title>Learn-Apt - Comprehensive Skills Assessment & AI Career Guidance</title>
        <meta name="description" content="Learn-Apt - Test every aspect of your skills, talents, and weak spots. Get AI-powered career and self-improvement guidance based on comprehensive assessment." />
      </Head>
      
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn Your Aptitude"
        homeUrl="https://iiskills.cloud"
        showAuthButtons={true}
        customLinks={[
          { href: 'https://iiskills.cloud', label: 'Home', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/courses', label: 'Courses', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/certification', label: 'Certification', className: 'hover:text-primary transition' },
          { href: 'https://www.aienter.in/payments', label: 'Payments', className: 'bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold', mobileClassName: 'block bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold', target: '_blank', rel: 'noopener noreferrer' },
          { href: 'https://iiskills.cloud/about', label: 'About', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/contact', label: 'Contact', className: 'hover:text-primary transition' }
        ]}
        appName="Learn-Apt"
        homeUrl="/"
        showAuthButtons={false}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-primary mb-6">
              Welcome to Learn-Apt
            </h1>
            
            <p className="text-2xl text-charcoal mb-8 leading-relaxed">
              Test every aspect of your skills, talents, and weak spots
            </p>
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl mb-12">
              <p className="text-lg text-gray-700 mb-6">
                Learn-Apt is a comprehensive assessment tool that uses AI to analyze your strengths, 
                identify areas for improvement, and provide personalized career and self-development guidance. 
                Our intelligent testing system evaluates multiple dimensions of your abilities and generates 
                actionable insights to help you achieve your full potential.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Comprehensive Testing</h3>
                  <p className="text-sm text-gray-600">Evaluate skills, talents, education, and social influences</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="font-bold text-lg mb-2 text-accent">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Get intelligent career and learning recommendations</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-bold text-lg mb-2 text-green-600">Detailed Reports</h3>
                  <p className="text-sm text-gray-600">Download comprehensive PDF reports with insights</p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleEnter}
                className="bg-gradient-to-r from-primary to-accent text-white px-12 py-5 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                ENTER
              </button>
              
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-primary border-2 border-primary px-12 py-5 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:bg-primary hover:text-white"
              >
                SIGN IN
              </button>
              
              <button
                onClick={() => router.push('/login')}
                className="bg-charcoal text-white px-12 py-5 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 hover:bg-gray-700"
              >
                LOG IN
              </button>
            </div>
            
            {user && (
              <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800">
                  ✓ You're already logged in as <strong>{user.email}</strong>. Click ENTER to continue.
                </p>
              </div>
            )}
            
            {!user && !isLoading && (
              <div className="mt-8 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                <p className="text-blue-800">
                  New here? Click <strong>SIGN IN</strong> to create an account or <strong>LOG IN</strong> if you already have one.
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Test Modes Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              Choose Your Assessment Mode
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Short Test */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border-2 border-blue-200 hover:border-primary transition">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-3xl font-bold text-primary mb-4">Short Test</h3>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-accent">5 Minutes</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>5 modules with 5 questions each</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Objective questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>AI-generated from reliable sources</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Quick insights into your strengths</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Elaborate Test */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg border-2 border-purple-200 hover:border-accent transition">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-3xl font-bold text-accent mb-4">Elaborate Test</h3>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-primary">20 Minutes</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>20 modules with 5 questions each</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Comprehensive assessment</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Navigable by clicking answers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>Detailed AI career guidance report</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* What We Assess Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-primary mb-12">
              What We Assess
            </h2>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🎓</div>
                <h4 className="font-bold text-lg text-primary mb-2">Education</h4>
                <p className="text-sm text-gray-600">Academic background and learning style</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">💪</div>
                <h4 className="font-bold text-lg text-primary mb-2">Talents & Skills</h4>
                <p className="text-sm text-gray-600">Natural abilities and developed competencies</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
                <h4 className="font-bold text-lg text-primary mb-2">Family</h4>
                <p className="text-sm text-gray-600">Family background and support system</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">👥</div>
                <h4 className="font-bold text-lg text-primary mb-2">Friends</h4>
                <p className="text-sm text-gray-600">Social network and peer influences</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🌟</div>
                <h4 className="font-bold text-lg text-primary mb-2">Influencers</h4>
                <p className="text-sm text-gray-600">Role models and inspiration sources</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-lg text-primary mb-2">Interests</h4>
                <p className="text-sm text-gray-600">Passions and areas of curiosity</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="font-bold text-lg text-primary mb-2">Cognitive Abilities</h4>
                <p className="text-sm text-gray-600">Problem-solving and analytical thinking</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="text-3xl mb-3">💼</div>
                <h4 className="font-bold text-lg text-primary mb-2">Career Goals</h4>
                <p className="text-sm text-gray-600">Professional aspirations and objectives</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Discover Your Potential?
            </h2>
            <p className="text-xl mb-8">
              Get AI-powered insights and personalized career guidance
            </p>
            <button
              onClick={handleEnter}
              className="bg-white text-primary px-12 py-5 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Your Assessment
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
