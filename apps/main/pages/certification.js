import Head from 'next/head'

export default function Certification() {
  const userName = 'Your Name'
  const courseName = 'Course Name'
  const certificateNo = 'IIPS-2024-XXXX'
  const completionDate = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <Head>
        <title>Certification - iiskills.cloud</title>
        <meta name="description" content="Learn about our certification process and requirements at iiskills.cloud" />
      </Head>
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">Certification Information</h1>
        <p className="text-xl text-center text-charcoal mb-12">
          Earn recognized certifications that validate your skills
        </p>

        {/* Certificate Template Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 text-center">Certificate Preview</h2>
          
          {/* Certificate */}
          <div className="max-w-4xl mx-auto bg-white border-8 border-double border-primary p-8 md:p-12 rounded-lg shadow-2xl">
            {/* Header with Logo */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img src="/images/iiskills-logo.png" alt="iiskills Logo" className="h-20 w-20 object-contain" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Certificate of Completion</h2>
              <p className="text-lg text-accent font-semibold">Indian Institute of Professional Skills Development</p>
              <div className="mt-2 h-1 w-32 bg-accent mx-auto"></div>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-6 mb-8">
              <p className="text-xl text-charcoal">This certificate is awarded to</p>
              
              <div className="my-6">
                <p className="text-3xl md:text-4xl font-bold text-primary border-b-2 border-gray-300 pb-2 inline-block px-8">
                  {userName}
                </p>
              </div>

              <p className="text-lg text-charcoal">For having successfully completed the</p>

              <div className="my-6">
                <p className="text-2xl md:text-3xl font-bold text-accent">
                  {courseName}
                </p>
              </div>

              <p className="text-base text-charcoal italic">
                Demonstrating dedication to professional development and mastery of essential skills
              </p>
            </div>

            {/* Certificate Footer */}
            <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-300">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Certificate No.</p>
                <p className="font-bold text-primary">{certificateNo}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Date of Completion</p>
                <p className="font-bold text-primary">{completionDate}</p>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-12 text-center">
              <div className="inline-block">
                <div className="border-t-2 border-gray-400 pt-2 px-8">
                  <p className="font-bold text-lg text-charcoal">Pradhyot Kumar</p>
                  <p className="text-sm text-gray-600">Director</p>
                  <p className="text-sm text-gray-600">Indian Institute of Professional Skills Development</p>
                </div>
              </div>
            </div>
          </div>


        </div>

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

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-accent to-primary text-white rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Certified?</h2>
          <p className="text-lg mb-6">
            Browse our courses and start your learning journey today!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href="/courses" 
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Explore Courses
            </a>
            <a 
              href="/my-certificates" 
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition"
            >
              View My Certificates
            </a>
          </div>
        </div>
      </main>
      
    </>
  )
}
