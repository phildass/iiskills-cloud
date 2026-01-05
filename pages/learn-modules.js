import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function LearnModules() {
  const modules = [
    {
      name: 'learn-apt',
      title: 'Learn Aptitude',
      description: 'Develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams.',
      subdomain: 'learn-apt.iiskills.cloud',
      localPort: '3001',
      colorClass: 'bg-gradient-to-r from-blue-600 to-primary',
      icon: '🧮',
      status: 'Available',
      features: ['Quantitative Aptitude', 'Logical Reasoning', 'Data Interpretation', 'Pattern Recognition']
    },
    {
      name: 'learn-math',
      title: 'Learn Mathematics',
      description: 'Master mathematical concepts, problem-solving techniques, and advance your quantitative skills.',
      subdomain: 'learn-math.iiskills.cloud',
      localPort: '3002',
      colorClass: 'bg-gradient-to-r from-indigo-600 to-primary',
      icon: '📐',
      status: 'Available',
      features: ['Algebra', 'Geometry', 'Calculus', 'Statistics']
    },
    {
      name: 'learn-winning',
      title: 'Learn Winning',
      description: 'Develop a winning mindset, success strategies, and achieve your personal and professional goals.',
      subdomain: 'learn-winning.iiskills.cloud',
      localPort: '3003',
      colorClass: 'bg-gradient-to-r from-green-600 to-primary',
      icon: '🏆',
      status: 'Available',
      features: ['Goal Setting', 'Success Mindset', 'Performance Optimization', 'Personal Growth']
    },
    {
      name: 'learn-data-science',
      title: 'Learn Data Science',
      description: 'Master data analysis, visualization, machine learning, and turn data into insights.',
      subdomain: 'learn-data-science.iiskills.cloud',
      localPort: '3004',
      colorClass: 'bg-gradient-to-r from-purple-600 to-primary',
      icon: '📊',
      status: 'Available',
      features: ['Data Analysis', 'Machine Learning', 'Visualization', 'Python/R']
    },
    {
      name: 'learn-management',
      title: 'Learn Management',
      description: 'Build essential management skills, strategic thinking, and lead teams effectively.',
      subdomain: 'learn-management.iiskills.cloud',
      localPort: '3005',
      colorClass: 'bg-gradient-to-r from-orange-600 to-primary',
      icon: '📈',
      status: 'Available',
      features: ['Strategic Planning', 'Team Leadership', 'Project Management', 'Decision Making']
    },
    {
      name: 'learn-leadership',
      title: 'Learn Leadership',
      description: 'Develop leadership capabilities, influence, and inspire others to achieve excellence.',
      subdomain: 'learn-leadership.iiskills.cloud',
      localPort: '3006',
      colorClass: 'bg-gradient-to-r from-red-600 to-primary',
      icon: '👔',
      status: 'Available',
      features: ['Influencing Skills', 'Team Building', 'Communication', 'Vision Setting']
    },
    {
      name: 'learn-ai',
      title: 'Learn AI',
      description: 'Explore Artificial Intelligence fundamentals, applications, and prepare for the AI-driven future.',
      subdomain: 'learn-ai.iiskills.cloud',
      localPort: '3007',
      colorClass: 'bg-gradient-to-r from-cyan-600 to-primary',
      icon: '🤖',
      status: 'Available',
      features: ['AI Fundamentals', 'Neural Networks', 'AI Applications', 'Ethics & Governance']
    },
    {
      name: 'learn-pr',
      title: 'Learn PR',
      description: 'Master Public Relations, communication strategies, and build powerful brand narratives.',
      subdomain: 'learn-pr.iiskills.cloud',
      localPort: '3008',
      colorClass: 'bg-gradient-to-r from-pink-600 to-primary',
      icon: '📣',
      status: 'Available',
      features: ['Media Relations', 'Brand Building', 'Crisis Management', 'Content Strategy']
    }
  ]

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
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
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
                          href={`http://localhost:${module.localPort}`}
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
