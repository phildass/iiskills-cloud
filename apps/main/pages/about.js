import Head from 'next/head'
import { getPricingDisplay } from '../utils/pricing'

export default function About() {
  const pricing = getPricingDisplay()
  return (
    <>
      <Head>
        <title>About Us - iiskills.cloud</title>
        <meta name="description" content="Learn about iiskills.cloud and AI Cloud Enterprises' mission to democratize education in India" />
      </Head>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">About Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-lg text-charcoal leading-relaxed mb-4">
            <strong>iiskills.cloud</strong> is the digital gateway for the <strong>Indian Institute of Professional Skills Development</strong>, a transformative initiative dedicated to making quality education accessible and affordable for every Indian.
          </p>
          <p className="text-lg text-charcoal leading-relaxed">
            We are committed to fostering career advancement and skill certification for India's workforce and enterprises through innovative technology, expert instruction, and a deep commitment to excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
            <p className="leading-relaxed mb-4">
              To empower every Indian with professional skills and technology-led learning platforms that enable career growth and personal development.
            </p>
            <p className="leading-relaxed">
              We believe in democratizing education by making it affordable ({pricing.totalPrice} per course{pricing.isIntroductory ? ', introductory offer until ' + pricing.introEndDate : ''}), accessible online, and focused on immediately applicable skills.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-accent to-purple-700 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🌟 Our Vision</h2>
            <p className="leading-relaxed mb-4">
              To contribute to <strong>Viksit Bharat</strong> (Developed India) by bridging the skill gap and creating opportunities for millions of Indians to upgrade their abilities and achieve their potential.
            </p>
            <p className="leading-relaxed">
              We envision an India where quality education is a right, not a privilege, and where every individual has the tools to succeed in the modern economy.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6">💎 Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">Integrity & Excellence</h3>
              <p className="text-charcoal">We maintain the highest standards in education delivery and never compromise on quality, even at affordable prices.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">Innovation & Lifelong Learning</h3>
              <p className="text-charcoal">We continuously evolve our content and methods to stay relevant in a rapidly changing world.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">Diversity & Inclusion</h3>
              <p className="text-charcoal">We celebrate India's diversity and ensure our platform is accessible to learners from all backgrounds and regions.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary mb-2">Collaboration & Community</h3>
              <p className="text-charcoal">We build a supportive learning community where students help each other grow and succeed together.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">About AI Cloud Enterprises</h2>
          <p className="text-charcoal leading-relaxed mb-4">
            <strong>iiskills.cloud</strong> is a flagship project of <a href="https://aienter.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">AI Cloud Enterprises (AIEnter.in)</a>, a technology company dedicated to leveraging artificial intelligence and cloud technologies to solve real-world problems.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">📞 Contact Information</h2>
          <div className="space-y-2 mb-6">
            <p className="text-lg">Email: <a href="mailto:info@iiskills.cloud" className="underline hover:text-gray-200">info@iiskills.cloud</a></p>
            <p className="text-lg">Location: Indiranagar, Bengaluru</p>
          </div>
          <a href="/contact" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Contact Us
          </a>
        </div>
      </main>
    </>
  )
}
