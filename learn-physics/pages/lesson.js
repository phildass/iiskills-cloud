import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getCurrentUser, getUserProfile } from '../lib/supabaseClient'
import { getModule } from '../data/curriculum'

/**
 * Lesson Viewing Page
 * 
 * Displays AI-generated lesson content for a specific lesson
 * Allows users to mark lessons as complete
 */
export default function Lesson() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [module, setModule] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()
  const { module: moduleId, lesson: lessonId } = router.query

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (moduleId && lessonId) {
      loadLesson()
    }
  }, [moduleId, lessonId])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    setIsLoading(false)
  }

  const loadLesson = () => {
    const moduleData = getModule(moduleId)
    if (!moduleData) {
      router.push('/learn')
      return
    }
    
    const lessonData = moduleData.lessons.find(l => l.id === lessonId)
    if (!lessonData) {
      router.push('/learn')
      return
    }
    
    setModule(moduleData)
    setLesson(lessonData)
    
    // Check if lesson is completed
    const savedProgress = localStorage.getItem('physics-progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setIsCompleted(progress.completedLessons?.includes(`${moduleId}-${lessonId}`) || false)
    }
  }

  const markAsComplete = () => {
    const savedProgress = localStorage.getItem('physics-progress')
    const progress = savedProgress ? JSON.parse(savedProgress) : { completedLessons: [], completedTests: [] }
    
    const lessonKey = `${moduleId}-${lessonId}`
    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey)
      localStorage.setItem('physics-progress', JSON.stringify(progress))
      setIsCompleted(true)
    }
  }

  const goToNextLesson = () => {
    const currentIndex = module.lessons.findIndex(l => l.id === lessonId)
    if (currentIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentIndex + 1]
      router.push(`/lesson?module=${moduleId}&lesson=${nextLesson.id}`)
    } else {
      router.push('/learn')
    }
  }

  if (isLoading || !lesson || !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  const currentIndex = module.lessons.findIndex(l => l.id === lessonId)
  const isLastLesson = currentIndex === module.lessons.length - 1

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Physics</title>
        <meta name="description" content={`Learn about ${lesson.title}`} />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/learn" className="text-primary hover:underline">
              ← Back to Learning Platform
            </Link>
          </div>
          
          {/* Lesson Header */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="mb-4">
              <span className="text-sm font-semibold text-primary bg-blue-100 px-3 py-1 rounded">
                {module.name}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-charcoal mb-4">{lesson.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>📚 Lesson {currentIndex + 1} of {module.lessons.length}</span>
              <span>⏱️ {lesson.duration}</span>
              {isCompleted && (
                <span className="text-green-600 font-semibold">✓ Completed</span>
              )}
            </div>
          </div>
          
          {/* Lesson Content */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-primary mb-4">Lesson Content</h2>
              
              <div className="bg-blue-50 border-l-4 border-primary p-6 rounded mb-6">
                <p className="text-gray-700">
                  <strong>Note:</strong> This is a placeholder for AI-generated lesson content. 
                  In production, this would contain comprehensive physics lessons with diagrams, 
                  equations, examples, and interactive elements.
                </p>
              </div>
              
              <p className="mb-4">
                This lesson covers <strong>{lesson.title}</strong> as part of the <strong>{module.name}</strong> module.
                The content would include:
              </p>
              
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Detailed explanations of key concepts</li>
                <li>Mathematical derivations and formulas</li>
                <li>Real-world applications and examples</li>
                <li>Visual diagrams and illustrations</li>
                <li>Practice problems with solutions</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded mb-6">
                <h3 className="text-xl font-bold text-charcoal mb-3">💡 Key Takeaways</h3>
                <p className="text-gray-700">
                  Important concepts and formulas that you should remember from this lesson would be 
                  summarized here for quick reference.
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 p-6 rounded">
                <h3 className="text-xl font-bold text-charcoal mb-3">✏️ Practice Problem</h3>
                <p className="text-gray-700">
                  An example problem related to {lesson.title} would be provided here, along with 
                  a step-by-step solution to help reinforce your understanding.
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Link
              href="/learn"
              className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-bold hover:bg-blue-50 transition"
            >
              Back to Curriculum
            </Link>
            
            <div className="flex gap-4">
              {!isCompleted && (
                <button
                  onClick={markAsComplete}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                >
                  ✓ Mark as Complete
                </button>
              )}
              
              {isCompleted && (
                <button
                  onClick={goToNextLesson}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  {isLastLesson ? 'Finish Module →' : 'Next Lesson →'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
