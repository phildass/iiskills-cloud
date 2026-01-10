import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { getCurrentUser, getUserProfile } from '../lib/supabaseClient'

import { getPricingDisplay } from '../utils/pricing'

/**
 * JEE Course Data Structure
 * - 3 main subjects: Physics, Chemistry, Mathematics
 * - Only the first lesson of the first chapter is free
 * - Each subject has multiple chapters with lessons
 */
const courseData = {
  physics: {
    id: 'physics',
    title: 'Physics',
    icon: '⚛️',
    color: 'blue',
    chapters: [
      {
        id: 1,
        title: "Mechanics and Motion",
        description: "Fundamentals of motion, forces, and energy",
        lessons: [
          { id: 1, title: "Introduction to JEE Physics", duration: "20 min", free: true, summary: "Explore strategies for tackling Physics problems, understand the JEE syllabus structure, and discover the importance of conceptual learning." },
          { id: 2, title: "Kinematics - Motion in a Straight Line", duration: "25 min", free: false },
          { id: 3, title: "Newton's Laws of Motion", duration: "30 min", free: false }
        ]
      },
      {
        id: 2,
        title: "Thermodynamics",
        description: "Heat, work, and energy transfer",
        lessons: [
          { id: 1, title: "Laws of Thermodynamics", duration: "25 min", free: false },
          { id: 2, title: "Heat Engines and Refrigerators", duration: "28 min", free: false },
          { id: 3, title: "Entropy and Second Law", duration: "22 min", free: false }
        ]
      },
      {
        id: 3,
        title: "Electromagnetism",
        description: "Electric and magnetic fields, circuits",
        lessons: [
          { id: 1, title: "Electric Field and Potential", duration: "30 min", free: false },
          { id: 2, title: "Capacitance and Dielectrics", duration: "25 min", free: false },
          { id: 3, title: "Magnetic Fields and Forces", duration: "28 min", free: false }
        ]
      },
      {
        id: 4,
        title: "Modern Physics",
        description: "Quantum mechanics, atomic structure, nuclear physics",
        lessons: [
          { id: 1, title: "Photoelectric Effect", duration: "22 min", free: false },
          { id: 2, title: "Bohr's Atomic Model", duration: "25 min", free: false },
          { id: 3, title: "Nuclear Physics Basics", duration: "28 min", free: false }
        ]
      }
    ]
  },
  chemistry: {
    id: 'chemistry',
    title: 'Chemistry',
    icon: '🧪',
    color: 'green',
    chapters: [
      {
        id: 1,
        title: "Physical Chemistry",
        description: "Chemical kinetics, equilibrium, thermodynamics",
        lessons: [
          { id: 1, title: "Chemical Equilibrium Fundamentals", duration: "25 min", free: false },
          { id: 2, title: "Acids and Bases", duration: "22 min", free: false },
          { id: 3, title: "Chemical Kinetics", duration: "28 min", free: false }
        ]
      },
      {
        id: 2,
        title: "Organic Chemistry",
        description: "Carbon compounds, reactions, and mechanisms",
        lessons: [
          { id: 1, title: "Organic Compounds and Nomenclature", duration: "30 min", free: false },
          { id: 2, title: "Reaction Mechanisms", duration: "28 min", free: false },
          { id: 3, title: "Aromatic Compounds", duration: "25 min", free: false }
        ]
      },
      {
        id: 3,
        title: "Inorganic Chemistry",
        description: "Periodic properties, coordination compounds",
        lessons: [
          { id: 1, title: "Periodic Table and Trends", duration: "25 min", free: false },
          { id: 2, title: "Coordination Chemistry", duration: "30 min", free: false },
          { id: 3, title: "Metallurgy Basics", duration: "22 min", free: false }
        ]
      }
    ]
  },
  mathematics: {
    id: 'mathematics',
    title: 'Mathematics',
    icon: '📐',
    color: 'purple',
    chapters: [
      {
        id: 1,
        title: "Algebra",
        description: "Equations, sequences, series, and complex numbers",
        lessons: [
          { id: 1, title: "Quadratic Equations", duration: "25 min", free: false },
          { id: 2, title: "Sequences and Series", duration: "28 min", free: false },
          { id: 3, title: "Complex Numbers", duration: "30 min", free: false }
        ]
      },
      {
        id: 2,
        title: "Calculus",
        description: "Limits, derivatives, and integration",
        lessons: [
          { id: 1, title: "Limits and Continuity", duration: "30 min", free: false },
          { id: 2, title: "Differentiation Techniques", duration: "28 min", free: false },
          { id: 3, title: "Integration Methods", duration: "32 min", free: false }
        ]
      },
      {
        id: 3,
        title: "Coordinate Geometry",
        description: "Lines, circles, conic sections",
        lessons: [
          { id: 1, title: "Straight Lines", duration: "22 min", free: false },
          { id: 2, title: "Circles and Parabolas", duration: "28 min", free: false },
          { id: 3, title: "Ellipse and Hyperbola", duration: "30 min", free: false }
        ]
      },
      {
        id: 4,
        title: "Trigonometry",
        description: "Trigonometric functions, identities, and equations",
        lessons: [
          { id: 1, title: "Trigonometric Functions", duration: "25 min", free: false },
          { id: 2, title: "Trigonometric Identities", duration: "22 min", free: false },
          { id: 3, title: "Inverse Trigonometric Functions", duration: "28 min", free: false }
        ]
      }
    ]
  }
}



/**
 * JEE Course Data Structure - 10 Chapters
 * Only Chapter 1, Lesson 1 is free
 * Covers Physics, Chemistry, and Mathematics
 */
const courseData = [
  {
    id: 1,
    title: "JEE Physics Fundamentals",
    description: "Master the foundation of physics for JEE",
    subject: "Physics",
    lessons: [
      { id: 1, title: "Introduction to JEE Physics", duration: "20 min", free: true },
      { id: 2, title: "Kinematics and Motion", duration: "25 min", free: false },
      { id: 3, title: "Laws of Motion", duration: "30 min", free: false }
    ],
    free: false // Only first lesson is free
  },
  {
    id: 2,
    title: "Mechanics and Dynamics",
    description: "Deep dive into mechanics concepts",
    subject: "Physics",
    lessons: [
      { id: 1, title: "Work, Energy, and Power", duration: "25 min", free: false },
      { id: 2, title: "Circular Motion", duration: "22 min", free: false },
      { id: 3, title: "Center of Mass", duration: "20 min", free: false }
    ],
    free: false
  },
  {
    id: 3,
    title: "Thermodynamics Essentials",
    description: "Heat, temperature, and laws of thermodynamics",
    subject: "Physics",
    lessons: [
      { id: 1, title: "Heat and Temperature", duration: "18 min", free: false },
      { id: 2, title: "First Law of Thermodynamics", duration: "25 min", free: false },
      { id: 3, title: "Heat Engines and Carnot Cycle", duration: "22 min", free: false }
    ],
    free: false
  },
  {
    id: 4,
    title: "Physical Chemistry Foundations",
    description: "Understanding chemical principles",
    subject: "Chemistry",
    lessons: [
      { id: 1, title: "Atomic Structure", duration: "20 min", free: false },
      { id: 2, title: "Chemical Bonding", duration: "25 min", free: false },
      { id: 3, title: "States of Matter", duration: "22 min", free: false }
    ],
    free: false
  },
  {
    id: 5,
    title: "Organic Chemistry Basics",
    description: "Fundamentals of organic compounds",
    subject: "Chemistry",
    lessons: [
      { id: 1, title: "Hydrocarbons", duration: "23 min", free: false },
      { id: 2, title: "Functional Groups", duration: "20 min", free: false },
      { id: 3, title: "Reaction Mechanisms", duration: "25 min", free: false }
    ],
    free: false
  },
  {
    id: 6,
    title: "Inorganic Chemistry",
    description: "Periodic table and chemical reactions",
    subject: "Chemistry",
    lessons: [
      { id: 1, title: "Periodic Table Trends", duration: "18 min", free: false },
      { id: 2, title: "Chemical Reactions", duration: "22 min", free: false },
      { id: 3, title: "Coordination Compounds", duration: "24 min", free: false }
    ],
    free: false
  },
  {
    id: 7,
    title: "Calculus for JEE",
    description: "Essential calculus concepts",
    subject: "Mathematics",
    lessons: [
      { id: 1, title: "Limits and Continuity", duration: "22 min", free: false },
      { id: 2, title: "Differentiation", duration: "25 min", free: false },
      { id: 3, title: "Integration Basics", duration: "28 min", free: false }
    ],
    free: false
  },
  {
    id: 8,
    title: "Algebra Mastery",
    description: "Equations, sequences, and series",
    subject: "Mathematics",
    lessons: [
      { id: 1, title: "Quadratic Equations", duration: "20 min", free: false },
      { id: 2, title: "Sequences and Series", duration: "22 min", free: false },
      { id: 3, title: "Complex Numbers", duration: "25 min", free: false }
    ],
    free: false
  },
  {
    id: 9,
    title: "Coordinate Geometry",
    description: "Lines, circles, and conic sections",
    subject: "Mathematics",
    lessons: [
      { id: 1, title: "Straight Lines", duration: "18 min", free: false },
      { id: 2, title: "Circles", duration: "20 min", free: false },
      { id: 3, title: "Parabola and Ellipse", duration: "24 min", free: false }
    ],
    free: false
  },
  {
    id: 10,
    title: "Problem-Solving Strategies",
    description: "Master JEE problem-solving techniques",
    subject: "Mixed",
    lessons: [
      { id: 1, title: "Time Management in Exams", duration: "15 min", free: false },
      { id: 2, title: "Advanced Problem Solving", duration: "25 min", free: false },
      { id: 3, title: "Mock Test Strategies", duration: "20 min", free: false }
    ],
    free: false
  }
]

/**
 * Get subject color based on subject
 */
const getSubjectColor = (subject) => {
  switch (subject) {
    case 'Physics':
      return 'from-blue-600 to-cyan-600'
    case 'Chemistry':
      return 'from-purple-600 to-pink-600'
    case 'Mathematics':
      return 'from-green-600 to-teal-600'
    default:
      return 'from-primary to-blue-600'
  }
}

/**
 * Course Learning Page for JEE
 * 
 * Protected Route: Requires authentication
 * Paywall: Only Chapter 1, Lesson 1 is free
 */

export default function Learn() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPurchased, setHasPurchased] = useState(false)

  const [activeSubject, setActiveSubject] = useState('physics')
  const router = useRouter()
  const pricing = getPricingDisplay()

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        // User is not authenticated, redirect to login
        router.push('/login?redirect=/learn')
        return
      }
      
      setUser(currentUser)
      setUserProfile(getUserProfile(currentUser))
      

      // Check if user has purchased the JEE course

      // Check if user has purchased the course
      // For now, we'll check user metadata
      const purchased = currentUser.user_metadata?.purchased_jee_course === true
      setHasPurchased(purchased)
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])


  const handleLessonClick = (subject, chapterId, lessonId, isFree) => {
    // Allow access to first lesson of Physics (first chapter, first lesson)
    if (subject === 'physics' && chapterId === 1 && lessonId === 1) {
      alert('FREE PREVIEW: Introduction to JEE Physics lesson would be displayed here. This is your free preview lesson!')

  const handleLessonClick = (chapterId, lessonId, isFree) => {
    // Allow access to Chapter 1, Lesson 1
    if (chapterId === 1 && lessonId === 1) {
      // TODO: Navigate to lesson content page or render lesson content
      // For now, using alert as placeholder
      alert('Lesson content would be displayed here. This is the FREE preview lesson!')
      return
    }
    
    // Check if user has purchased
    if (!hasPurchased && !isFree) {

      alert(`This lesson requires purchasing the full course.\n\nPrice: ${pricing.totalPrice}\n\nYou'll get access to all Physics, Chemistry, and Mathematics lessons with AI-generated content and quizzes!`)

      // TODO: Show proper paywall modal instead of alert
      // For now, using alert as placeholder
      alert('This lesson requires purchasing the full course. Price: ₹499 + GST ₹89.82 (Total: ₹588.82)')
      return
    }
    
    // User has access

    alert(`Lesson content for ${subject} - Chapter ${chapterId}, Lesson ${lessonId} would be displayed here.`)

    // TODO: Navigate to lesson content page or render lesson content
    alert(`Lesson ${chapterId}.${lessonId} content would be displayed here.`)

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


  const currentSubject = courseData[activeSubject]

  // Helper function to get subject-specific classes
  const getSubjectClasses = (subjectId, isActive = false) => {
    const classMap = {
      physics: {
        active: 'bg-blue-500 text-white border-b-4 border-blue-700',
        header: 'bg-gradient-to-r from-blue-500 to-blue-600',
      },
      chemistry: {
        active: 'bg-green-500 text-white border-b-4 border-green-700',
        header: 'bg-gradient-to-r from-green-500 to-green-600',
      },
      mathematics: {
        active: 'bg-purple-500 text-white border-b-4 border-purple-700',
        header: 'bg-gradient-to-r from-purple-500 to-purple-600',
      },
    }
    
    return classMap[subjectId] || classMap.physics
  }

  return (
    <>
      <Head>
        <title>Learn JEE - Course Content</title>

        <meta name="description" content="Access your Learn JEE course - Physics, Chemistry, and Mathematics" />

        <meta name="description" content="Access your Learn JEE course" />

      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome to Learn JEE, {userProfile?.firstName || userProfile?.first_name || 'Learner'}! 🎓
            </h1>
            <p className="text-xl text-charcoal mb-4">

              Master JEE with comprehensive coverage of Physics, Chemistry, and Mathematics
            </p>
            
            {!hasPurchased && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mt-4">
                <h3 className="text-2xl font-bold mb-2">🎁 Free Preview Available</h3>
                <p className="mb-3">
                  You have free access to the first Physics lesson. Experience our teaching style before purchasing!
                </p>
                <div className="bg-white text-primary p-4 rounded inline-block">
                  <div className="text-lg font-semibold">Full Course Access</div>
                  <div className="text-3xl font-bold">{pricing.basePrice} <span className="text-base font-normal">+ GST {pricing.gstAmount}</span></div>
                  <div className="text-sm mt-1">Total: {pricing.totalPrice} • Lifetime Access</div>
                  {pricing.isIntroductory && (
                    <div className="text-xs mt-2 text-green-600 font-semibold">
                      Introductory offer until {pricing.introEndDate}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link href="https://www.aienter.in/payments" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                    Purchase Full Course →
                  </Link>
                </div>
              </div>
            )}
            
            {hasPurchased && (
              <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg mt-4">
                <p className="text-green-800 font-semibold">
                  ✓ You have full access to all JEE course content - Physics, Chemistry, and Mathematics!

                  ✓ You have full access to all course content!
                </p>
              </div>
            )}
          </div>
          

          {/* Subject Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {Object.values(courseData).map((subject) => {
                const classes = getSubjectClasses(subject.id)
                return (
                  <button
                    key={subject.id}
                    onClick={() => setActiveSubject(subject.id)}
                    className={`flex-1 py-4 px-6 text-center font-semibold transition ${
                      activeSubject === subject.id
                        ? classes.active
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{subject.icon}</span>
                    {subject.title}
                  </button>
                )
              })}
            </div>
            
            {/* Subject Content */}
            <div className="p-6">
              <h2 className="text-3xl font-bold text-primary mb-6">{currentSubject.title}</h2>
              
              <div className="space-y-6">
                {currentSubject.chapters.map((chapter) => {
                  const subjectClasses = getSubjectClasses(activeSubject)
                  return (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                      <div className={`${subjectClasses.header} text-white p-4`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              Chapter {chapter.id}: {chapter.title}
                            </h3>
                            <p className="text-sm opacity-90">{chapter.description}</p>
                          </div>
                          {!hasPurchased && !(activeSubject === 'physics' && chapter.id === 1) && (
                            <div className="text-3xl">🔒</div>
                          )}
                        </div>
                      </div>
                    
                    <div className="p-4">
                      <div className="space-y-3">
                        {chapter.lessons.map((lesson) => {
                          const isAccessible = (activeSubject === 'physics' && chapter.id === 1 && lesson.id === 1) || hasPurchased
                          const isFreeLesson = activeSubject === 'physics' && chapter.id === 1 && lesson.id === 1
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(activeSubject, chapter.id, lesson.id, isFreeLesson)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                                isAccessible
                                  ? 'border-green-300 hover:border-green-500 hover:bg-green-50 cursor-pointer'
                                  : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-75'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                      {isAccessible ? '▶️' : '🔒'}
                                    </span>
                                    <div>
                                      <h4 className="font-semibold text-lg text-charcoal">
                                        Lesson {lesson.id}: {lesson.title}
                                      </h4>
                                      <p className="text-sm text-gray-600">Duration: {lesson.duration}</p>
                                      {lesson.summary && isFreeLesson && (
                                        <p className="text-sm text-gray-600 mt-1 italic">{lesson.summary}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {isFreeLesson && (
                                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    FREE
                                  </span>
                                )}
                                {!isAccessible && !isFreeLesson && (
                                  <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                                    LOCKED
                                  </span>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )})}
              </div>
            </div>

          {/* Course Chapters */}
          <div className="space-y-6">
            {courseData.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`bg-gradient-to-r ${getSubjectColor(chapter.subject)} text-white p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold mb-1 opacity-90">{chapter.subject}</div>
                      <h2 className="text-2xl font-bold mb-2">
                        Chapter {chapter.id}: {chapter.title}
                      </h2>
                      <p className="text-blue-100">{chapter.description}</p>
                    </div>
                    {!hasPurchased && chapter.id > 1 && (
                      <div className="text-4xl">🔒</div>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {chapter.lessons.map((lesson) => {
                      const isAccessible = (chapter.id === 1 && lesson.id === 1) || hasPurchased
                      const isFreeLesson = chapter.id === 1 && lesson.id === 1
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(chapter.id, lesson.id, isFreeLesson)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition ${
                            isAccessible
                              ? 'border-green-300 hover:border-green-500 hover:bg-green-50 cursor-pointer'
                              : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-75'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {isAccessible ? '▶️' : '🔒'}
                                </span>
                                <div>
                                  <h3 className="font-semibold text-lg text-charcoal">
                                    Lesson {lesson.id}: {lesson.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">Duration: {lesson.duration}</p>
                                </div>
                              </div>
                            </div>
                            {isFreeLesson && (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                FREE
                              </span>
                            )}
                            {!isAccessible && !isFreeLesson && (
                              <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                                LOCKED
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Purchase CTA at bottom */}
          {!hasPurchased && (
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Master JEE?</h2>
              <p className="text-xl mb-6">
                Get lifetime access to comprehensive Physics, Chemistry, and Mathematics content
              </p>
              <div className="bg-white text-primary p-6 rounded-lg inline-block mb-6">
                <div className="text-xl font-semibold mb-2">Complete JEE Course</div>
                <div className="text-5xl font-bold mb-2">{pricing.basePrice}</div>
                <div className="text-lg mb-2">+ GST {pricing.gstAmount}</div>
                <div className="text-2xl font-bold border-t-2 border-gray-300 pt-2">Total: {pricing.totalPrice}</div>
                {pricing.isIntroductory && (
                  <p className="text-sm text-gray-600 mt-2">Introductory offer until {pricing.introEndDate}</p>
                )}
              </div>
              <div>
                <Link href="https://www.aienter.in/payments" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-primary px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition shadow-lg">
                  Purchase Now →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      </main>
    </>
  )
}
