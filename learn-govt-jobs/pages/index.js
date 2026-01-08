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
        <title>Learn Government Jobs - iiskills.cloud</title>
        <meta name="description" content="Comprehensive preparation for government examinations - UPSC, Banking, Railways, SSC and more" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Learn Government Jobs</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Comprehensive preparation for government examinations - Build strong fundamentals to excel across multiple competitive exams
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              {user ? (
                <Link href="/learn" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                  Continue Learning →
                </Link>
              ) : (
                <>
                  <Link href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                    Get Started
                  </Link>
                  <Link href="/login" className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition">
                    Sign In
                  </Link>
                </>
              )}
              <InstallApp appName="Learn Government Jobs" />
</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">What You'll Get</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Comprehensive Content</h3>
                <p className="text-gray-700">
                  Structured learning materials for UPSC, Banking, Railways, SSC, and other government exams.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-green-600 mb-4">Practice Tests</h3>
                <p className="text-gray-700">
                  Full-length mock tests and subject-wise practice questions with detailed solutions.
                </p>
              </div>

              <div className="bg-purple-50 p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Exam Strategies</h3>
                <p className="text-gray-700">
                  Time management, revision techniques, and proven strategies to crack competitive exams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Coverage Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">Exams We Cover</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🏛️', title: 'UPSC Civil Services', desc: 'IAS, IPS, IFS and other services' },
                { icon: '🏦', title: 'Banking Exams', desc: 'IBPS PO, Clerk, SBI, RBI' },
                { icon: '🚆', title: 'Railway Exams', desc: 'RRB NTPC, Group D, Technical' },
                { icon: '📋', title: 'SSC Exams', desc: 'CGL, CHSL, MTS, JE' },
                { icon: '🗺️', title: 'State PSC', desc: 'Various state government exams' },
                { icon: '🎖️', title: 'Defense Services', desc: 'NDA, CDS, AFCAT' }
              ].map((exam, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-100 hover:border-blue-600 transition">
                  <div className="text-4xl mb-3">{exam.icon}</div>
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{exam.title}</h3>
                  <p className="text-gray-700 text-sm">{exam.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Government Job Preparation?</h2>
            <p className="text-xl mb-8">
              Join thousands of learners preparing for government exams with iiskills.cloud
            </p>
            
            {!user && (
              <Link href="/register" className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
