import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import SharedNavbar from '../../components/shared/SharedNavbar'
import Footer from '../components/Footer'
import { getCurrentUser, signOutUser, getUserProfile } from '../lib/supabaseClient'

// Sample questions for different modules
const generateQuestions = (mode) => {
  const modules = mode === 'short' ? [
    'Education Background',
    'Skills & Talents',
    'Family Environment',
    'Social Network',
    'Personal Interests'
  ] : [
    'Education Background',
    'Academic Performance',
    'Skills & Talents',
    'Technical Abilities',
    'Creative Expression',
    'Family Environment',
    'Parental Support',
    'Social Network',
    'Peer Influence',
    'Personal Interests',
    'Hobbies & Activities',
    'Role Models',
    'Career Aspirations',
    'Work Values',
    'Learning Style',
    'Problem Solving',
    'Communication Skills',
    'Leadership Qualities',
    'Adaptability',
    'Self-Awareness'
  ]

  return modules.map((module, moduleIdx) => ({
    module,
    questions: Array.from({ length: 5 }, (_, qIdx) => ({
      id: `${moduleIdx}-${qIdx}`,
      question: getQuestionForModule(module, qIdx),
      options: getOptionsForModule(module, qIdx),
      answer: null
    }))
  }))
}

const getQuestionForModule = (module, qIdx) => {
  const questions = {
    'Education Background': [
      'What is your current level of education?',
      'How would you rate your overall academic performance?',
      'Which subject area do you find most engaging?',
      'How do you prefer to learn new concepts?',
      'What motivates you most in your studies?'
    ],
    'Skills & Talents': [
      'Which skill do you consider your strongest?',
      'How often do you practice your main talent?',
      'In which area would you like to improve?',
      'How do you approach learning new skills?',
      'What type of activities energize you most?'
    ],
    'Family Environment': [
      'How would you describe your family support system?',
      'What role does your family play in your decisions?',
      'How often do you discuss your goals with family?',
      'What values has your family emphasized most?',
      'How does your family encourage your growth?'
    ],
    'Social Network': [
      'How large is your close friend circle?',
      'What do you value most in friendships?',
      'How do your friends influence your choices?',
      'What activities do you enjoy with friends?',
      'How do you handle peer pressure?'
    ],
    'Personal Interests': [
      'What activity makes you lose track of time?',
      'Which field are you most curious about?',
      'How do you spend your free time?',
      'What kind of content do you consume most?',
      'What would you do if money was no object?'
    ]
  }
  
  return questions[module]?.[qIdx] || `Question ${qIdx + 1} about ${module}`
}

const getOptionsForModule = (module, qIdx) => {
  // Generic options that work for most questions
  const genericOptions = [
    ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
    ['Very High', 'High', 'Moderate', 'Low', 'Very Low'],
    ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
    ['Excellent', 'Good', 'Average', 'Below Average', 'Poor']
  ]
  
  const specificOptions = {
    'Education Background': {
      0: ['High School', 'Undergraduate', 'Graduate', 'Post Graduate', 'Professional'],
      2: ['Science & Technology', 'Arts & Humanities', 'Business & Commerce', 'Social Sciences', 'Other']
    },
    'Skills & Talents': {
      0: ['Technical/Analytical', 'Creative/Artistic', 'Communication', 'Leadership', 'Problem-Solving']
    }
  }
  
  return specificOptions[module]?.[qIdx] || genericOptions[qIdx % 4]
}

export default function Test() {
  const router = useRouter()
  const { mode } = router.query
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testData, setTestData] = useState([])
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [startTime] = useState(Date.now())

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (mode) {
      setTestData(generateQuestions(mode))
    }
  }, [mode])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login?redirect=/learn')
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

  const handleAnswer = (answer) => {
    const questionId = `${currentModuleIdx}-${currentQuestionIdx}`
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Auto-advance to next question
    if (currentQuestionIdx < 4) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
    } else if (currentModuleIdx < testData.length - 1) {
      setCurrentModuleIdx(currentModuleIdx + 1)
      setCurrentQuestionIdx(0)
    } else {
      // Test complete
      submitTest()
    }
  }

  const submitTest = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    router.push({
      pathname: '/results',
      query: {
        mode,
        answers: JSON.stringify(answers),
        timeSpent,
        totalQuestions: testData.length * 5
      }
    })
  }

  const goToQuestion = (moduleIdx, questionIdx) => {
    setCurrentModuleIdx(moduleIdx)
    setCurrentQuestionIdx(questionIdx)
  }

  if (isLoading || !testData.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading assessment...</p>
        </div>
      </div>
    )
  }

  const currentModule = testData[currentModuleIdx]
  const currentQuestion = currentModule?.questions[currentQuestionIdx]
  const totalQuestions = testData.length * 5
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / totalQuestions) * 100

  return (
    <>
      <Head>
        <title>{mode === 'short' ? 'Short' : 'Elaborate'} Assessment - Learn-Apt</title>
        <meta name="description" content="Skills assessment test" />
      </Head>
      
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn-Apt"
        homeUrl="/"
        showAuthButtons={true}
      />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-charcoal">
                Module {currentModuleIdx + 1} of {testData.length}: {currentModule.module}
              </span>
              <span className="text-sm font-semibold text-accent">
                {answeredCount} / {totalQuestions} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Question Navigator (Elaborate mode only) */}
            {mode === 'elaborate' && (
              <div className="bg-white p-6 rounded-lg shadow-md h-fit">
                <h3 className="font-bold text-lg text-primary mb-4">Navigation</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testData.map((module, mIdx) => (
                    <div key={mIdx}>
                      <div className="font-semibold text-sm text-gray-700 mb-1 mt-3">
                        {module.module}
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {module.questions.map((q, qIdx) => {
                          const questionId = `${mIdx}-${qIdx}`
                          const isAnswered = !!answers[questionId]
                          const isCurrent = mIdx === currentModuleIdx && qIdx === currentQuestionIdx
                          
                          return (
                            <button
                              key={qIdx}
                              onClick={() => goToQuestion(mIdx, qIdx)}
                              className={`
                                p-2 text-xs rounded transition
                                ${isCurrent ? 'bg-primary text-white font-bold' : ''}
                                ${!isCurrent && isAnswered ? 'bg-green-100 text-green-800' : ''}
                                ${!isCurrent && !isAnswered ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : ''}
                              `}
                            >
                              {qIdx + 1}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={submitTest}
                  disabled={answeredCount < totalQuestions}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
                >
                  Submit Test
                </button>
                {answeredCount < totalQuestions && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Answer all questions to submit
                  </p>
                )}
              </div>
            )}

            {/* Question Area */}
            <div className={mode === 'elaborate' ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="mb-6">
                  <span className="inline-block bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    Question {currentQuestionIdx + 1} of 5
                  </span>
                  <h2 className="text-2xl font-bold text-charcoal mb-2">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className={`
                        w-full p-4 text-left rounded-lg border-2 transition-all
                        ${answers[currentQuestion.id] === option 
                          ? 'border-primary bg-blue-50 font-semibold' 
                          : 'border-gray-200 hover:border-primary hover:bg-blue-50'
                        }
                      `}
                    >
                      <span className="flex items-center">
                        <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 font-semibold text-gray-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => {
                      if (currentQuestionIdx > 0) {
                        setCurrentQuestionIdx(currentQuestionIdx - 1)
                      } else if (currentModuleIdx > 0) {
                        setCurrentModuleIdx(currentModuleIdx - 1)
                        setCurrentQuestionIdx(4)
                      }
                    }}
                    disabled={currentModuleIdx === 0 && currentQuestionIdx === 0}
                    className="px-6 py-2 bg-gray-200 text-charcoal rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
                  >
                    ← Previous
                  </button>

                  <button
                    onClick={() => {
                      if (currentQuestionIdx < 4) {
                        setCurrentQuestionIdx(currentQuestionIdx + 1)
                      } else if (currentModuleIdx < testData.length - 1) {
                        setCurrentModuleIdx(currentModuleIdx + 1)
                        setCurrentQuestionIdx(0)
                      }
                    }}
                    disabled={currentModuleIdx === testData.length - 1 && currentQuestionIdx === 4}
                    className="px-6 py-2 bg-primary text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
