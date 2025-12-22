import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const coursesData = [
  {
    id: 1,
    name: "Professional Communication Skills",
    category: "Professional Skills",
    description: "Master the art of clear, confident communication in professional settings. Learn to express ideas effectively and build rapport.",
    duration: "4 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 2,
    name: "Digital Marketing Fundamentals",
    category: "Technical Skills",
    description: "Learn the essentials of digital marketing including SEO, social media, content marketing, and analytics.",
    duration: "6 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 3,
    name: "Data Analysis with Excel",
    category: "Technical Skills",
    description: "Unlock the power of Excel for data analysis. Master formulas, pivot tables, charts, and data visualization.",
    duration: "5 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 4,
    name: "Public Speaking Mastery",
    category: "Personal Development",
    description: "Overcome stage fright and deliver compelling presentations. Build confidence and captivate any audience.",
    duration: "4 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 5,
    name: "Project Management Basics",
    category: "Professional Skills",
    description: "Learn fundamental project management principles, tools, and techniques to lead successful projects.",
    duration: "6 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 6,
    name: "Creative Writing",
    category: "Personal Development",
    description: "Develop your creative writing skills. Learn storytelling, character development, and narrative techniques.",
    duration: "8 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 7,
    name: "Business English",
    category: "Professional Skills",
    description: "Enhance your English language skills for business contexts. Perfect for emails, meetings, and presentations.",
    duration: "6 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 8,
    name: "Leadership Development",
    category: "Professional Skills",
    description: "Build essential leadership qualities. Learn to inspire teams, make decisions, and drive organizational success.",
    duration: "8 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 9,
    name: "Time Management Excellence",
    category: "Personal Development",
    description: "Master time management strategies to boost productivity and achieve work-life balance.",
    duration: "3 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 10,
    name: "Graphic Design Fundamentals",
    category: "Technical Skills",
    description: "Learn design principles, color theory, and tools like Canva and Adobe Express to create stunning visuals.",
    duration: "6 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 11,
    name: "Social Media Marketing",
    category: "Technical Skills",
    description: "Master social media platforms for business. Create engaging content and grow your online presence.",
    duration: "5 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 12,
    name: "Financial Literacy",
    category: "Personal Development",
    description: "Understand personal finance, budgeting, investing, and wealth building for long-term financial success.",
    duration: "6 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 13,
    name: "Customer Service Excellence",
    category: "Professional Skills",
    description: "Learn to deliver exceptional customer service that builds loyalty and drives business growth.",
    duration: "4 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 14,
    name: "Presentation Skills",
    category: "Professional Skills",
    description: "Create and deliver impactful presentations using PowerPoint and other tools. Engage and persuade your audience.",
    duration: "4 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 15,
    name: "Email Marketing",
    category: "Technical Skills",
    description: "Build effective email campaigns that convert. Learn list building, copywriting, and automation.",
    duration: "4 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 16,
    name: "Content Writing",
    category: "Technical Skills",
    description: "Master the art of writing compelling content for web, blogs, and marketing materials.",
    duration: "6 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 17,
    name: "Personal Branding",
    category: "Personal Development",
    description: "Build a powerful personal brand that opens doors to new opportunities and career advancement.",
    duration: "5 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 18,
    name: "Negotiation Skills",
    category: "Professional Skills",
    description: "Learn proven negotiation techniques to achieve win-win outcomes in business and life.",
    duration: "4 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 19,
    name: "Critical Thinking",
    category: "Personal Development",
    description: "Develop analytical and problem-solving skills. Make better decisions through logical reasoning.",
    duration: "5 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  {
    id: 20,
    name: "Career Planning",
    category: "Personal Development",
    description: "Chart your career path strategically. Set goals, identify opportunities, and achieve professional success.",
    duration: "4 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true
  },
  // Learn Series Courses
  {
    id: 21,
    name: "Learn Python Programming",
    category: "Learn Series",
    description: "Master Python from basics to advanced concepts. Build real-world projects and develop programming expertise.",
    duration: "10 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true,
    modules: [
      { id: 1, title: "Introduction to Python", isFree: true },
      { id: 2, title: "Variables and Data Types", isFree: false },
      { id: 3, title: "Control Flow and Loops", isFree: false },
      { id: 4, title: "Functions and Modules", isFree: false },
      { id: 5, title: "Data Structures", isFree: false },
      { id: 6, title: "Object-Oriented Programming", isFree: false },
      { id: 7, title: "File Handling", isFree: false },
      { id: 8, title: "Error Handling and Debugging", isFree: false },
      { id: 9, title: "Libraries and Frameworks", isFree: false },
      { id: 10, title: "Final Project", isFree: false }
    ]
  },
  {
    id: 22,
    name: "Learn JavaScript",
    category: "Learn Series",
    description: "Become proficient in JavaScript, the language of the web. Learn modern ES6+ features and best practices.",
    duration: "10 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true,
    modules: [
      { id: 1, title: "JavaScript Fundamentals", isFree: true },
      { id: 2, title: "DOM Manipulation", isFree: false },
      { id: 3, title: "Events and Event Handlers", isFree: false },
      { id: 4, title: "Arrays and Objects", isFree: false },
      { id: 5, title: "Functions and Scope", isFree: false },
      { id: 6, title: "Asynchronous JavaScript", isFree: false },
      { id: 7, title: "ES6+ Features", isFree: false },
      { id: 8, title: "Working with APIs", isFree: false },
      { id: 9, title: "Modern JavaScript Tools", isFree: false },
      { id: 10, title: "Building a Web Application", isFree: false }
    ]
  },
  {
    id: 23,
    name: "Learn Data Science",
    category: "Learn Series",
    description: "Explore data science fundamentals, analytics, visualization, and machine learning basics to make data-driven decisions.",
    duration: "10 weeks",
    level: "Intermediate",
    price: 99,
    gst: 18,
    comingSoon: true,
    modules: [
      { id: 1, title: "Introduction to Data Science", isFree: true },
      { id: 2, title: "Statistics for Data Science", isFree: false },
      { id: 3, title: "Data Collection and Cleaning", isFree: false },
      { id: 4, title: "Exploratory Data Analysis", isFree: false },
      { id: 5, title: "Data Visualization", isFree: false },
      { id: 6, title: "Introduction to Machine Learning", isFree: false },
      { id: 7, title: "Regression and Classification", isFree: false },
      { id: 8, title: "Clustering and Dimensionality Reduction", isFree: false },
      { id: 9, title: "Model Evaluation and Optimization", isFree: false },
      { id: 10, title: "Capstone Project", isFree: false }
    ]
  },
  {
    id: 24,
    name: "Learn Web Development",
    category: "Learn Series",
    description: "Build modern, responsive websites from scratch. Learn HTML, CSS, JavaScript, and popular frameworks.",
    duration: "10 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true,
    modules: [
      { id: 1, title: "HTML Fundamentals", isFree: true },
      { id: 2, title: "CSS Styling and Layouts", isFree: false },
      { id: 3, title: "Responsive Design", isFree: false },
      { id: 4, title: "JavaScript Basics", isFree: false },
      { id: 5, title: "Frontend Frameworks", isFree: false },
      { id: 6, title: "Backend Basics", isFree: false },
      { id: 7, title: "Databases and APIs", isFree: false },
      { id: 8, title: "Version Control with Git", isFree: false },
      { id: 9, title: "Deployment and Hosting", isFree: false },
      { id: 10, title: "Portfolio Website Project", isFree: false }
    ]
  },
  {
    id: 25,
    name: "Learn Digital Illustration",
    category: "Learn Series",
    description: "Master digital art and illustration techniques. Create stunning artwork using industry-standard tools.",
    duration: "10 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true,
    modules: [
      { id: 1, title: "Introduction to Digital Art", isFree: true },
      { id: 2, title: "Drawing Fundamentals", isFree: false },
      { id: 3, title: "Color Theory and Application", isFree: false },
      { id: 4, title: "Character Design", isFree: false },
      { id: 5, title: "Digital Painting Techniques", isFree: false },
      { id: 6, title: "Composition and Perspective", isFree: false },
      { id: 7, title: "Lighting and Shading", isFree: false },
      { id: 8, title: "Creating Environments", isFree: false },
      { id: 9, title: "Professional Workflow", isFree: false },
      { id: 10, title: "Final Portfolio Piece", isFree: false }
    ]
  },
  {
    id: 26,
    name: "Learn SQL and Databases",
    category: "Learn Series",
    description: "Master database fundamentals and SQL queries. Learn to design, manage, and query databases effectively.",
    duration: "10 weeks",
    level: "Beginner",
    price: 99,
    gst: 18,
    comingSoon: true,
    modules: [
      { id: 1, title: "Database Fundamentals", isFree: true },
      { id: 2, title: "SQL Basics and Queries", isFree: false },
      { id: 3, title: "Filtering and Sorting Data", isFree: false },
      { id: 4, title: "Joins and Relationships", isFree: false },
      { id: 5, title: "Aggregate Functions", isFree: false },
      { id: 6, title: "Database Design", isFree: false },
      { id: 7, title: "Advanced Queries", isFree: false },
      { id: 8, title: "Database Administration", isFree: false },
      { id: 9, title: "Performance Optimization", isFree: false },
      { id: 10, title: "Real-World Database Project", isFree: false }
    ]
  }
]

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')

  const categories = ['All', 'Professional Skills', 'Technical Skills', 'Personal Development', 'Learn Series']
  const levels = ['All', 'Beginner', 'Intermediate']

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const calculateTotal = (price, gstRate) => {
    return price + (price * gstRate / 100)
  }

  return (
    <>
      <Head>
        <title>Courses - iiskills.cloud</title>
        <meta name="description" content="Explore 20+ affordable courses for professional and personal development. Only ₹99 + GST per course." />
      </Head>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Courses</h1>
          <p className="text-xl text-charcoal mb-2">Professional Skills Development for Everyone</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Search Courses</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition relative">
              {/* Coming Soon Badge */}
              {course.comingSoon && (
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                  Coming Soon
                </div>
              )}
              
              <div className="bg-gradient-to-r from-primary to-accent p-4">
                <span className="text-white text-sm font-semibold">{course.category}</span>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2">{course.name}</h3>
                <p className="text-charcoal mb-4 text-sm">{course.description}</p>
                
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>⏱️ {course.duration}</span>
                  <span className="font-semibold text-accent">{course.level}</span>
                </div>
                
                {/* Free sample module indicator for Learn Series */}
                {course.modules && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                    <p className="text-sm text-green-800 font-semibold">
                      🎁 Free Sample: {course.modules.find(m => m.isFree)?.title}
                    </p>
                  </div>
                )}
                
                <button className="w-full bg-accent text-white py-3 rounded font-bold hover:bg-purple-600 transition">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No courses found matching your filters.</p>
          </div>
        )}

        {/* Expansion Note */}
        <div className="bg-blue-50 border-l-4 border-primary p-6 rounded">
          <h2 className="text-xl font-bold text-primary mb-2">🚀 Growing Course Library</h2>
          <p className="text-charcoal">
            We're continuously expanding our course offerings! New courses are being added regularly to help you develop a wide range of professional and personal skills. Check back often to discover new learning opportunities.
          </p>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
