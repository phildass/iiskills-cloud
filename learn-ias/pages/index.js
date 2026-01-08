import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/supabaseClient'
import { getAllPhases, getOptionalSubjects } from '../lib/iasSyllabus'
import Footer from '../components/Footer'
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

  const phases = getAllPhases()
  const optionals = getOptionalSubjects()

  return (
    <>
      <Head>
        <title>Learn IAS - UPSC Civil Services Preparation | iiskills.cloud</title>
        <meta name="description" content="Comprehensive UPSC IAS preparation with AI-powered content, mock interviews, daily practice tests, and personalized study plans. Master General Studies, Optional Subjects, and Ethics." />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-r from-primary via-accent to-secondary">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Learn IAS</h1>
                <p className="text-2xl md:text-3xl mb-4 max-w-3xl mx-auto drop-shadow-lg">
                  Your Complete UPSC Civil Services Preparation Platform
                </p>
                <p className="text-xl mb-6 max-w-2xl mx-auto drop-shadow-lg">
                  AI-powered lessons, mock interviews, daily practice tests, and comprehensive coverage of all GS papers
                </p>
                
                {/* Pricing Badge */}
                <div className="inline-block bg-white text-primary px-8 py-4 rounded-lg mb-8 shadow-2xl">
                  <div className="text-xl font-semibold mb-1">Annual Subscription</div>
                  <div className="text-4xl font-bold">₹99 <span className="text-lg font-normal">+ GST ₹17.82</span></div>
                  <div className="text-sm mt-1 text-gray-700">Total: ₹116.82/year</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  {user ? (
                    <Link href="/learn" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                      Go to Dashboard →
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
<InstallApp appName="Learn IAS" />
</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-neutral">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Key Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3 text-charcoal">Comprehensive Coverage</h3>
                <p className="text-gray-600">
                  Complete syllabus coverage from Foundation to Prelims & Mains preparation
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-3 text-charcoal">AI-Powered Learning</h3>
                <p className="text-gray-600">
                  Daily AI-generated content, personalized study plans, and adaptive test generation
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-bold mb-3 text-charcoal">Mock Interviews</h3>
                <p className="text-gray-600">
                  AI-powered personality test simulation with detailed feedback
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold mb-3 text-charcoal">Answer Evaluation</h3>
                <p className="text-gray-600">
                  AI evaluation of mains answers with constructive feedback
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold mb-3 text-charcoal">Mobile & Web</h3>
                <p className="text-gray-600">
                  Learn anywhere with seamless mobile and web accessibility
                </p>
              </div>
              
              <div className="card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-3 text-charcoal">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your progress across all phases and modules
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Course Structure Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">Course Structure</h2>
            
            <div className="space-y-6">
              {phases.map((phase, index) => (
                <div key={phase.id} className="card">
                  <div className="flex items-start">
                    <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-2 text-charcoal">{phase.name}</h3>
                      <p className="text-gray-600 mb-3">{phase.description}</p>
                      {phase.duration && (
                        <p className="text-sm text-primary font-semibold mb-3">Duration: {phase.duration}</p>
                      )}
                      {phase.modules && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Modules: {phase.modules.length}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {phase.modules.slice(0, 5).map(module => (
                              <span key={module.id} className="bg-neutral px-3 py-1 rounded-full text-sm text-gray-700">
                                {module.name}
                              </span>
                            ))}
                            {phase.modules.length > 5 && (
                              <span className="bg-neutral px-3 py-1 rounded-full text-sm text-gray-700">
                                +{phase.modules.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {phase.availableOptionals && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            {phase.availableOptionals.length} Optional Subjects Available
                          </p>
                          <p className="text-xs text-gray-600 italic">{phase.note}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Optional Subjects Section */}
        <section className="py-16 px-4 bg-neutral">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-charcoal">Optional Subjects</h2>
            <p className="text-center text-gray-600 mb-8">
              Choose one optional subject for comprehensive Mains preparation
            </p>
            <p className="text-center text-sm text-primary font-semibold mb-8">
              Note: Only English Literature is included from Indian Literature group (no other Indian languages)
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optionals.map(optional => (
                <div key={optional.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <h3 className="font-bold text-charcoal mb-2">{optional.name}</h3>
                  <p className="text-sm text-gray-600">
                    {optional.papers?.join(', ')}
                  </p>
                  {optional.note && (
                    <p className="text-xs text-primary mt-2 italic">{optional.note}</p>
                  )}
                  <span className="inline-block mt-2 text-xs bg-neutral px-2 py-1 rounded text-gray-600">
                    {optional.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-charcoal">AI-Powered Features</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card border-l-4 border-primary">
                <h3 className="text-xl font-bold mb-3 text-charcoal">Daily AI-Generated Content</h3>
                <p className="text-gray-600 mb-2">
                  Personalized daily lessons and current affairs updates tailored to your progress
                </p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Planned Feature</span>
              </div>
              
              <div className="card border-l-4 border-secondary">
                <h3 className="text-xl font-bold mb-3 text-charcoal">Adaptive Test Generation</h3>
                <p className="text-gray-600 mb-2">
                  AI creates tests based on your performance and identifies weak areas
                </p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Planned Feature</span>
              </div>
              
              <div className="card border-l-4 border-accent">
                <h3 className="text-xl font-bold mb-3 text-charcoal">AI Mock Interviews</h3>
                <p className="text-gray-600 mb-2">
                  Simulated personality test interviews with comprehensive AI feedback
                </p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Planned Feature</span>
              </div>
              
              <div className="card border-l-4 border-primary">
                <h3 className="text-xl font-bold mb-3 text-charcoal">Answer Evaluation</h3>
                <p className="text-gray-600 mb-2">
                  AI-powered evaluation of mains answers with detailed improvement suggestions
                </p>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Planned Feature</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Start Your IAS Journey Today</h2>
            <p className="text-xl mb-8">
              Join thousands of aspirants preparing for UPSC Civil Services with our AI-powered platform
            </p>
            <p className="text-2xl font-bold mb-8">
              Just ₹116.82/year - Best investment in your future
            </p>
            {!user && (
              <Link href="/register" className="inline-block bg-white text-primary px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition shadow-lg">
                Get Started Now →
              </Link>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
