/**
 * Landing Page Component - Learn Govt Jobs Platform
 * 
 * Vibrant, search-centric landing page with:
 * - Power search bar with geo-spatial filters
 * - Dynamic ticker showing real-time stats
 * - Personalized job match dashboard (logged-in users)
 * - Recent jobs feed with color-coded status
 * - Trust indicators and anti-scam messaging
 * - Subscription CTA with countdown
 * - Mobile-optimized with offline support
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LandingPage({ 
  user = null,
  recentJobs = [],
  matchedJobs = [],
  stats = {},
  showPaywall = false 
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluk, setSelectedTaluk] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Mock data for states (would come from API)
  const states = [
    'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh',
    'Gujarat', 'Rajasthan', 'West Bengal', 'Madhya Pradesh', 'Andhra Pradesh'
  ];
  
  const categories = [
    'Banking & Finance', 'Railway', 'Defense & Police', 'Teaching & Education',
    'Medical & Healthcare', 'Engineering', 'Administrative Services',
    'Public Sector Undertakings', 'Postal Services', 'Judiciary & Legal'
  ];
  
  const qualifications = [
    '10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'PhD', 'ITI/Diploma'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      q: searchQuery,
      state: selectedState,
      district: selectedDistrict,
      taluk: selectedTaluk,
      category: selectedCategory,
      qualification: selectedQualification,
    }).toString();
    router.push(`/jobs?${query}`);
  };

  // Auto-scrolling ticker effect
  const [tickerOffset, setTickerOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Find Government Jobs That Match You - Learn Govt Jobs</title>
        <meta name="description" content="AI-powered government job search platform. Find jobs by state, category, qualification with real-time updates from verified sources." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Power Search Bar */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                🔍 Find Government Jobs That Match You
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                AI-powered job matching • Real-time updates • Verified sources
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-2xl p-4 md:p-6">
              {/* Main Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="🔍 Search by job title, organization, or keyword..."
                    className="w-full px-6 py-4 text-lg text-gray-800 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-3 text-gray-800 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 text-gray-800 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={selectedQualification}
                  onChange={(e) => setSelectedQualification(e.target.value)}
                  className="px-4 py-3 text-gray-800 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Minimum Qualification</option>
                  {qualifications.map((qual) => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters (Collapsible) */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="px-4 py-3 text-gray-800 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    disabled={!selectedState}
                  >
                    <option value="">Select District</option>
                    {/* Would be populated based on selected state */}
                  </select>

                  <select
                    value={selectedTaluk}
                    onChange={(e) => setSelectedTaluk(e.target.value)}
                    className="px-4 py-3 text-gray-800 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
                    disabled={!selectedDistrict}
                  >
                    <option value="">Select Taluk</option>
                    {/* Would be populated based on selected district */}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition shadow-lg"
                >
                  🔍 Search Jobs
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-lg transition"
                >
                  {showAdvancedFilters ? '▲ Simple' : '▼ Advanced'}
                </button>
              </div>

              {/* Quick Filter Bubbles */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium transition">
                  🏛️ Central Govt
                </button>
                <button className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full text-sm font-medium transition">
                  🏢 State PSC
                </button>
                <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-sm font-medium transition">
                  🚂 Railway
                </button>
                <button className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-full text-sm font-medium transition">
                  🏦 Banking
                </button>
                <button className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-800 rounded-full text-sm font-medium transition">
                  🎓 Teaching
                </button>
              </div>

              {user && (
                <p className="text-center text-gray-600 mt-4 text-sm">
                  ✨ Showing jobs matching your profile
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Dynamic Ticker / Statistics Banner */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            <span className="inline-block px-8">
              🔥 {stats.newToday || '1,240'} new jobs added today
            </span>
            <span className="inline-block px-8">•</span>
            <span className="inline-block px-8">
              📊 {stats.totalActive || '98,450'} total active jobs
            </span>
            <span className="inline-block px-8">•</span>
            <span className="inline-block px-8">
              ⏰ {stats.deadlinesThisWeek || '145'} deadlines this week
            </span>
            <span className="inline-block px-8">•</span>
            <span className="inline-block px-8">
              🎯 {stats.successfulUsers || '12,500'} users got their dream job
            </span>
            <span className="inline-block px-8">•</span>
            <span className="inline-block px-8">
              ✅ 99.5% source accuracy
            </span>
          </div>
        </section>

        {/* Personalized Dashboard (Logged-in Users) */}
        {user && matchedJobs.length > 0 && (
          <section className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                📊 Your Job Match Dashboard
              </h2>
              
              <div className="space-y-4">
                {matchedJobs.slice(0, 3).map((job, index) => (
                  <div 
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800 flex-1">
                        {job.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        job.matchScore >= 75 ? 'bg-green-100 text-green-800' :
                        job.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {job.matchScore}% Match
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{job.organization}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3 text-sm">
                      {job.strengths?.map((strength, i) => (
                        <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded">
                          ✓ {strength}
                        </span>
                      ))}
                      {job.warnings?.map((warning, i) => (
                        <span key={i} className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                          ⚠️ {warning}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
                        View Details
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Link href="/dashboard">
                  <span className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer">
                    See All Recommendations →
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* For Non-logged Users - CTA Preview */}
        {!user && (
          <section className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">
                🎯 Get Personalized Job Matches
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Login to see AI-powered job recommendations tailored to your profile
              </p>
              {/* OPEN ACCESS: Registration links removed - all content is publicly accessible */}
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <span className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg cursor-pointer inline-block transition">
                    Try Free for 7 Days
                  </span>
                </Link>
                <Link href="/register">
                  <span className="bg-purple-800 hover:bg-purple-900 font-bold py-3 px-8 rounded-lg cursor-pointer inline-block transition">
                    Login / Register
                  </span>
                </Link>
              </div> */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/jobs">
                  <span className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg cursor-pointer inline-block transition">
                    Explore Jobs
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Recent Jobs Feed */}
        <section className="container mx-auto px-4 py-8 max-w-6xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            🔥 Latest Government Jobs
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {(recentJobs.length > 0 ? recentJobs : generateMockJobs()).map((job, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-l-4"
                style={{ borderColor: getJobStatusColor(job.status) }}
              >
                {/* Job Status Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getJobStatusBadge(job.status)}`}>
                      {getJobStatusText(job.status)}
                    </span>
                    {job.verified && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {job.title}
                </h3>
                <p className="text-gray-700 font-semibold mb-3">{job.organization}</p>

                {/* Job Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">📍 Location:</span>
                    <p className="font-medium">{job.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">💼 Vacancies:</span>
                    <p className="font-medium">{job.vacancies}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">🎓 Qualification:</span>
                    <p className="font-medium">{job.qualification}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">📅 Age Limit:</span>
                    <p className="font-medium">{job.ageLimit}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 font-semibold">
                    ⏰ Apply by: {job.deadline} ({job.daysLeft} days left)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition">
                    View Details
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition">
                    🔖 Save
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition">
                    📱 Share
                  </button>
                  <a 
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition inline-block"
                  >
                    🔗 Official
                  </a>
                </div>

                {/* Source Badge */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Source: {job.sourceDomain} | Last updated: {job.lastUpdated}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
              Load More Jobs
            </button>
          </div>
        </section>

        {/* Trust & Anti-Scam Section */}
        <section className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-green-800">
              ✅ How We Keep You Safe from Job Scams
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold">100% Official Sources</p>
                  <p className="text-sm text-gray-700">.gov.in/.nic.in verified</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold">AI-verified notifications</p>
                  <p className="text-sm text-gray-700">With source links</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold">No payment for applications</p>
                  <p className="text-sm text-gray-700">Except official fees</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="font-semibold">Direct PDF links</p>
                  <p className="text-sm text-gray-700">To official notifications</p>
                </div>
              </div>
            </div>

            <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-center">
              <p className="font-bold text-red-800 text-lg">
                ⚠️ IMPORTANT: Government jobs NEVER require payment for application,
                except official application fees paid directly on government portals.
              </p>
            </div>
          </div>
        </section>

        {/* Subscription CTA (for free users or trial) */}
        {showPaywall && (
          <section className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-2xl p-8 text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                🎁 Unlock Full Access - Limited Time Offer!
              </h2>
              
              <div className="bg-white bg-opacity-90 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Unlimited job searches and alerts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>AI-powered match scores for every job</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Personalized document checklist</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>WhatsApp job notifications</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Offline job saving</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    ₹99/year
                  </div>
                  <p className="text-gray-600">
                    (that's less than ₹9/month!)
                  </p>
                </div>

                {/* OPEN ACCESS: Registration/trial links removed */}
                {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register?trial=true">
                    <span className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg cursor-pointer inline-block transition">
                      Start Free Trial (7 Days)
                    </span>
                  </Link>
                  <Link href="/register">
                    <span className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg cursor-pointer inline-block transition">
                      Subscribe Now
                    </span>
                  </Link>
                </div> */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/jobs">
                    <span className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg cursor-pointer inline-block transition">
                      Explore Jobs Now
                    </span>
                  </Link>
                </div>
              </div>

              <p className="text-sm text-gray-700">
                ⏰ Special offer ends soon!
              </p>
            </div>
          </section>
        )}

        {/* Prominent Disclaimer Footer */}
        <section className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="bg-yellow-500 text-gray-900 rounded-lg p-6 mb-8">
              <p className="font-bold text-lg text-center">
                ⚠️ DISCLAIMER: This is a private job aggregator and NOT affiliated
                with any government organization. Always verify details from official
                sources before applying. We do not charge for applications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold mb-4">About</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/about"><span className="hover:text-white cursor-pointer">Our Mission</span></Link></li>
                  <li><Link href="/how-it-works"><span className="hover:text-white cursor-pointer">How It Works</span></Link></li>
                  <li><Link href="/privacy"><span className="hover:text-white cursor-pointer">Privacy Policy</span></Link></li>
                  <li><Link href="/terms"><span className="hover:text-white cursor-pointer">Terms of Use</span></Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/jobs"><span className="hover:text-white cursor-pointer">All Jobs</span></Link></li>
                  <li><Link href="/jobs?type=state"><span className="hover:text-white cursor-pointer">By State</span></Link></li>
                  <li><Link href="/jobs?type=category"><span className="hover:text-white cursor-pointer">By Category</span></Link></li>
                  <li><Link href="/exam-prep"><span className="hover:text-white cursor-pointer">Exam Prep</span></Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link href="/news"><span className="hover:text-white cursor-pointer">Current Affairs</span></Link></li>
                  <li><Link href="/study-guides"><span className="hover:text-white cursor-pointer">Study Guides</span></Link></li>
                  <li><Link href="/exam-calendar"><span className="hover:text-white cursor-pointer">Exam Calendar</span></Link></li>
                  <li><Link href="/blog"><span className="hover:text-white cursor-pointer">Blog</span></Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <p className="text-sm text-gray-300 mb-2">
                  📞 support@iiskills.cloud
                </p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="hover:text-blue-400">Twitter</a>
                  <a href="#" className="hover:text-blue-400">Facebook</a>
                  <a href="#" className="hover:text-green-400">WhatsApp</a>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-400 pt-8 border-t border-gray-700">
              <p>© 2026 iiskills.cloud. All rights reserved.</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: inline-block;
        }
      `}</style>
    </>
  );
}

// Helper functions for job status
function getJobStatusColor(status) {
  switch(status) {
    case 'new': return '#10b981'; // green
    case 'closing-soon': return '#f59e0b'; // yellow
    case 'urgent': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
}

function getJobStatusBadge(status) {
  switch(status) {
    case 'new': return 'bg-green-100 text-green-800';
    case 'closing-soon': return 'bg-yellow-100 text-yellow-800';
    case 'urgent': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getJobStatusText(status) {
  switch(status) {
    case 'new': return '🟢 NEW';
    case 'closing-soon': return '🟡 CLOSING SOON';
    case 'urgent': return '🔴 URGENT';
    default: return 'ACTIVE';
  }
}

// Mock job data generator
function generateMockJobs() {
  return [
    {
      status: 'new',
      title: 'Karnataka State Civil Services Examination 2026',
      organization: 'Karnataka Public Service Commission',
      location: 'Karnataka',
      vacancies: '450',
      qualification: 'Graduate',
      ageLimit: '21-35 years',
      deadline: '2026-03-15',
      daysLeft: 37,
      sourceUrl: 'https://kpsc.kar.nic.in',
      sourceDomain: 'kpsc.kar.nic.in',
      lastUpdated: '2 hours ago',
      verified: true
    },
    {
      status: 'closing-soon',
      title: 'Staff Selection Commission - Combined Graduate Level 2026',
      organization: 'Staff Selection Commission',
      location: 'All India',
      vacancies: '8,000+',
      qualification: 'Graduate',
      ageLimit: '18-30 years',
      deadline: '2026-02-28',
      daysLeft: 22,
      sourceUrl: 'https://ssc.nic.in',
      sourceDomain: 'ssc.nic.in',
      lastUpdated: '1 day ago',
      verified: true
    },
    {
      status: 'urgent',
      title: 'Railway Recruitment Board - NTPC 2026',
      organization: 'Railway Recruitment Board',
      location: 'All India',
      vacancies: '12,000+',
      qualification: 'Graduate/12th',
      ageLimit: '18-33 years',
      deadline: '2026-02-20',
      daysLeft: 14,
      sourceUrl: 'https://rrbcdg.gov.in',
      sourceDomain: 'rrbcdg.gov.in',
      lastUpdated: '5 hours ago',
      verified: true
    }
  ];
}
