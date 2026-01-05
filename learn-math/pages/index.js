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
        <title>Learn Mathematics - iiskills.cloud</title>
        <meta name="description" content="Master mathematical concepts, problem-solving techniques, and advance your quantitative skills" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Learn Mathematics</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Master mathematical concepts, problem-solving techniques, and advance your quantitative skills
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
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Comprehensive Content</h3>
                <p className="text-charcoal">
                  Structured learning modules designed by experts to take you from beginner to advanced.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Practical Skills</h3>
                <p className="text-charcoal">
                  Hands-on exercises and real-world applications you can use immediately.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Certification</h3>
                <p className="text-charcoal">
                  Earn recognized certificates to showcase your skills and advance your career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-primary text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Journey?</h2>
            <p className="text-xl mb-8">
              Join thousands of learners advancing their skills with iiskills.cloud
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
