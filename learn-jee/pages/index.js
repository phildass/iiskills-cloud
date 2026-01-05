import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/supabaseClient'
import { getPricingDisplay, getIntroOfferNotice } from '../utils/pricing'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pricing = getPricingDisplay()
  const introNotice = getIntroOfferNotice()

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
        <title>Learn JEE - iiskills.cloud</title>
        <meta name="description" content="Master JEE preparation with AI-generated lessons covering Physics, Chemistry, and Mathematics. Free preview of first chapter available!" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Learn JEE</h1>
            <p className="text-2xl md:text-3xl mb-4 max-w-3xl mx-auto">
              Master Physics, Chemistry, and Mathematics for JEE success
            </p>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              AI-generated lessons, comprehensive quizzes, and structured learning path to help you ace JEE
            </p>
            
            {/* Pricing Badge */}
            <div className="inline-block bg-white text-primary px-8 py-4 rounded-lg mb-8 shadow-2xl">
              <div className="text-xl font-semibold mb-1">Complete JEE Course</div>
              <div className="text-4xl font-bold">{pricing.basePrice} <span className="text-lg font-normal">+ GST {pricing.gstAmount}</span></div>
              <div className="text-sm mt-1 text-gray-700">Total: {pricing.totalPrice}</div>
              {pricing.isIntroductory && (
                <div className="text-xs mt-2 text-green-600 font-semibold">
                  Introductory Offer until {pricing.introEndDate}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {user ? (
                <Link href="/learn" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                  Continue Learning →
                </Link>
              ) : (
                <>
                  <Link href="/register" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                    Get Started Free
                  </Link>
                  <Link href="/login" className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Introductory Offer Banner */}
        {introNotice && (
          <section className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <p className="text-lg font-semibold">{introNotice}</p>
            </div>
          </section>
        )}

        {/* Course Preview Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">What You'll Learn</h2>
            <p className="text-center text-lg text-charcoal mb-12">
              Get free access to the first lesson. Full course includes comprehensive coverage of all JEE topics!
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-neutral p-8 rounded-lg shadow-lg border-t-4 border-blue-500">
                <div className="text-5xl mb-4">⚛️</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Physics</h3>
                <p className="text-charcoal mb-4">
                  Master mechanics, thermodynamics, electromagnetism, optics, and modern physics with AI-generated lessons and practice problems.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mechanics & Motion</li>
                  <li>• Thermodynamics</li>
                  <li>• Electromagnetism</li>
                  <li>• Modern Physics</li>
                </ul>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg border-t-4 border-green-500">
                <div className="text-5xl mb-4">🧪</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Chemistry</h3>
                <p className="text-charcoal mb-4">
                  Complete coverage of physical, organic, and inorganic chemistry with reactions, mechanisms, and problem-solving techniques.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Physical Chemistry</li>
                  <li>• Organic Chemistry</li>
                  <li>• Inorganic Chemistry</li>
                  <li>• Chemical Reactions</li>
                </ul>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg border-t-4 border-purple-500">
                <div className="text-5xl mb-4">📐</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Mathematics</h3>
                <p className="text-charcoal mb-4">
                  Advanced algebra, calculus, coordinate geometry, and trigonometry with step-by-step problem-solving strategies.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Algebra & Calculus</li>
                  <li>• Coordinate Geometry</li>
                  <li>• Trigonometry</li>
                  <li>• Problem Solving</li>
                </ul>
              </div>
            </div>
            
            {/* Free Preview Notice */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-2">🎁 Try Before You Buy</h3>
              <p className="text-lg text-gray-700">
                The first lesson is completely FREE! Sign up to preview the course content before purchasing.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">Course Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI-Generated Content</h3>
                <p className="text-gray-600">Intelligent lessons and quizzes tailored to JEE syllabus</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">Comprehensive Coverage</h3>
                <p className="text-gray-600">All topics from Physics, Chemistry, and Mathematics</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Practice Quizzes</h3>
                <p className="text-gray-600">Test your knowledge with topic-wise assessments</p>
              </div>
              
              <div className="text-center">
                <div className="text-5xl mb-4">⏱️</div>
                <h3 className="text-xl font-bold mb-2">Exam Strategies</h3>
                <p className="text-gray-600">Learn time management and problem-solving techniques</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your JEE Preparation?</h2>
            <p className="text-xl mb-6">
              Join thousands of JEE aspirants preparing with AI-powered learning
            </p>
            
            {/* Pricing Display */}
            <div className="bg-white text-primary rounded-lg p-6 mb-6 inline-block">
              <div className="text-2xl font-bold mb-2">Complete Course Access</div>
              <div className="text-5xl font-bold text-accent mb-2">{pricing.basePrice}</div>
              <div className="text-lg mb-1">+ GST {pricing.gstAmount}</div>
              <div className="text-xl font-semibold border-t-2 border-gray-300 pt-2">Total: {pricing.totalPrice}</div>
              <p className="text-sm text-gray-600 mt-2">One-time payment • Lifetime access • Free first lesson</p>
            </div>
            
            {!user && (
              <div>
                <Link href="/register" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                  Start Free Preview
                </Link>
                <p className="text-sm mt-3 opacity-90">No credit card required for preview</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
