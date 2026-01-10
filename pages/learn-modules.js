import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSubdomains } from '../utils/courseSubdomainMapperClient'

export default function LearnModules() {
  // Detect if we're in development mode (client-side safe)
  const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  const allSubdomains = getAllSubdomains(isDevelopment)
  
  // Metadata for each module (icons, descriptions, features)
  const moduleMetadata = {
    'learn-apt': {
      title: 'Learn Aptitude',
      description: 'Develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams.',
      colorClass: 'bg-gradient-to-r from-blue-600 to-primary',
      icon: '🧮',
      features: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Pattern Recognition']
    },
    'learn-math': {
      title: 'Learn Mathematics',
      description: 'Master mathematical concepts, problem-solving techniques, and advance your quantitative skills.',
      colorClass: 'bg-gradient-to-r from-indigo-600 to-primary',
      icon: '📐',
      features: ['Algebra', 'Geometry', 'Calculus', 'Statistics']
    },
    'learn-winning': {
      title: 'Learn Winning',
      description: 'Develop a winning mindset, success strategies, and achieve your personal and professional goals.',
      colorClass: 'bg-gradient-to-r from-green-600 to-primary',
      icon: '🏆',
      features: ['Goal Setting', 'Success Mindset', 'Performance Optimization', 'Personal Growth']
    },
    'learn-data-science': {
      title: 'Learn Data Science',
      description: 'Master data analysis, visualization, machine learning, and turn data into insights.',
      colorClass: 'bg-gradient-to-r from-purple-600 to-primary',
      icon: '📊',
      features: ['Data Analysis', 'Machine Learning', 'Visualization', 'Python/R']
    },
    'learn-management': {
      title: 'Learn Management',
      description: 'Build essential management skills, strategic thinking, and lead teams effectively.',
      colorClass: 'bg-gradient-to-r from-orange-600 to-primary',
      icon: '📈',
      features: ['Strategic Planning', 'Team Leadership', 'Project Management', 'Decision Making']
    },
    'learn-leadership': {
      title: 'Learn Leadership',
      description: 'Develop leadership capabilities, influence, and inspire others to achieve excellence.',
      colorClass: 'bg-gradient-to-r from-red-600 to-primary',
      icon: '👔',
      features: ['Influencing Skills', 'Team Building', 'Communication', 'Vision Setting']
    },
    'learn-ai': {
      title: 'Learn AI',
      description: 'Explore Artificial Intelligence fundamentals, applications, and prepare for the AI-driven future.',
      colorClass: 'bg-gradient-to-r from-cyan-600 to-primary',
      icon: '🤖',
      features: ['AI Fundamentals', 'Neural Networks', 'AI Applications', 'Ethics & Governance']
    },
    'learn-pr': {
      title: 'Learn PR',
      description: 'Master Public Relations, communication strategies, and build powerful brand narratives.',
      colorClass: 'bg-gradient-to-r from-pink-600 to-primary',
      icon: '📣',
      features: ['Media Relations', 'Brand Building', 'Crisis Management', 'Content Strategy']
    },
    'learn-jee': {
      title: 'Learn JEE',
      description: 'Comprehensive JEE preparation with Physics, Chemistry, and Mathematics for engineering entrance exams.',
      colorClass: 'bg-gradient-to-r from-yellow-600 to-primary',
      icon: '🎓',
      features: ['Physics', 'Chemistry', 'Mathematics', 'Problem-Solving']
    },
    'learn-neet': {
      title: 'Learn NEET',
      description: 'Complete NEET preparation with Biology, Chemistry, and Physics for medical entrance exams.',
      colorClass: 'bg-gradient-to-r from-teal-600 to-primary',
      icon: '🏥',
      features: ['Biology', 'Chemistry', 'Physics', 'Medical Concepts']
    },
    'learn-physics': {
      title: 'Learn Physics',
      description: 'Master physics concepts from mechanics to modern physics with practical applications.',
      colorClass: 'bg-gradient-to-r from-blue-700 to-primary',
      icon: '⚛️',
      features: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics']
    },
    'learn-chemistry': {
      title: 'Learn Chemistry',
      description: 'Explore chemistry from atomic structure to organic reactions and real-world applications.',
      colorClass: 'bg-gradient-to-r from-green-700 to-primary',
      icon: '🧪',
      features: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Lab Techniques']
    },
    'learn-geography': {
      title: 'Learn Geography',
      description: 'Discover world geography, physical features, climate patterns, and global relationships.',
      colorClass: 'bg-gradient-to-r from-emerald-600 to-primary',
      icon: '🌍',
      features: ['Physical Geography', 'Human Geography', 'Climate', 'World Regions']
    },
    'learn-govt-jobs': {
      title: 'Learn Govt. Jobs',
      description: 'Master government exam preparation with expert guidance for IBPS, SBI, Railways, SSC and more.',
      colorClass: 'bg-gradient-to-r from-amber-600 to-primary',
      icon: '🏛️',
      features: ['Quantitative Aptitude', 'Reasoning', 'General Awareness', 'Mock Tests']
    },
    'learn-ias': {
      title: 'Learn IAS',
      description: 'Comprehensive UPSC Civil Services preparation with cutting-edge AI content and strategic guidance.',
      colorClass: 'bg-gradient-to-r from-rose-600 to-primary',
      icon: '🎯',
      features: ['General Studies', 'Current Affairs', 'Essay Writing', 'Interview Prep']
    }
  }
  
  // Combine subdomain data with metadata
  const modules = allSubdomains.map(subdomain => {
    const metadata = moduleMetadata[subdomain.subdomain] || {
      title: subdomain.subdomain.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: `Learning module for ${subdomain.subdomain}`,
      colorClass: 'bg-gradient-to-r from-gray-600 to-primary',
      icon: '📚',
      features: ['Course Content', 'Interactive Learning', 'Assessments', 'Certificates']
    }
    
    return {
      name: subdomain.subdomain,
      subdomain: subdomain.productionUrl.replace('https://', ''),
      localPort: subdomain.localPort,
      url: subdomain.url,
      status: 'Available',
      ...metadata
    }
  })

  return (
    <>
      <Head>
        <title>Learning Modules - iiskills.cloud</title>
        <meta name="description" content="Explore all learning modules on iiskills.cloud. Access specialized courses via dedicated subdomains." />
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary to-accent text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Learning Modules</h1>
            <p className="text-2xl mb-4 max-w-3xl mx-auto">
              Access specialized learning experiences through our dedicated module subdomains
            </p>
            <p className="text-lg max-w-2xl mx-auto opacity-90">
              Each module is a complete learning platform with shared authentication, 
              allowing you to seamlessly switch between different subjects while maintaining your progress.
            </p>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">Available Learning Modules</h2>
              <p className="text-xl text-charcoal">
                Choose a module to begin your learning journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module) => (
                <div 
                  key={module.name}
                  className="bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-transparent hover:border-primary group"
                >
                  <div className={`${module.colorClass} p-6 text-white`}>
                    <div className="text-6xl mb-4 text-center">{module.icon}</div>
                    <h3 className="text-2xl font-bold text-center mb-2">{module.title}</h3>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-charcoal mb-4 text-center">
                      {module.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="font-bold text-primary mb-2">Key Topics:</h4>
                      <ul className="space-y-1">
                        {module.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-charcoal flex items-start">
                            <span className="text-accent mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-1">Production Subdomain:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                          {module.subdomain}
                        </code>
                      </div>
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-1">Local Development:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                          localhost:{module.localPort}
                        </code>
                      </div>
                      
                      <div className="flex gap-2">
                        <a 
                          href={module.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 text-center ${module.colorClass} text-white px-4 py-3 rounded-lg font-bold hover:opacity-90 transition`}
                        >
                          Access Module →
                        </a>
                      </div>

                      <p className="text-xs text-gray-500 mt-3 text-center">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">
                          {module.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Choose Your Module</h3>
                <p className="text-charcoal">
                  Select any learning module that matches your goals and interests from our comprehensive catalog.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-accent text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Single Sign-On</h3>
                <p className="text-charcoal">
                  Register once and access all modules with the same account. Seamless authentication across all subdomains.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Learn & Grow</h3>
                <p className="text-charcoal">
                  Progress through structured content, complete exercises, and earn certificates for each module.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Architecture */}
        <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">
              Unified Architecture
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-accent mb-4">
                    🔐 Shared Authentication
                  </h3>
                  <p className="text-charcoal mb-4">
                    All modules use the same Supabase authentication backend with cross-subdomain session sharing.
                    Login once and access all learning modules seamlessly.
                  </p>
                  <ul className="space-y-2 text-charcoal">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Single account for all modules</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Secure cross-subdomain cookies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Centralized user management</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-accent mb-4">
                    🏗️ Independent Deployment
                  </h3>
                  <p className="text-charcoal mb-4">
                    Each module is a standalone Next.js application that can be deployed independently 
                    on its own subdomain with dedicated resources.
                  </p>
                  <ul className="space-y-2 text-charcoal">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Dedicated subdomains</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Scalable architecture</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Shared component library</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Start Learning Today</h2>
            <p className="text-xl mb-8">
              Access world-class learning content at an affordable price
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition shadow-lg">
                Create Free Account
              </Link>
              <Link href="/courses" className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition">
                Browse Courses
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
