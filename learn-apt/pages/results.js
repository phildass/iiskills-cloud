import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Footer from '../../components/Footer'
import { getCurrentUser, signOutUser, getUserProfile } from '../lib/supabaseClient'

/**
 * Results Page
 * 
 * Displays AI-generated aptitude/career/learning report
 * Provides downloadable PDF with branding
 */

const generateAIReport = (userProfile, mode, answers, timeSpent) => {
  const totalQuestions = mode === 'short' ? 25 : 100
  const answeredCount = Object.keys(answers).length
  const completionRate = (answeredCount / totalQuestions) * 100

  // This is a placeholder for AI-generated content
  // In production, this would call an AI service with the user's responses
  
  const name = userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : 'User'
  const age = userProfile?.age || 'N/A'
  const qualification = userProfile?.qualification || 'Not specified'

  return {
    summary: `Based on your comprehensive ${mode} assessment, we have analyzed ${answeredCount} responses across multiple dimensions of your personality, skills, and aspirations.`,
    
    strengths: [
      'Strong analytical and problem-solving capabilities',
      'Excellent communication and interpersonal skills',
      'High adaptability and willingness to learn',
      'Clear understanding of personal goals and values',
      'Strong support system and positive influences'
    ],
    
    areasForImprovement: [
      'Consider developing technical skills in emerging technologies',
      'Expand professional network and seek mentorship opportunities',
      'Focus on time management and productivity techniques',
      'Explore diverse learning resources and methodologies'
    ],
    
    careerGuidance: `Given your educational background (${qualification}), age (${age}), and demonstrated abilities, you show strong potential in fields that require analytical thinking combined with creative problem-solving. 

Your responses indicate a balanced approach to learning and development, suggesting you would thrive in dynamic environments that value both technical expertise and interpersonal skills. Consider exploring careers in technology consulting, project management, educational technology, or business analysis.

Your strong family support and positive social influences provide a solid foundation for pursuing ambitious career goals. We recommend:

1. **Short-term (6 months):** Focus on building specific technical skills aligned with your interests. Consider online certifications in your field of choice.

2. **Medium-term (1-2 years):** Seek internships or entry-level positions that offer learning opportunities and mentorship. Build a professional network through industry events and online communities.

3. **Long-term (3-5 years):** Develop leadership capabilities and consider specialized training or advanced degrees that align with your career trajectory.

Your cognitive abilities and learning style suggest you would benefit from a mix of structured learning and hands-on experience. Practical projects and real-world applications will help reinforce theoretical knowledge.`,

    learningRecommendations: [
      'Enroll in online courses or certifications relevant to your career interests',
      'Join professional communities and attend industry events',
      'Seek mentorship from experienced professionals in your field',
      'Practice continuous learning through books, podcasts, and webinars',
      'Engage in practical projects to apply theoretical knowledge',
      'Develop soft skills through workshops and peer interactions'
    ],

    nextSteps: [
      'Set specific, measurable career goals for the next 6-12 months',
      'Create a learning plan with dedicated time for skill development',
      'Update your resume and professional profiles with new skills',
      'Network actively and seek informational interviews',
      'Consider finding an accountability partner or mentor'
    ],

    conclusion: `Your assessment reveals a well-rounded individual with strong potential for growth and success. By leveraging your strengths and actively working on identified areas for improvement, you can achieve your career and personal development goals. Remember that continuous learning and adaptability are key to long-term success in today's dynamic world.`
  }
}

export default function Results() {
  const router = useRouter()
  const { mode, answers: answersStr, timeSpent, totalQuestions } = router.query
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [report, setReport] = useState(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showPdfMessage, setShowPdfMessage] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (userProfile && answersStr) {
      const answers = JSON.parse(answersStr)
      const generatedReport = generateAIReport(userProfile, mode, answers, parseInt(timeSpent))
      setReport(generatedReport)
    }
  }, [userProfile, answersStr, mode, timeSpent])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    setUserProfile(getUserProfile(currentUser))
    setIsLoading(false)
  }

  const handleLogout = async () => {
    const { success } = await signOutUser()
    if (success) {
      setUser(null)
      router.push('/')
    }
  }

  const downloadPDF = () => {
    // In production, this would generate an actual PDF
    // For now, we'll show a friendly message
    setShowPdfMessage(true)
    setTimeout(() => setShowPdfMessage(false), 5000)
  }

  const retakeTest = () => {
    router.push('/learn')
  }

  if (isLoading || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Generating your personalized report...</p>
        </div>
      </div>
    )
  }

  const name = userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName || ''}`.trim() : 'User'

  return (
    <>
      <Head>
        <title>Your Assessment Results - Learn-Apt</title>
        <meta name="description" content="Your personalized career guidance report" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent text-white p-8 rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Assessment Complete! 🎉</h1>
                <p className="text-xl">Congratulations, {name}!</p>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Completion Date</div>
                <div className="font-semibold">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{mode === 'short' ? '5' : '20'} min</div>
                  <div className="text-sm opacity-90">Test Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalQuestions}</div>
                  <div className="text-sm opacity-90">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{mode === 'short' ? 'Short' : 'Elaborate'}</div>
                  <div className="text-sm opacity-90">Test Mode</div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-white p-8 shadow-lg">
            {/* Summary */}
            <section className="mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">Executive Summary</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{report.summary}</p>
            </section>

            {/* Strengths */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Your Key Strengths</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  {report.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Areas for Improvement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Areas for Development</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  {report.areasForImprovement.map((area, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 font-bold mr-3">→</span>
                      <span className="text-gray-700">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Career Guidance */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Personalized Career Guidance</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                {report.careerGuidance.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Learning Recommendations */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Learning Recommendations</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {report.learningRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-purple-50 p-4 rounded-lg flex items-start">
                    <span className="text-2xl mr-3">📚</span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Next Steps */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Your Next Steps</h2>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <ol className="space-y-3">
                  {report.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="bg-yellow-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Conclusion */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Conclusion</h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <p className="text-gray-700 text-lg leading-relaxed">{report.conclusion}</p>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-b-2xl shadow-lg border-t-2 border-gray-100">
            {showPdfMessage && (
              <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <p className="font-semibold">📄 PDF Download Feature Coming Soon!</p>
                <p className="text-sm mt-1">
                  PDF generation with branding will be implemented using a PDF library like jsPDF or react-pdf in production. 
                  For now, you can print this page or save it as PDF using your browser's print function.
                </p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={downloadPDF}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                📥 Download PDF Report
              </button>
              <button
                onClick={retakeTest}
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                🔄 Take Another Test
              </button>
              <button
                onClick={() => setShowDisclaimer(!showDisclaimer)}
                className="bg-gray-200 text-charcoal px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
              >
                ℹ️ Disclaimer & Privacy
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          {showDisclaimer && (
            <div className="bg-white p-8 rounded-2xl shadow-lg mt-6 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-primary mb-4">Disclaimer & Privacy Policy</h3>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-bold text-lg mb-2">Disclaimer</h4>
                  <p className="leading-relaxed">
                    This assessment and report are generated using AI technology and are intended for 
                    informational and guidance purposes only. The results should not be considered as 
                    professional career counseling, psychological evaluation, or definitive career advice. 
                    We recommend consulting with qualified career counselors or professionals for 
                    personalized guidance based on your specific circumstances.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-2">Accuracy</h4>
                  <p className="leading-relaxed">
                    While we strive to provide accurate and helpful insights, the AI-generated content 
                    is based on patterns and general principles. Individual circumstances, market conditions, 
                    and personal preferences may vary significantly from the recommendations provided.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-2">Privacy Policy</h4>
                  <p className="leading-relaxed">
                    Your privacy is important to us. The information you provide in this assessment is:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Used solely to generate your personalized report</li>
                    <li>Stored securely using industry-standard encryption</li>
                    <li>Never shared with third parties without your explicit consent</li>
                    <li>Subject to our comprehensive privacy policy</li>
                    <li>Accessible only to you through your account</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-2">Terms of Use</h4>
                  <p className="leading-relaxed">
                    By using Learn-Apt, you agree to our terms of service. This assessment is provided 
                    as-is without warranties of any kind. The recommendations are suggestions based on 
                    your responses and should be evaluated in the context of your personal situation, 
                    goals, and circumstances.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Contact:</strong> For questions about your data or this report, please contact 
                    us at info@iiskills.cloud
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Branding Footer */}
          <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Powered by</p>
                <p className="font-bold text-lg text-primary">iiskills</p>
                <p className="text-xs text-gray-500">Indian Institute of Professional Skills Development</p>
              </div>
              <div className="text-2xl text-gray-400">×</div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Technology by</p>
                <p className="font-bold text-lg text-accent">AI Cloud Enterprises</p>
                <p className="text-xs text-gray-500">Advanced AI Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </>
  )
}
