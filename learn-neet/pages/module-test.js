import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getCurrentUser, checkActiveSubscription } from '../lib/supabaseClient'
import { generateModuleTest } from '../lib/neetSyllabus'

export default function ModuleTest() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [testCompleted, setTestCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const router = useRouter()
  const { subject, module } = router.query

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (subject && module) {
      const testQuestions = generateModuleTest(subject, parseInt(module))
      setQuestions(testQuestions)
    }
  }, [subject, module])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login?redirect=/learn')
      return
    }
    
    setUser(currentUser)
    const hasSubscription = checkActiveSubscription(currentUser)
    setHasActiveSubscription(hasSubscription)
    
    if (!hasSubscription) {
      alert('Subscription required to access module tests')
      router.push('/learn')
      return
    }
    
    setIsLoading(false)
  }

  const handleStartTest = () => {
    setTestStarted(true)
    setCurrentQuestion(0)
    setAnswers({})
    setTestCompleted(false)
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    // Calculate score
    let correctAnswers = 0
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers++
      }
    })
    
    const percentage = (correctAnswers / questions.length) * 100
    setScore(percentage)
    setTestCompleted(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  if (!subject || !module || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-xl text-charcoal mb-4">Invalid test parameters</p>
          <Link href="/learn" className="text-primary hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const subjectCapitalized = subject.charAt(0).toUpperCase() + subject.slice(1)

  return (
    <>
      <Head>
        <title>Module Test - {subjectCapitalized} Module {module}</title>
        <meta name="description" content={`Test your knowledge in ${subjectCapitalized}`} />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">
                  {subjectCapitalized} - Module {module} Test
                </h1>
                <p className="text-gray-600 mt-1">{questions.length} questions</p>
              </div>
              <Link href="/learn" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {!testStarted && !testCompleted && (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-primary mb-4">Ready to Start the Test?</h2>
              <p className="text-gray-700 mb-6">
                This test contains {questions.length} questions. Take your time and answer each question carefully.
              </p>
              <ul className="text-left max-w-md mx-auto mb-8 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Each question has 4 options with only one correct answer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>You can navigate between questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Review your answers before submitting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Get instant feedback after submission</span>
                </li>
              </ul>
              <button
                onClick={handleStartTest}
                className="bg-primary text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition"
              >
                Start Test
              </button>
            </div>
          )}

          {testStarted && !testCompleted && question && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {Object.keys(answers).length} answered
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-charcoal mb-6">
                  {currentQuestion + 1}. {question.question}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(question.id, index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        answers[question.id] === index
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[question.id] === index
                            ? 'border-primary bg-primary'
                            : 'border-gray-400'
                        }`}>
                          {answers[question.id] === index && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                  >
                    Submit Test
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}

          {testCompleted && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">
                  {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2">Test Completed!</h2>
                <p className="text-gray-600">Here are your results</p>
              </div>

              <div className="max-w-md mx-auto mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl text-center">
                  <div className="text-5xl font-bold mb-2">{score.toFixed(1)}%</div>
                  <p className="text-lg">
                    {Object.keys(answers).length === questions.length ? 'All questions answered' : `${Object.keys(answers).length} / ${questions.length} answered`}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Correct Answers</span>
                    <span className="text-2xl font-bold text-green-600">
                      {Math.round((score / 100) * questions.length)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="font-medium">Incorrect Answers</span>
                    <span className="text-2xl font-bold text-red-600">
                      {questions.length - Math.round((score / 100) * questions.length)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-700 mb-6">
                  {score >= 80
                    ? 'Excellent work! You have a strong grasp of this module.'
                    : score >= 60
                    ? 'Good job! Review the topics where you missed questions.'
                    : 'Keep practicing! Review the module content and try again.'}
                </p>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleStartTest}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Retake Test
                  </button>
                  <Link
                    href="/learn"
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
