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
        <title>Learn Winning - iiskills.cloud</title>
        <meta name="description" content="Develop a winning mindset, success strategies, and achieve your personal and professional goals" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section with Cover Image */}
        <section className="relative">
          {/* Cover Image */}
          <div className="relative w-full h-[500px] md:h-[600px]">
            <img 
              src="/images/coverwinner.png" 
              alt="Learn Winning - Develop a Winning Mindset" 
              className="w-full h-full object-cover"
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Hero Content Over Image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Learn Winning</h1>
                <p className="text-2xl md:text-3xl mb-4 max-w-3xl mx-auto drop-shadow-lg">
                  Develop a winning mindset, success strategies, and achieve your personal and professional goals
                </p>
                
                {/* Pricing Badge */}
                <div className="inline-block bg-accent text-white px-8 py-4 rounded-lg mb-8 shadow-2xl">
                  <div className="text-xl font-semibold mb-1">Book + Course Bundle</div>
                  <div className="text-4xl font-bold">₹99 <span className="text-lg font-normal">+ GST ₹17.82</span></div>
                  <div className="text-sm mt-1 opacity-90">Total: ₹116.82</div>
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
              <InstallApp appName="Learn Winning" />
</div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Preview Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">Course Preview</h2>
            <p className="text-center text-lg text-charcoal mb-12">
              Get free access to Chapter 1, Lesson 1. Full course includes 10 comprehensive chapters!
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-primary mb-4">10 Comprehensive Chapters</h3>
                <p className="text-charcoal">
                  Structured learning modules covering all aspects of developing a winning mindset and success strategies.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Practical Exercises</h3>
                <p className="text-charcoal">
                  Hands-on activities and real-world applications you can implement immediately in your life.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Book + Course Bundle</h3>
                <p className="text-charcoal">
                  Get both the comprehensive book and interactive course for just ₹99 + GST ₹17.82.
                </p>
              </div>
            </div>
            
            {/* Free Preview Notice */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-green-700 mb-2">🎁 Try Before You Buy</h3>
              <p className="text-lg text-gray-700">
                Chapter 1, Lesson 1 is completely FREE! Sign up to preview the course content before purchasing.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-xl mb-6">
              Join thousands of learners developing winning mindsets with iiskills.cloud
            </p>
            
            {/* Pricing Display */}
            <div className="bg-white text-primary rounded-lg p-6 mb-6 inline-block">
              <div className="text-2xl font-bold mb-2">Complete Course Access</div>
              <div className="text-5xl font-bold text-accent mb-2">₹99</div>
              <div className="text-lg mb-1">+ GST ₹17.82</div>
              <div className="text-xl font-semibold border-t-2 border-gray-300 pt-2">Total: ₹116.82</div>
              <p className="text-sm text-gray-600 mt-2">One-time payment • Lifetime access</p>
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
