import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/supabaseClient'

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
        <title>Learn Physics - iiskills.cloud</title>
        <meta name="description" content="Master physics concepts with AI-driven lessons, structured curriculum, and comprehensive testing" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Learn Physics</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Master physics concepts with AI-driven lessons, structured curriculum, and comprehensive testing
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              {user ? (
                <Link href="/learn" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                  Continue Learning →
                </Link>
              ) : (
                <>
                  <Link href="/register" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                    Get Started
                  </Link>
                  <Link href="/login" className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">What You'll Learn</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">⚛️</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Comprehensive Curriculum</h3>
                <p className="text-charcoal">
                  3 levels of physics mastery with 7-10 modules per level, covering everything from classical mechanics to quantum physics.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-primary mb-4">AI-Driven Learning</h3>
                <p className="text-charcoal">
                  AI-generated lessons, quizzes, and tests tailored to help you master each concept effectively.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Visual Progress Tracking</h3>
                <p className="text-charcoal">
                  Track your progress through each level, module, and lesson with intuitive visual indicators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Overview */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">Curriculum Structure</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-green-500">
                <div className="text-4xl mb-4">🟢</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Beginner Level</h3>
                <p className="text-charcoal mb-4">
                  Foundation concepts including:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Kinematics and Motion</li>
                  <li>• Forces and Newton's Laws</li>
                  <li>• Energy and Momentum</li>
                  <li>• Rotational Motion</li>
                  <li>• Gravity and Orbits</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-500">
                <div className="text-4xl mb-4">🔵</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Intermediate Level</h3>
                <p className="text-charcoal mb-4">
                  Advanced topics including:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Waves and Oscillations</li>
                  <li>• Thermodynamics</li>
                  <li>• Electric Fields and Circuits</li>
                  <li>• Magnetism</li>
                  <li>• Electromagnetic Induction</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-purple-500">
                <div className="text-4xl mb-4">🟣</div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Advanced Level</h3>
                <p className="text-charcoal mb-4">
                  Modern physics including:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Electromagnetic Waves</li>
                  <li>• Optics</li>
                  <li>• Special Relativity</li>
                  <li>• Quantum Physics</li>
                  <li>• Nuclear and Particle Physics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Physics Journey?</h2>
            <p className="text-xl mb-8">
              Join thousands of learners advancing their physics knowledge with iiskills.cloud
            </p>
            
            {!user && (
              <Link href="/register" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
