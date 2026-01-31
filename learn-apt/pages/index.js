import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../components/shared/InstallApp";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  return (
    <>
      <Head>
        <title>Learn Your Aptitude - iiskills.cloud</title>
        <meta
          name="description"
          content="Discover your strengths with our comprehensive aptitude assessment. Choose between quick or elaborate testing to unlock your potential."
        />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-6xl mx-auto px-4 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                  Learn Your Aptitude
                </h1>
                <p className="text-2xl md:text-3xl mb-4 max-w-3xl mx-auto drop-shadow-lg">
                  Discover your strengths with AI-powered aptitude assessments
                </p>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                  Indian Institute of Professional Skills Development
                </p>
                
                {!loading && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {user ? (
                      <Link
                        href="/learn"
                        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition shadow-xl"
                      >
                        Start Assessment
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/register"
                          className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition shadow-xl"
                        >
                          Get Started Free
                        </Link>
                        <Link
                          href="/login"
                          className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-white hover:text-blue-600 transition shadow-xl"
                        >
                          Sign In
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Assessment Options Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">Choose Your Assessment</h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Select the assessment that best fits your time and needs
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Short Assessment Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-1">
                <div className="text-center mb-6">
                  <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Short Assessment</h3>
                  <p className="text-gray-600 mb-4">Quick insights into your aptitude</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>12 carefully selected questions</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Approximately 7 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Core competency overview</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Instant results</span>
                  </div>
                </div>

                <Link
                  href={user ? "/learn?mode=short" : "/register"}
                  className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Start Short Assessment
                </Link>
              </div>

              {/* Elaborate Assessment Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-1 border-2 border-purple-500">
                <div className="text-center mb-6">
                  <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                    <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Elaborate Assessment</h3>
                  <p className="text-gray-600 mb-4">Comprehensive aptitude analysis</p>
                  <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>200 comprehensive questions</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>40-50 minutes duration</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Detailed skill breakdown</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>AI-powered career guidance</span>
                  </div>
                </div>

                <Link
                  href={user ? "/learn?mode=elaborate" : "/register"}
                  className="block w-full text-center bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition"
                >
                  Start Elaborate Assessment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">What You'll Master</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="inline-block bg-indigo-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Quantitative Aptitude</h3>
                <p className="text-gray-600">Master numerical reasoning and problem-solving</p>
              </div>

              <div className="text-center p-6">
                <div className="inline-block bg-blue-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Logical Reasoning</h3>
                <p className="text-gray-600">Enhance your analytical and critical thinking</p>
              </div>

              <div className="text-center p-6">
                <div className="inline-block bg-purple-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Verbal Reasoning</h3>
                <p className="text-gray-600">Improve comprehension and communication skills</p>
              </div>

              <div className="text-center p-6">
                <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Data Interpretation</h3>
                <p className="text-gray-600">Learn to analyze and interpret complex data</p>
              </div>

              <div className="text-center p-6">
                <div className="inline-block bg-yellow-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pattern Recognition</h3>
                <p className="text-gray-600">Identify sequences and solve pattern-based problems</p>
              </div>

              <div className="text-center p-6">
                <div className="inline-block bg-red-100 rounded-full p-4 mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Speed Mathematics</h3>
                <p className="text-gray-600">Master quick calculation techniques</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Potential?</h2>
            <p className="text-xl mb-8">
              Join thousands of learners who have unlocked their career path with our AI-powered aptitude assessments
            </p>
            {!user && (
              <Link
                href="/register"
                className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition shadow-xl"
              >
                Start Your Free Assessment
              </Link>
            )}
          </div>
        </section>

        {/* Install App Component */}
        <InstallApp />
      </main>
    </>
  );
}
