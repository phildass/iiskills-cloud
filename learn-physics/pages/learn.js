import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getCurrentUser, getUserProfile } from '../lib/supabaseClient'
import { physicsCurriculum, calculateProgress } from '../data/curriculum'

/**
 * Learning Platform Page - Main interface for Learn Physics
 * 
 * Shows hierarchical structure: Levels → Modules → Lessons
 * Displays visual progress tracking
 * Protected route - requires authentication
 */
export default function Learn() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [completedTests, setCompletedTests] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }
    
    setUser(currentUser)
    setUserProfile(getUserProfile(currentUser))
    
    // Load user progress from localStorage (in production, this would be from Supabase)
    const savedProgress = localStorage.getItem('physics-progress')
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCompletedLessons(progress.completedLessons || [])
      setCompletedTests(progress.completedTests || [])
    }
    
    setIsLoading(false)
  }

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId === selectedLevel ? null : levelId)
  }

  const isLessonCompleted = (moduleId, lessonId) => {
    return completedLessons.includes(`${moduleId}-${lessonId}`)
  }

  const isTestCompleted = (testId) => {
    return completedTests.includes(testId)
  }

  const getModuleProgress = (module) => {
    const completedCount = module.lessons.filter(lesson => 
      isLessonCompleted(module.id, lesson.id)
    ).length
    return Math.round((completedCount / module.lessons.length) * 100)
  }

  const getLevelProgress = (level) => {
    const totalLessons = level.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const completedCount = level.modules.reduce((sum, module) => {
      return sum + module.lessons.filter(lesson => 
        isLessonCompleted(module.id, lesson.id)
      ).length
    }, 0)
    return Math.round((completedCount / totalLessons) * 100)
  }

  const overallProgress = calculateProgress(completedLessons, completedTests)

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

  return (
    <>
      <Head>
        <title>Learning Platform - Learn Physics</title>
        <meta name="description" content="Master physics with structured lessons and tests" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome, {userProfile?.firstName || 'Learner'}! 🎓
            </h1>
            <p className="text-xl text-charcoal mb-4">
              Continue your physics mastery journey
            </p>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
              <p className="text-gray-700">
                <strong>Account:</strong> {user?.email || "Unknown"}
              </p>
              {userProfile?.age && (
                <p className="text-gray-700">
                  <strong>Age:</strong> {userProfile.age} | <strong>Qualification:</strong> {userProfile.qualification || 'Not specified'}
                </p>
              )}
            </div>
            
            {/* Overall Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-charcoal">Overall Progress</span>
                <span className="text-lg font-bold text-primary">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Levels Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary mb-6">Physics Curriculum</h2>
            
            {physicsCurriculum.levels.map((level, levelIndex) => {
              const levelProgress = getLevelProgress(level)
              const isExpanded = selectedLevel === level.id
              const colorClass = level.color === 'green' ? 'border-green-500' : 
                                level.color === 'blue' ? 'border-blue-500' : 
                                'border-purple-500'
              const bgClass = level.color === 'green' ? 'from-green-50' : 
                             level.color === 'blue' ? 'from-blue-50' : 
                             'from-purple-50'
              
              return (
                <div key={level.id} className={`bg-white rounded-lg shadow-lg border-l-4 ${colorClass} overflow-hidden`}>
                  {/* Level Header */}
                  <div 
                    className={`p-6 cursor-pointer hover:bg-gradient-to-r ${bgClass} to-white transition`}
                    onClick={() => handleLevelSelect(level.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-charcoal mb-2">
                          {levelIndex + 1}. {level.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{level.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {level.modules.length} modules • {level.modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{levelProgress}%</div>
                          <div className="text-sm text-gray-600">Complete</div>
                        </div>
                        <div className="text-2xl">
                          {isExpanded ? '▼' : '▶'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Modules Grid */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50 border-t">
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {level.modules.map((module, moduleIndex) => {
                          const moduleProgress = getModuleProgress(module)
                          
                          return (
                            <div key={module.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                              <h4 className="text-lg font-bold text-primary mb-2">
                                Module {moduleIndex + 1}: {module.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                              
                              {/* Module Progress */}
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-600">Progress</span>
                                  <span className="text-xs font-bold text-primary">{moduleProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`bg-gradient-to-r from-${level.color}-400 to-${level.color}-600 h-2 rounded-full transition-all`}
                                    style={{ width: `${moduleProgress}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Lessons List */}
                              <div className="space-y-2 mb-4">
                                {module.lessons.map((lesson, lessonIndex) => {
                                  const completed = isLessonCompleted(module.id, lesson.id)
                                  
                                  return (
                                    <Link
                                      key={lesson.id}
                                      href={`/lesson?module=${module.id}&lesson=${lesson.id}`}
                                      className={`block p-3 rounded border ${
                                        completed 
                                          ? 'bg-green-50 border-green-300' 
                                          : 'bg-gray-50 border-gray-200 hover:border-primary'
                                      } transition`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className={`text-lg ${completed ? 'text-green-600' : 'text-gray-400'}`}>
                                          {completed ? '✓' : '○'}
                                        </span>
                                        <div className="flex-1">
                                          <div className="text-sm font-semibold text-charcoal">
                                            Lesson {lessonIndex + 1}: {lesson.title}
                                          </div>
                                          <div className="text-xs text-gray-500">{lesson.duration}</div>
                                        </div>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                              
                              {/* Module Test */}
                              <Link
                                href={`/test?module=${module.id}`}
                                className={`block w-full py-3 px-4 rounded font-bold text-center transition ${
                                  isTestCompleted(module.testId)
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-primary text-white hover:bg-blue-700'
                                }`}
                              >
                                {isTestCompleted(module.testId) ? '✓ Test Completed' : 'Take Module Test'}
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
