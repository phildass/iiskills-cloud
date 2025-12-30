import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>iiskills.cloud - Indian Institute of Professional Skills Development</title>
        <meta name="description" content="Education for All, Online and Affordable. Professional skills development at just ₹99 + GST per course. Part of Viksit Bharat initiative." />
      </Head>
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-white py-16 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left z-10">
                <h1 className="text-5xl font-bold mb-4">iiskills.cloud</h1>
                <h2 className="text-3xl font-semibold mb-6">
                  Indian Institute of Professional Skills Development
                </h2>
                <p className="text-xl mb-8">
                  Education for All, Online and Affordable
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/courses" className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 transition text-center">
                    Explore Courses
                  </Link>
                  <Link href="/certification" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition text-center">
                    Learn About Certification
                  </Link>
                </div>
              </div>
              <div className="flex-1 relative z-10">
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <Image 
                    src="/images/iiskills-image1.jpg" 
                    alt="Students learning together on iiskills.cloud platform" 
                    width={800} 
                    height={600} 
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Purpose & Vision Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-8">Our Vision for Viksit Bharat</h2>
            
            {/* Featured Student Image */}
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/images/iiskills-image2.jpg" 
                  alt="Empowered student ready to learn and succeed" 
                  width={600} 
                  height={800} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">🇮🇳 Building a Developed India</h3>
                <p className="text-charcoal leading-relaxed">
                  We are committed to the vision of <strong>Viksit Bharat</strong> (Developed India) by empowering every Indian citizen with the skills needed for personal and professional growth. Our mission is to bridge the skill gap and create opportunities for all.
                </p>
              </div>
              
              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">🎯 Skill Enhancement Mission</h3>
                <p className="text-charcoal leading-relaxed">
                  We believe in democratizing education and making quality skill development accessible to everyone. Every course is designed to provide <strong>immediately applicable professional and personal skills</strong> that transform careers and lives.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">🌟 Opportunity for All</h3>
                <p className="text-charcoal leading-relaxed">
                  Every Indian deserves the opportunity to upgrade their abilities and unlock their potential. We provide pathways to success regardless of background, location, or economic status.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">💪 Empowerment Through Learning</h3>
                <p className="text-charcoal leading-relaxed">
                  Knowledge is power. By equipping individuals with modern skills and competencies, we enable them to compete globally, contribute to India's development, and achieve their dreams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Value Proposition Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-primary mb-4">Why Choose iiskills.cloud?</h2>
                <p className="text-xl text-charcoal mb-6">Quality education that's accessible to everyone</p>
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="/images/iiskills-image3.jpg" 
                    alt="Confident learner ready to transform their future" 
                    width={600} 
                    height={800} 
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-6">
              {/* Affordability */}
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Unbeatable Affordability</h3>
                <div className="mb-4">
                  <div className="text-4xl font-bold text-accent">₹99</div>
                  <div className="text-gray-600">+ 18% GST</div>
                  <div className="text-3xl font-bold text-primary mt-2">= ₹117</div>
                  <div className="text-sm text-gray-600 mt-2">Per Course</div>
                </div>
                <p className="text-charcoal">
                  Premium quality courses at a price anyone in India can afford. No hidden fees, no subscriptions.
                </p>
              </div>

              {/* Accessibility */}
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Truly Accessible</h3>
                <ul className="text-left space-y-3 text-charcoal">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span><strong>100% Online:</strong> Learn from anywhere, anytime</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span><strong>Basic English:</strong> Simple language, easy to understand</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span><strong>Local Languages:</strong> Use browser translation for your language</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">✓</span>
                    <span><strong>Mobile Friendly:</strong> Learn on any device</span>
                  </li>
                </ul>
              </div>

              {/* Practical Skills */}
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-primary mb-4">Immediately Applicable</h3>
                <p className="text-charcoal mb-4">
                  Every course focuses on <strong>practical, real-world skills</strong> you can use right away:
                </p>
                <ul className="text-left space-y-2 text-charcoal">
                  <li>• Professional communication</li>
                  <li>• Digital marketing & tech skills</li>
                  <li>• Leadership & management</li>
                  <li>• Personal development</li>
                  <li>• Career advancement tools</li>
                </ul>
              </div>
                </div>
              </div>
            </div>


          </div>
        </section>

        {/* Featured Courses Preview */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">Featured Courses</h2>
            <p className="text-xl text-center text-charcoal mb-12">Start your learning journey today - Many FREE courses available!</p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
                <h3 className="font-bold text-xl mb-3 text-primary">Learn AI</h3>
                <p className="text-charcoal mb-4">Discover Artificial Intelligence fundamentals and practical applications.</p>
                <div className="text-sm text-gray-600 mb-4">
                  <span>⏱️ 10 weeks</span> • <span className="text-accent font-semibold">Beginner</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                  <p className="text-xs text-green-800 font-semibold">🎁 Free Sample Module</p>
                </div>
                <Link href="/courses" className="block text-center bg-primary text-white py-2 rounded font-medium hover:bg-blue-700 transition">
                  View Details
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-full text-2xl font-bold z-20 shadow-2xl blink-animation">
                  FREE
                </div>
                <h3 className="font-bold text-xl mb-3 text-primary">Learn Aptitude</h3>
                <p className="text-charcoal mb-4">Develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams.</p>
                <div className="text-sm text-gray-600 mb-4">
                  <span>⏱️ 10 weeks</span> • <span className="text-accent font-semibold">Beginner</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                  <p className="text-xs text-green-800 font-semibold">🎁 Free Sample Module</p>
                </div>
                <Link href="/courses" className="block text-center bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition">
                  Start Free Course
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-accent">
                <h3 className="font-bold text-xl mb-3 text-primary">Learn PR</h3>
                <p className="text-charcoal mb-4">Master Public Relations strategies, media management, and brand building.</p>
                <div className="text-sm text-gray-600 mb-4">
                  <span>⏱️ 10 weeks</span> • <span className="text-accent font-semibold">Beginner</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                  <p className="text-xs text-green-800 font-semibold">🎁 Free Sample Module</p>
                </div>
                <Link href="/courses" className="block text-center bg-accent text-white py-2 rounded font-medium hover:bg-purple-600 transition">
                  View Details
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link href="/courses" className="inline-block bg-accent text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 transition shadow-lg">
                Browse All 50+ Courses →
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
                <p className="text-2xl mb-8">
                  Join thousands of learners building skills for tomorrow
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/courses" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
                    Get Started Now
                  </Link>
                  <Link href="/about" className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition">
                    Learn More About Us
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <Image 
                    src="/images/iiskills-image4.jpg" 
                    alt="Diverse community of learners achieving success together" 
                    width={800} 
                    height={600} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}