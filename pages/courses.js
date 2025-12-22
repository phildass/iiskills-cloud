import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const coursesData = [
  {
    id: 1,
    name: "Learn AI",
    category: "Technology",
    description: "Discover the fundamentals of Artificial Intelligence, machine learning concepts, and practical AI applications for modern business and innovation.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to AI", isFree: true },
      { id: 2, title: "Machine Learning Basics", isFree: false },
      { id: 3, title: "Neural Networks Overview", isFree: false },
      { id: 4, title: "AI Applications in Business", isFree: false },
      { id: 5, title: "Natural Language Processing", isFree: false },
      { id: 6, title: "Computer Vision Fundamentals", isFree: false },
      { id: 7, title: "AI Ethics and Responsibility", isFree: false },
      { id: 8, title: "AI Tools and Platforms", isFree: false },
      { id: 9, title: "Building AI Solutions", isFree: false },
      { id: 10, title: "Future of AI", isFree: false }
    ]
  },
  {
    id: 2,
    name: "Learn PR",
    category: "Communication",
    description: "Master Public Relations strategies, media management, brand building, and effective communication for organizations and individuals.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Public Relations", isFree: true },
      { id: 2, title: "Media Relations", isFree: false },
      { id: 3, title: "Crisis Communication", isFree: false },
      { id: 4, title: "Brand Management", isFree: false },
      { id: 5, title: "Press Release Writing", isFree: false },
      { id: 6, title: "Digital PR Strategies", isFree: false },
      { id: 7, title: "Event Management", isFree: false },
      { id: 8, title: "Stakeholder Engagement", isFree: false },
      { id: 9, title: "PR Measurement and Analytics", isFree: false },
      { id: 10, title: "Building PR Campaigns", isFree: false }
    ]
  },
  {
    id: 3,
    name: "Learn English",
    category: "Language",
    description: "Improve your English language skills for professional and personal success. Focus on grammar, vocabulary, communication, and fluency.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "English Fundamentals", isFree: true },
      { id: 2, title: "Grammar Essentials", isFree: false },
      { id: 3, title: "Vocabulary Building", isFree: false },
      { id: 4, title: "Speaking and Pronunciation", isFree: false },
      { id: 5, title: "Writing Skills", isFree: false },
      { id: 6, title: "Business English", isFree: false },
      { id: 7, title: "Reading Comprehension", isFree: false },
      { id: 8, title: "Listening Skills", isFree: false },
      { id: 9, title: "Email and Professional Writing", isFree: false },
      { id: 10, title: "Conversational English", isFree: false }
    ]
  },
  {
    id: 4,
    name: "Learn Etiquette",
    category: "Personal Development",
    description: "Develop professional etiquette, social skills, and business manners to make lasting positive impressions in any setting.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Etiquette", isFree: true },
      { id: 2, title: "Business Etiquette", isFree: false },
      { id: 3, title: "Dining Etiquette", isFree: false },
      { id: 4, title: "Communication Etiquette", isFree: false },
      { id: 5, title: "Email and Phone Etiquette", isFree: false },
      { id: 6, title: "Meeting and Interview Etiquette", isFree: false },
      { id: 7, title: "Social Media Etiquette", isFree: false },
      { id: 8, title: "International Business Etiquette", isFree: false },
      { id: 9, title: "Dress Code and Grooming", isFree: false },
      { id: 10, title: "Building Professional Relationships", isFree: false }
    ]
  },
  {
    id: 5,
    name: "Learn Investments",
    category: "Finance",
    description: "Understand investment fundamentals, portfolio management, risk assessment, and wealth building strategies for financial growth.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Investing", isFree: true },
      { id: 2, title: "Stock Market Basics", isFree: false },
      { id: 3, title: "Bonds and Fixed Income", isFree: false },
      { id: 4, title: "Mutual Funds and ETFs", isFree: false },
      { id: 5, title: "Risk and Return", isFree: false },
      { id: 6, title: "Portfolio Diversification", isFree: false },
      { id: 7, title: "Real Estate Investment", isFree: false },
      { id: 8, title: "Tax-Efficient Investing", isFree: false },
      { id: 9, title: "Retirement Planning", isFree: false },
      { id: 10, title: "Building Your Investment Strategy", isFree: false }
    ]
  },
  {
    id: 6,
    name: "Learn Journalism",
    category: "Communication",
    description: "Explore journalism fundamentals, news writing, reporting, ethics, and media storytelling for digital and traditional platforms.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Journalism", isFree: true },
      { id: 2, title: "News Writing Basics", isFree: false },
      { id: 3, title: "Investigative Journalism", isFree: false },
      { id: 4, title: "Interviewing Techniques", isFree: false },
      { id: 5, title: "Digital Journalism", isFree: false },
      { id: 6, title: "Journalism Ethics", isFree: false },
      { id: 7, title: "Multimedia Storytelling", isFree: false },
      { id: 8, title: "Broadcast Journalism", isFree: false },
      { id: 9, title: "Social Media Journalism", isFree: false },
      { id: 10, title: "Creating Your Portfolio", isFree: false }
    ]
  },
  {
    id: 7,
    name: "Learn Management",
    category: "Professional Skills",
    description: "Build essential management skills including team leadership, project planning, decision-making, and organizational effectiveness.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Fundamentals of Management", isFree: true },
      { id: 2, title: "Planning and Strategy", isFree: false },
      { id: 3, title: "Organizing and Delegation", isFree: false },
      { id: 4, title: "Team Building", isFree: false },
      { id: 5, title: "Decision Making", isFree: false },
      { id: 6, title: "Performance Management", isFree: false },
      { id: 7, title: "Conflict Resolution", isFree: false },
      { id: 8, title: "Change Management", isFree: false },
      { id: 9, title: "Time and Resource Management", isFree: false },
      { id: 10, title: "Leadership in Management", isFree: false }
    ]
  },
  {
    id: 8,
    name: "Learn Marketing",
    category: "Business",
    description: "Master marketing principles, consumer behavior, branding strategies, and campaign development for business success.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Marketing Fundamentals", isFree: true },
      { id: 2, title: "Consumer Behavior", isFree: false },
      { id: 3, title: "Market Research", isFree: false },
      { id: 4, title: "Branding and Positioning", isFree: false },
      { id: 5, title: "Digital Marketing", isFree: false },
      { id: 6, title: "Content Marketing", isFree: false },
      { id: 7, title: "Social Media Marketing", isFree: false },
      { id: 8, title: "Marketing Analytics", isFree: false },
      { id: 9, title: "Campaign Planning", isFree: false },
      { id: 10, title: "Marketing Strategy Development", isFree: false }
    ]
  },
  {
    id: 9,
    name: "Learn Sales",
    category: "Business",
    description: "Develop sales techniques, customer relationship skills, negotiation tactics, and strategies to close deals effectively.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Sales", isFree: true },
      { id: 2, title: "Understanding Customer Needs", isFree: false },
      { id: 3, title: "Product Knowledge", isFree: false },
      { id: 4, title: "Sales Techniques", isFree: false },
      { id: 5, title: "Handling Objections", isFree: false },
      { id: 6, title: "Closing Strategies", isFree: false },
      { id: 7, title: "Relationship Building", isFree: false },
      { id: 8, title: "Sales Negotiation", isFree: false },
      { id: 9, title: "CRM and Sales Tools", isFree: false },
      { id: 10, title: "Building a Sales Career", isFree: false }
    ]
  },
  {
    id: 10,
    name: "Learn To Earn - Free",
    category: "Career Development",
    description: "FREE course on earning opportunities, side hustles, freelancing, and creating multiple income streams for financial independence.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Earning Opportunities", isFree: true },
      { id: 2, title: "Freelancing Basics", isFree: false },
      { id: 3, title: "Online Business Models", isFree: false },
      { id: 4, title: "Passive Income Streams", isFree: false },
      { id: 5, title: "Building Your Personal Brand", isFree: false },
      { id: 6, title: "Digital Skills for Earning", isFree: false },
      { id: 7, title: "Marketing Your Services", isFree: false },
      { id: 8, title: "Time Management for Side Hustles", isFree: false },
      { id: 9, title: "Scaling Your Income", isFree: false },
      { id: 10, title: "Creating Financial Freedom", isFree: false }
    ]
  },
  {
    id: 11,
    name: "Learn Stock Broking",
    category: "Finance",
    description: "Understand stock market operations, trading strategies, broker responsibilities, and investment analysis for the securities industry.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Stock Broking", isFree: true },
      { id: 2, title: "Stock Market Structure", isFree: false },
      { id: 3, title: "Trading Platforms and Tools", isFree: false },
      { id: 4, title: "Technical Analysis", isFree: false },
      { id: 5, title: "Fundamental Analysis", isFree: false },
      { id: 6, title: "Risk Management", isFree: false },
      { id: 7, title: "Regulatory Framework", isFree: false },
      { id: 8, title: "Client Advisory", isFree: false },
      { id: 9, title: "Portfolio Management", isFree: false },
      { id: 10, title: "Career in Stock Broking", isFree: false }
    ]
  },
  {
    id: 12,
    name: "Learn To Be a Beautician",
    category: "Professional Skills",
    description: "Gain skills in beauty treatments, skincare, makeup artistry, and salon management to build a successful beautician career.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Beauty Industry", isFree: true },
      { id: 2, title: "Skincare Fundamentals", isFree: false },
      { id: 3, title: "Makeup Techniques", isFree: false },
      { id: 4, title: "Hair Styling Basics", isFree: false },
      { id: 5, title: "Nail Care and Art", isFree: false },
      { id: 6, title: "Facial Treatments", isFree: false },
      { id: 7, title: "Bridal Makeup", isFree: false },
      { id: 8, title: "Hygiene and Safety", isFree: false },
      { id: 9, title: "Client Consultation", isFree: false },
      { id: 10, title: "Starting Your Beauty Business", isFree: false }
    ]
  },
  {
    id: 13,
    name: "Learn Photography",
    category: "Creative Arts",
    description: "Master photography techniques, camera operation, composition, lighting, and post-processing to capture stunning images.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Photography Basics", isFree: true },
      { id: 2, title: "Camera Operations", isFree: false },
      { id: 3, title: "Composition Techniques", isFree: false },
      { id: 4, title: "Understanding Light", isFree: false },
      { id: 5, title: "Portrait Photography", isFree: false },
      { id: 6, title: "Landscape Photography", isFree: false },
      { id: 7, title: "Photo Editing", isFree: false },
      { id: 8, title: "Product Photography", isFree: false },
      { id: 9, title: "Building Your Portfolio", isFree: false },
      { id: 10, title: "Photography Business", isFree: false }
    ]
  },
  {
    id: 14,
    name: "Learn Aptitude – Free",
    category: "Personal Development",
    description: "FREE course to develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams and career growth.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Aptitude", isFree: true },
      { id: 2, title: "Numerical Ability", isFree: false },
      { id: 3, title: "Logical Reasoning", isFree: false },
      { id: 4, title: "Verbal Ability", isFree: false },
      { id: 5, title: "Data Interpretation", isFree: false },
      { id: 6, title: "Problem Solving", isFree: false },
      { id: 7, title: "Time Management in Tests", isFree: false },
      { id: 8, title: "Pattern Recognition", isFree: false },
      { id: 9, title: "Practice Tests", isFree: false },
      { id: 10, title: "Exam Strategies", isFree: false }
    ]
  },
  {
    id: 15,
    name: "Learn Winning – From the book",
    category: "Personal Development",
    description: "Based on proven success principles, learn winning strategies, mindset development, and achievement techniques. Features audio download.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    hasAudioDownload: true,
    modules: [
      { id: 1, title: "Introduction to Winning", isFree: true },
      { id: 2, title: "Developing a Winner's Mindset", isFree: false },
      { id: 3, title: "Goal Setting and Achievement", isFree: false },
      { id: 4, title: "Overcoming Obstacles", isFree: false },
      { id: 5, title: "Building Resilience", isFree: false },
      { id: 6, title: "Success Habits", isFree: false },
      { id: 7, title: "Strategic Thinking", isFree: false },
      { id: 8, title: "Competitive Excellence", isFree: false },
      { id: 9, title: "Continuous Improvement", isFree: false },
      { id: 10, title: "Sustaining Success", isFree: false }
    ]
  },
  {
    id: 16,
    name: "Learn Becoming the Better You – From the book",
    category: "Personal Development",
    description: "Transform yourself with personal growth strategies, self-improvement techniques, and life enhancement principles. Features audio download.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    hasAudioDownload: true,
    modules: [
      { id: 1, title: "Introduction to Self-Improvement", isFree: true },
      { id: 2, title: "Self-Awareness and Discovery", isFree: false },
      { id: 3, title: "Building Confidence", isFree: false },
      { id: 4, title: "Emotional Intelligence", isFree: false },
      { id: 5, title: "Positive Thinking", isFree: false },
      { id: 6, title: "Developing Good Habits", isFree: false },
      { id: 7, title: "Relationship Building", isFree: false },
      { id: 8, title: "Health and Wellness", isFree: false },
      { id: 9, title: "Life Balance", isFree: false },
      { id: 10, title: "Your Better Future", isFree: false }
    ]
  },
  {
    id: 17,
    name: "Learn Leadership",
    category: "Professional Skills",
    description: "Develop leadership qualities, team management skills, vision setting, and the ability to inspire and guide others to success.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Leadership Fundamentals", isFree: true },
      { id: 2, title: "Leadership Styles", isFree: false },
      { id: 3, title: "Vision and Strategy", isFree: false },
      { id: 4, title: "Team Building and Motivation", isFree: false },
      { id: 5, title: "Decision Making", isFree: false },
      { id: 6, title: "Communication for Leaders", isFree: false },
      { id: 7, title: "Conflict Management", isFree: false },
      { id: 8, title: "Change Leadership", isFree: false },
      { id: 9, title: "Ethical Leadership", isFree: false },
      { id: 10, title: "Developing Future Leaders", isFree: false }
    ]
  },
  {
    id: 18,
    name: "Learn Maths – Free",
    category: "Education",
    description: "FREE comprehensive mathematics course covering fundamental to advanced concepts for academic and practical applications.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Mathematics", isFree: true },
      { id: 2, title: "Algebra Basics", isFree: false },
      { id: 3, title: "Geometry", isFree: false },
      { id: 4, title: "Trigonometry", isFree: false },
      { id: 5, title: "Calculus Introduction", isFree: false },
      { id: 6, title: "Statistics and Probability", isFree: false },
      { id: 7, title: "Mathematical Reasoning", isFree: false },
      { id: 8, title: "Applied Mathematics", isFree: false },
      { id: 9, title: "Problem Solving Techniques", isFree: false },
      { id: 10, title: "Advanced Concepts", isFree: false }
    ]
  },
  {
    id: 19,
    name: "Learn Geography – Free",
    category: "Education",
    description: "FREE exploration of world geography, physical features, climate patterns, cultures, and global relationships.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Geography", isFree: true },
      { id: 2, title: "Physical Geography", isFree: false },
      { id: 3, title: "Climate and Weather", isFree: false },
      { id: 4, title: "World Regions", isFree: false },
      { id: 5, title: "Human Geography", isFree: false },
      { id: 6, title: "Map Reading and GIS", isFree: false },
      { id: 7, title: "Environmental Geography", isFree: false },
      { id: 8, title: "Economic Geography", isFree: false },
      { id: 9, title: "Cultural Geography", isFree: false },
      { id: 10, title: "Global Issues", isFree: false }
    ]
  },
  {
    id: 20,
    name: "Learn Physics – Free",
    category: "Education",
    description: "FREE physics course covering mechanics, energy, waves, electricity, and modern physics concepts with practical applications.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Physics", isFree: true },
      { id: 2, title: "Mechanics and Motion", isFree: false },
      { id: 3, title: "Forces and Energy", isFree: false },
      { id: 4, title: "Heat and Thermodynamics", isFree: false },
      { id: 5, title: "Waves and Sound", isFree: false },
      { id: 6, title: "Light and Optics", isFree: false },
      { id: 7, title: "Electricity and Magnetism", isFree: false },
      { id: 8, title: "Modern Physics", isFree: false },
      { id: 9, title: "Quantum Physics Basics", isFree: false },
      { id: 10, title: "Applied Physics", isFree: false }
    ]
  },
  {
    id: 21,
    name: "Learn Chemistry – Free",
    category: "Education",
    description: "FREE chemistry course exploring matter, chemical reactions, organic and inorganic chemistry, and real-world applications.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Chemistry", isFree: true },
      { id: 2, title: "Atomic Structure", isFree: false },
      { id: 3, title: "Chemical Bonding", isFree: false },
      { id: 4, title: "Chemical Reactions", isFree: false },
      { id: 5, title: "Organic Chemistry Basics", isFree: false },
      { id: 6, title: "Inorganic Chemistry", isFree: false },
      { id: 7, title: "Acids, Bases, and Salts", isFree: false },
      { id: 8, title: "Electrochemistry", isFree: false },
      { id: 9, title: "Environmental Chemistry", isFree: false },
      { id: 10, title: "Applied Chemistry", isFree: false }
    ]
  },
  {
    id: 22,
    name: "Learn Public Speaking",
    category: "Communication",
    description: "Overcome stage fright and master public speaking skills. Learn to deliver confident, persuasive presentations that captivate audiences.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Public Speaking", isFree: true },
      { id: 2, title: "Overcoming Fear", isFree: false },
      { id: 3, title: "Voice and Diction", isFree: false },
      { id: 4, title: "Body Language", isFree: false },
      { id: 5, title: "Speech Structure", isFree: false },
      { id: 6, title: "Engaging Your Audience", isFree: false },
      { id: 7, title: "Persuasive Speaking", isFree: false },
      { id: 8, title: "Handling Q&A", isFree: false },
      { id: 9, title: "Visual Aids and Props", isFree: false },
      { id: 10, title: "Professional Presentations", isFree: false }
    ]
  }
]

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')

  const categories = ['All', 'Technology', 'Communication', 'Language', 'Personal Development', 'Finance', 'Professional Skills', 'Business', 'Career Development', 'Creative Arts', 'Education']
  const levels = ['All', 'Beginner', 'Intermediate']

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  return (
    <>
      <Head>
        <title>Courses - iiskills.cloud</title>
        <meta name="description" content="Explore 22 professional and personal development courses including AI, Marketing, Finance, and more. Many free courses available!" />
      </Head>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Courses</h1>
          <p className="text-xl text-charcoal mb-2">Professional Skills Development for Everyone</p>
          <p className="text-lg text-gray-600">22 courses across multiple domains - Many FREE courses available!</p>
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
              
              {/* Free Badge */}
              {course.isFree && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                  FREE
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
                
                {/* Free sample module indicator */}
                {course.modules && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                    <p className="text-sm text-green-800 font-semibold">
                      🎁 Free Sample: {course.modules.find(m => m.isFree)?.title}
                    </p>
                  </div>
                )}
                
                {/* Audio Download Feature */}
                {course.hasAudioDownload && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                    <p className="text-sm text-blue-800 font-semibold flex items-center">
                      🎧 Includes Audio Download
                    </p>
                  </div>
                )}
                
                <button className="w-full bg-accent text-white py-3 rounded font-bold hover:bg-purple-600 transition">
                  {course.isFree ? 'Start Free Course' : 'Enroll Now'}
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
