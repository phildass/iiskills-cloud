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
        <title>Learn Your Aptitude - iiskills.cloud</title>
        <meta name="description" content="Learn Your Aptitude - Master logical reasoning, quantitative aptitude, and analytical skills. Part of Indian Institute of Professional Skills Development." />
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
      />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-primary mb-6">
              Welcome to Learn Your Aptitude
            </h1>
            
            <p className="text-2xl text-charcoal mb-8 leading-relaxed">
              Master logical reasoning, quantitative aptitude, and analytical skills 
              essential for competitive exams and career success.
            </p>
            
            <div className="bg-white p-8 rounded-2xl shadow-2xl mb-12">
              <p className="text-lg text-gray-700 mb-6">
                This comprehensive aptitude learning platform is designed to help you 
                develop critical thinking and problem-solving abilities. Whether you're 
                preparing for competitive exams, job interviews, or simply want to 
                sharpen your mind, you've come to the right place.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-4xl mb-3">🧮</div>
                  <h3 className="font-bold text-lg mb-2 text-primary">Quantitative Skills</h3>
                  <p className="text-sm text-gray-600">Master numerical reasoning and mathematics</p>
                </div>
                
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="font-bold text-lg mb-2 text-accent">Logical Reasoning</h3>
                  <p className="text-sm text-gray-600">Develop analytical and critical thinking</p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-bold text-lg mb-2 text-green-600">Data Interpretation</h3>
                  <p className="text-sm text-gray-600">Analyze charts, graphs, and tables</p>
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
        
        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of learners improving their aptitude skills
            </p>
            <button
              onClick={handleEnter}
              className="bg-white text-primary px-12 py-5 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Begin Your Journey
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
