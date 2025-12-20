import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Certification() {
  return (
    <>
      <Head>
        <title>Certification - iiskills.cloud</title>
        <meta name="description" content="Learn about our certification process and requirements at iiskills.cloud" />
      </Head>
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Certification Information</h1>
        <p className="text-xl text-center text-charcoal mb-12">
          Earn recognized certifications that validate your skills
        </p>

        {/* Certification Requirements */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-4">📋 Certification Requirements</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">1</div>
              <div>
                <h3 className="font-bold text-lg text-charcoal">Complete the Course</h3>
                <p className="text-gray-600">Finish all modules and learning materials in your enrolled course.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">2</div>
              <div>
                <h3 className="font-bold text-lg text-charcoal">Take the Assessment</h3>
                <p className="text-gray-600">Complete the comprehensive assessment test for your course.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold mr-4">3</div>
              <div>
                <h3 className="font-bold text-lg text-charcoal">Score Minimum 50%</h3>
                <p className="text-gray-600">Achieve at least 50% marks to qualify for certification.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold mr-4">4</div>
              <div>
                <h3 className="font-bold text-lg text-charcoal">Receive Your Certificate</h3>
                <p className="text-gray-600">Get your digital certificate immediately upon passing.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Over Certificates */}
        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 Skills Matter More Than Certificates</h2>
          <p className="text-lg mb-4">
            While we're proud to offer certification, <strong>the real value lies in the skills you master</strong>.
          </p>
          <p className="mb-4">
            Our testing process is designed to ensure genuine mastery of the subject matter, not just memorization. We want you to:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Truly understand the concepts and techniques</li>
            <li>Be able to apply your learning in real-world situations</li>
            <li>Gain confidence in your abilities</li>
            <li>Build skills that will advance your career</li>
          </ul>
          <p className="mt-4 font-semibold">
            The certificate validates your achievement, but your enhanced capabilities are what truly matter.
          </p>
        </div>

        {/* Testing Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-4">🎯 Testing Process</h2>
          <p className="text-charcoal mb-4">
            Our assessments are carefully designed to test your understanding and practical application of course material:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span><strong>Comprehensive Coverage:</strong> Questions span all key topics in the course</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span><strong>Multiple Question Types:</strong> Multiple choice, scenario-based, and practical questions</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span><strong>Fair Time Limits:</strong> Adequate time to demonstrate your knowledge</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span><strong>Immediate Results:</strong> Know your score and certification status instantly</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">✓</span>
              <span><strong>Retake Options:</strong> Can retake the test if you don't pass on first attempt</span>
            </li>
          </ul>
        </div>

        {/* Practice-Based Courses */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded mb-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">✍️ For Writing & Creative Courses</h2>
          <p className="text-yellow-900 mb-4">
            For practice-based courses like <strong>Creative Writing, Content Writing, Journalism,</strong> and <strong>Public Relations</strong>:
          </p>
          <div className="bg-white p-4 rounded mb-4">
            <h3 className="font-bold text-lg text-yellow-800 mb-2">Strong Encouragement to Practice</h3>
            <p className="text-gray-700 mb-3">
              We <strong>strongly encourage</strong> you to practice writing and creating original material <strong>without dependency on AI tools</strong>.
            </p>
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Develop your unique voice and style</li>
              <li>Build genuine creative thinking skills</li>
              <li>Learn to overcome writer's block naturally</li>
              <li>Create portfolio pieces you're truly proud of</li>
              <li>Master the craft through personal effort</li>
            </ul>
          </div>
          <p className="text-yellow-900 font-semibold">
            While AI tools can be helpful for editing and refinement, the core creative work should come from you. This is how you truly develop as a writer or content creator.
          </p>
        </div>

        {/* Certificate Sample */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-4">🏆 Your Digital Certificate</h2>
          <p className="text-charcoal mb-4">
            Upon successful completion, you'll receive a digital certificate that includes:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              <span>Your name and achievement date</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              <span>Course name and skill area</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              <span>Unique certificate ID for verification</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              <span>Official iiskills.cloud seal</span>
            </li>
            <li className="flex items-start">
              <span className="text-accent mr-2">•</span>
              <span>Shareable on LinkedIn and other platforms</span>
            </li>
          </ul>
          
          <div className="bg-neutral p-6 rounded text-center">
            <p className="text-gray-600 italic">Certificate preview coming soon</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-accent to-primary text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-lg mb-6">
            Browse our courses and start your learning journey today!
          </p>
          <a 
            href="/courses" 
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Explore Courses
          </a>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
