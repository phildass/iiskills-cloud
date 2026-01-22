import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../../components/shared/InstallApp";

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
        <title>Learn Aptitude - Free Aptitude Learning Portal | Indian Institute of Professional Skills Development</title>
        <meta
          name="description"
          content="A portal for free aptitude learning, quizzes, stats, events, and more! Develop your quantitative, logical, and verbal reasoning skills."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-blue-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">Learn Aptitude</h1>
            
            <p className="text-lg mb-6 font-medium tracking-wide">
              Indian Institute of Professional Skills Development
            </p>
            
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              A portal for free learning, quizzes, stats, events, and more!
            </p>

            {!user && (
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl p-8 mb-10 max-w-2xl mx-auto">
                <p className="text-lg font-semibold mb-3">📝 Free Registration - Save Your Progress</p>
                
                <p className="text-base mt-3 leading-relaxed opacity-95">
                  Create a free account to save your scores, track progress, and personalize your experience.
                </p>
                
                <p className="text-base mt-2 leading-relaxed opacity-95">
                  All features are free for registered users!
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12">
              {user ? (
                <Link
                  href="/learn"
                  className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 transition shadow-lg"
                >
                  Explore Learning Portal →
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 transition shadow-lg"
                  >
                    Register Free Account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-white hover:text-primary transition"
                  >
                    Already Have Account? Sign In
                  </Link>
                </>
              )}
              <InstallApp appName="Learn Aptitude" />
            </div>
          </div>
        </section>

        {/* Test Options Section - Two Distinct Tests */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-primary mb-5 leading-tight">
                Choose Your Assessment Path
              </h2>
              
              <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Select the assessment that best fits your time and goals.
              </p>
              
              <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-2 leading-relaxed">
                Both tests provide valuable insights into your aptitude and learning style.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Short Test Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-primary">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-8 text-white text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-5xl">⚡</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 leading-tight">Short Assessment</h3>
                  
                  <div>
                    <p className="text-4xl font-extrabold mb-1">12</p>
                    <p className="text-base opacity-90">Questions</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">⏱️</span>
                      <p className="text-base font-medium text-gray-800">~7 minutes</p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📋</span>
                      <p className="text-base font-medium text-gray-800">4 focused modules</p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🎯</span>
                      <p className="text-base font-medium text-gray-800">Quick insights</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-5 rounded-lg mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Perfect for a quick overview of your learning preferences, problem-solving style, motivation drivers, and numerical reasoning abilities.
                    </p>
                  </div>
                  
                  <Link
                    href="/brief-test"
                    className="block w-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-center px-6 py-3 rounded-lg font-semibold text-base hover:from-green-600 hover:to-teal-600 transition-all shadow-lg transform hover:scale-105"
                  >
                    Start Short Test →
                  </Link>
                </div>
              </div>

              {/* Elaborate Test Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-accent">
                <div className="bg-gradient-to-r from-accent via-purple-600 to-primary p-8 text-white text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-5xl">🎓</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 leading-tight">Elaborate Assessment</h3>
                  
                  <div>
                    <p className="text-4xl font-extrabold mb-1">200</p>
                    <p className="text-base opacity-90">Questions</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">⏱️</span>
                      <p className="text-base font-medium text-gray-800">~40-50 minutes</p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xl mr-3">📚</span>
                      <p className="text-base font-medium text-gray-800">20 comprehensive modules</p>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💎</span>
                      <p className="text-base font-medium text-gray-800">Deep analysis</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-5 rounded-lg mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Comprehensive evaluation covering learning styles, cognitive patterns, aptitude areas, professional skills, and personal effectiveness for detailed insights.
                    </p>
                  </div>
                  
                  <Link
                    href="/elaborate-test"
                    className="block w-full bg-gradient-to-r from-accent via-purple-600 to-primary text-white text-center px-6 py-3 rounded-lg font-semibold text-base hover:opacity-90 transition-all shadow-lg transform hover:scale-105"
                  >
                    Start Elaborate Test →
                  </Link>
                </div>
              </div>
            </div>

            {/* Comparison Note */}
            <div className="mt-14 max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border-l-4 border-primary">
              <div className="flex items-start">
                <div className="text-2xl mr-4">💡</div>
                <div>
                  <h4 className="font-bold text-lg text-primary mb-3 leading-tight">
                    Not sure which to choose?
                  </h4>
                  
                  <p className="text-gray-700 leading-relaxed">
                    Start with the <strong>Short Assessment</strong> for a quick snapshot, then take the <strong>Elaborate Assessment</strong> when you have more time for comprehensive insights.
                  </p>
                  
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    Both tests are free and your results are saved!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-primary text-center mb-12 leading-tight">
              What&apos;s Inside
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-neutral p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-5">🧮</div>
                
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                  Quantitative Aptitude
                </h3>
                
                <p className="text-charcoal leading-relaxed">
                  Master numerical reasoning, arithmetic, algebra, geometry, and data interpretation 
                  with comprehensive lessons and practice problems.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-5">🧠</div>
                
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                  Logical Reasoning
                </h3>
                
                <p className="text-charcoal leading-relaxed">
                  Develop critical thinking skills with puzzles, patterns, coding-decoding, 
                  blood relations, and analytical reasoning exercises.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-5">📝</div>
                
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                  Verbal Reasoning
                </h3>
                
                <p className="text-charcoal leading-relaxed">
                  Enhance vocabulary, comprehension, grammar, and verbal logic through 
                  interactive exercises and real-world applications.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-5">📊</div>
                
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                  Interactive Quizzes
                </h3>
                
                <p className="text-charcoal leading-relaxed">
                  Test your knowledge with timed quizzes, track your performance, 
                  and identify areas for improvement with detailed analytics.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-5">📈</div>
                
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                  Progress Tracking
                </h3>
                
                <p className="text-charcoal leading-relaxed">
                  Monitor your learning journey with comprehensive stats, personalized insights, 
                  and achievement milestones to keep you motivated.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-5">🎯</div>
                
                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                  Exam Preparation
                </h3>
                
                <p className="text-charcoal leading-relaxed">
                  Prepare for competitive exams with topic-wise tests, previous year questions, 
                  and expert tips to boost your confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-5 leading-tight">Ready to Begin?</h2>
            
            <p className="text-lg mb-8 leading-relaxed">
              Join thousands of learners and start your aptitude development journey today
            </p>

            {!user && (
              <Link
                href="/register"
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 transition shadow-lg"
              >
                Create Free Account
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
