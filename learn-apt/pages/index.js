import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCurrentUser } from "../lib/supabaseClient";
import InstallApp from "../../components/shared/InstallApp";
import TranslationFeatureBanner from "../../components/shared/TranslationFeatureBanner";
import { Zap, Microscope } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
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

      <main className="min-h-screen bg-gradient-radial from-slate-50 to-slate-200">
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
                    href="/learn"
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
        {/* Translation Feature Banner */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <TranslationFeatureBanner />
          </div>
        </section>

        {/* Test Options Section - Two Distinct Tests */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="text-4xl font-bold text-gray-900 mb-5 leading-tight">
                Choose Your Assessment Path
              </h2>
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Select the assessment that best fits your time and goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Card A - Express Assessment (The Sprint) */}
              <div className="relative group">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border-2 border-emerald-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500">
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-emerald-500/20 p-4 rounded-full">
                      <Zap className="w-12 h-12 text-emerald-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 text-center">Express Assessment</h3>
                  
                  <p className="text-center text-gray-600 text-lg mb-6">
                    12 Questions | 5 Minutes
                  </p>
                  
                  <div className="bg-white/50 p-5 rounded-lg mb-6 backdrop-blur-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Perfect for a quick snapshot of your aptitude. Get instant insights into your problem-solving abilities and reasoning skills.
                    </p>
                  </div>
                  
                  <Link
                    href="/brief-test"
                    className="block w-full bg-emerald-500 text-white text-center px-6 py-3 rounded-lg font-semibold text-base hover:bg-emerald-600 transition-all shadow-lg motion-safe:animate-pulse hover:animate-none"
                  >
                    Start →
                  </Link>
                </div>
              </div>

              {/* Card B - Professional Diagnostic (The Deep Dive) */}
              <div className="relative group">
                {/* Most Accurate Badge */}
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  Most Accurate
                </div>
                
                {/* Gold gradient border wrapper */}
                <div className="p-[2px] bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative bg-slate-900 rounded-2xl p-8 shadow-lg overflow-hidden">
                    {/* Shimmer effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full motion-safe:group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-6">
                        <div className="bg-amber-500/20 p-4 rounded-full">
                          <Microscope className="w-12 h-12 text-amber-400" />
                        </div>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-white mb-3 text-center">Professional Diagnostic</h3>
                      
                      <p className="text-center text-gray-300 text-lg mb-6">
                        100+ Questions | 45 Minutes
                      </p>
                      
                      <div className="bg-slate-800/50 p-5 rounded-lg mb-6 backdrop-blur-sm">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          Comprehensive evaluation covering learning styles, cognitive patterns, and professional skills for detailed, accurate insights.
                        </p>
                      </div>
                      
                      <Link
                        href="/elaborate-test"
                        className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center px-6 py-3 rounded-lg font-semibold text-base hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                      >
                        Start →
                      </Link>
                    </div>
                  </div>
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
