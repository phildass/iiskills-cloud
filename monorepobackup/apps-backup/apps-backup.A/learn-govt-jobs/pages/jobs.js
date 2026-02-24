import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Jobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('');
  const [sortBy, setSortBy] = useState('deadline'); // deadline, posted, vacancies, match
  
  // Mobile filter drawer
  const [showFilters, setShowFilters] = useState(false);

  // Filter options
  const jobTypes = ['Central', 'State', 'PSU', 'Local'];
  const states = ['Karnataka', 'Maharashtra', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Gujarat'];
  const categories = [
    'Banking & Finance', 'Railway', 'Defense & Police', 'Teaching & Education',
    'Medical & Healthcare', 'Engineering', 'Administrative Services', 'PSU', 'Postal', 'Judiciary'
  ];
  const qualifications = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'PhD'];

  useEffect(() => {
    // Parse URL query parameters
    const { q, state, category, qualification, type } = router.query;
    if (q) setSearchQuery(q);
    if (state) setSelectedState(state);
    if (category) setSelectedCategory(category);
    if (qualification) setSelectedQualification(qualification);
    if (type) setSelectedJobType(type);
    
    fetchJobs();
  }, [router.query]);

  const fetchJobs = async () => {
    try {
      // Mock government jobs data - in production, fetch from API
      const mockJobs = [
        {
          id: 1,
          title: 'Karnataka State Civil Services Examination 2026',
          organization: 'Karnataka Public Service Commission',
          department: 'General Administration',
          stateName: 'Karnataka',
          totalVacancies: 450,
          minQualification: 'Graduate',
          minAge: 21,
          maxAge: 35,
          applicationStartDate: '2026-02-01',
          applicationEndDate: '2026-03-15',
          sourceUrl: 'https://kpsc.kar.nic.in/notification.pdf',
          sourceDomain: 'kpsc.kar.nic.in',
          lastUpdated: '2026-02-05',
          aiProcessed: true,
          aiSummary: 'KPSC is recruiting for 450 positions across various departments. Graduates between 21-35 years can apply before March 15, 2026.',
          status: 'new', // new, closing-soon, urgent
          matchScore: 85,
          matchReasoning: {
            strengths: ['Location matches', 'Qualification matches'],
            gaps: ['Age limit approaching'],
            recommendations: 'Apply early as positions are competitive'
          },
          requiredDocuments: [
            { type: 'Photo', required: true },
            { type: 'Signature', required: true },
            { type: 'ID Proof', required: true },
            { type: 'Education Certificate', required: true },
            { type: 'Caste Certificate', required: false }
          ]
        },
        {
          id: 2,
          title: 'Staff Selection Commission - Combined Graduate Level 2026',
          organization: 'Staff Selection Commission',
          department: 'Various Ministries',
          stateName: 'All India',
          totalVacancies: 8000,
          minQualification: 'Graduate',
          minAge: 18,
          maxAge: 30,
          applicationStartDate: '2026-01-15',
          applicationEndDate: '2026-02-28',
          examDate: '2026-04-15',
          sourceUrl: 'https://ssc.nic.in/cgl2026.pdf',
          sourceDomain: 'ssc.nic.in',
          lastUpdated: '2026-02-04',
          aiProcessed: true,
          aiSummary: 'SSC CGL 2026 for 8000+ posts in various central government departments. Graduates aged 18-30 can apply by Feb 28.',
          status: 'closing-soon',
          matchScore: 92,
          matchReasoning: {
            strengths: ['Perfect age match', 'Qualification matches', 'All India opportunity'],
            gaps: [],
            recommendations: 'Highly recommended - excellent match for your profile'
          },
          requiredDocuments: [
            { type: 'Photo', required: true },
            { type: 'Signature', required: true },
            { type: 'ID Proof', required: true },
            { type: 'Education Certificate', required: true }
          ]
        },
        {
          id: 3,
          title: 'Railway Recruitment Board - Non-Technical Popular Categories 2026',
          organization: 'Railway Recruitment Board',
          department: 'Indian Railways',
          stateName: 'All India',
          totalVacancies: 12000,
          minQualification: '12th Pass',
          minAge: 18,
          maxAge: 33,
          applicationStartDate: '2026-01-20',
          applicationEndDate: '2026-02-20',
          examDate: '2026-03-25',
          sourceUrl: 'https://rrbcdg.gov.in/ntpc2026.pdf',
          sourceDomain: 'rrbcdg.gov.in',
          lastUpdated: '2026-02-05',
          aiProcessed: true,
          aiSummary: 'RRB NTPC recruiting 12000+ posts. 12th pass candidates aged 18-33 can apply. Deadline: Feb 20, 2026.',
          status: 'urgent',
          matchScore: 78,
          matchReasoning: {
            strengths: ['Age within limit', 'Large number of vacancies'],
            gaps: ['Qualification requirement met but higher qualification preferred'],
            recommendations: 'Good opportunity - apply before Feb 20'
          },
          requiredDocuments: [
            { type: 'Photo', required: true },
            { type: 'Signature', required: true },
            { type: 'ID Proof', required: true },
            { type: 'Education Certificate', required: true },
            { type: 'Community Certificate', required: false }
          ]
        },
        {
          id: 4,
          title: 'Tamil Nadu Public Service Commission - Combined Civil Services Exam',
          organization: 'Tamil Nadu Public Service Commission',
          department: 'Various Departments',
          stateName: 'Tamil Nadu',
          totalVacancies: 320,
          minQualification: 'Graduate',
          minAge: 21,
          maxAge: 32,
          applicationStartDate: '2026-02-10',
          applicationEndDate: '2026-03-25',
          sourceUrl: 'https://tnpsc.gov.in/ccse2026.pdf',
          sourceDomain: 'tnpsc.gov.in',
          lastUpdated: '2026-02-05',
          aiProcessed: true,
          aiSummary: 'TNPSC CCSE for 320 posts across departments. Graduate candidates aged 21-32 can apply until March 25.',
          status: 'new',
          matchScore: 68,
          requiredDocuments: [
            { type: 'Photo', required: true },
            { type: 'Signature', required: true },
            { type: 'ID Proof', required: true },
            { type: 'Education Certificate', required: true }
          ]
        },
        {
          id: 5,
          title: 'IBPS - Probationary Officer (PO) Recruitment 2026',
          organization: 'Institute of Banking Personnel Selection',
          department: 'Public Sector Banks',
          stateName: 'All India',
          totalVacancies: 2500,
          minQualification: 'Graduate',
          minAge: 20,
          maxAge: 30,
          applicationStartDate: '2026-02-01',
          applicationEndDate: '2026-03-01',
          examDate: '2026-04-20',
          sourceUrl: 'https://ibps.in/po2026.pdf',
          sourceDomain: 'ibps.in',
          lastUpdated: '2026-02-04',
          aiProcessed: true,
          aiSummary: 'IBPS PO exam for 2500 positions in public sector banks. Graduates aged 20-30 must apply by March 1.',
          status: 'closing-soon',
          matchScore: 88,
          matchReasoning: {
            strengths: ['Excellent age match', 'Qualification matches', 'Banking sector opportunity'],
            gaps: [],
            recommendations: 'Banking sector offers good career growth'
          },
          requiredDocuments: [
            { type: 'Photo', required: true },
            { type: 'Signature', required: true },
            { type: 'ID Proof', required: true },
            { type: 'Education Certificate', required: true }
          ]
        }
      ];

      setJobs(mockJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  // Filter jobs based on all criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJobType = selectedJobType === 'all' || 
      (selectedJobType === 'Central' && job.stateName === 'All India') ||
      (selectedJobType === 'State' && job.stateName !== 'All India');
    
    const matchesState = !selectedState || job.stateName === selectedState || job.stateName === 'All India';
    const matchesCategory = !selectedCategory; // Would need category field in data
    const matchesQualification = !selectedQualification || job.minQualification === selectedQualification;
    
    return matchesSearch && matchesJobType && matchesState && matchesCategory && matchesQualification;
  });

  // Sort jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch(sortBy) {
      case 'deadline':
        return new Date(a.applicationEndDate) - new Date(b.applicationEndDate);
      case 'posted':
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      case 'vacancies':
        return b.totalVacancies - a.totalVacancies;
      case 'match':
        return (b.matchScore || 0) - (a.matchScore || 0);
      default:
        return 0;
    }
  });

  const handleJobClick = (jobId) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleSave = (jobId) => {
    // Save job to user's saved list
    console.log('Save job:', jobId);
  };

  const handleApply = (jobId) => {
    // Mark job as applied
    console.log('Apply to job:', jobId);
  };

  const handleShare = (jobId) => {
    // Share job via WhatsApp or other channels
    console.log('Share job:', jobId);
  };

  // Calculate days left
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get job status
  const getJobStatus = (job) => {
    const daysLeft = getDaysLeft(job.applicationEndDate);
    if (daysLeft <= 3) return 'urgent';
    if (daysLeft <= 7) return 'closing-soon';
    const daysSincePosted = Math.ceil((new Date() - new Date(job.lastUpdated)) / (1000 * 60 * 60 * 24));
    if (daysSincePosted <= 2) return 'new';
    return 'active';
  };

  return (
    <>
      <Head>
        <title>Government Jobs in India - Learn Govt Jobs</title>
        <meta name="description" content="Find latest government job notifications from PSCs, SSC, Railway, Banking and more with AI-powered matching" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Government Jobs Board</h1>
            <p className="text-lg opacity-90">
              {filteredJobs.length} jobs found | Updated in real-time from verified sources
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar (Desktop) */}
            <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex justify-between items-center mb-4 lg:block">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Job Type */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Job Type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="jobType"
                        value="all"
                        checked={selectedJobType === 'all'}
                        onChange={(e) => setSelectedJobType(e.target.value)}
                        className="mr-2"
                      />
                      All Jobs
                    </label>
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={selectedJobType === type}
                          onChange={(e) => setSelectedJobType(e.target.value)}
                          className="mr-2"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* State */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">State</h3>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All States</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Category</h3>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Qualification */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Qualification</h3>
                  <select
                    value={selectedQualification}
                    onChange={(e) => setSelectedQualification(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Qualification</option>
                    {qualifications.map(qual => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedJobType('all');
                    setSelectedState('');
                    setSelectedCategory('');
                    setSelectedQualification('');
                    setSearchQuery('');
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  Clear All Filters
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Sort Bar */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="🔍 Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="deadline">Sort: Deadline</option>
                      <option value="posted">Sort: Recently Posted</option>
                      <option value="vacancies">Sort: Vacancies</option>
                      <option value="match">Sort: Match Score</option>
                    </select>

                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      🔧 Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
              ) : sortedJobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-xl text-gray-600 mb-4">No jobs found matching your criteria</p>
                  <button
                    onClick={() => {
                      setSelectedJobType('all');
                      setSelectedState('');
                      setSelectedCategory('');
                      setSelectedQualification('');
                      setSearchQuery('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedJobs.map(job => {
                    const daysLeft = getDaysLeft(job.applicationEndDate);
                    const status = getJobStatus(job);
                    
                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-l-4 cursor-pointer"
                        style={{ borderColor: 
                          status === 'new' ? '#10b981' :
                          status === 'closing-soon' ? '#f59e0b' :
                          status === 'urgent' ? '#ef4444' : '#6b7280'
                        }}
                        onClick={() => handleJobClick(job.id)}
                      >
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              status === 'new' ? 'bg-green-100 text-green-800' :
                              status === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' :
                              status === 'urgent' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status === 'new' ? '🟢 NEW' :
                               status === 'closing-soon' ? '🟡 CLOSING SOON' :
                               status === 'urgent' ? '🔴 URGENT' : 'ACTIVE'}
                            </span>
                            {job.aiProcessed && (
                              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">
                                🤖 AI-Processed
                              </span>
                            )}
                          </div>
                          {job.matchScore && (
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                              job.matchScore >= 75 ? 'bg-green-100 text-green-800' :
                              job.matchScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {job.matchScore}% Match
                            </div>
                          )}
                        </div>

                        {/* Job Title & Organization */}
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                        <p className="text-gray-700 font-semibold mb-3">{job.organization}</p>

                        {/* AI Summary */}
                        {job.aiSummary && (
                          <div className="bg-purple-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-purple-800">
                              <span className="font-semibold">AI Summary:</span> {job.aiSummary}
                            </p>
                          </div>
                        )}

                        {/* Job Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                          <div>
                            <span className="text-gray-600">📍 Location:</span>
                            <p className="font-medium">{job.stateName}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">💼 Vacancies:</span>
                            <p className="font-medium">{job.totalVacancies}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">🎓 Qualification:</span>
                            <p className="font-medium">{job.minQualification}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">📅 Age Limit:</span>
                            <p className="font-medium">{job.minAge}-{job.maxAge} years</p>
                          </div>
                        </div>

                        {/* Deadline Warning */}
                        <div className={`rounded-lg p-3 mb-4 ${
                          daysLeft <= 3 ? 'bg-red-50 border border-red-200' :
                          daysLeft <= 7 ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-blue-50 border border-blue-200'
                        }`}>
                          <p className={`font-semibold ${
                            daysLeft <= 3 ? 'text-red-800' :
                            daysLeft <= 7 ? 'text-yellow-800' :
                            'text-blue-800'
                          }`}>
                            ⏰ Apply by: {job.applicationEndDate} ({daysLeft} days left)
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleJobClick(job.id); }}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSave(job.id); }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition"
                          >
                            🔖 Save
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleShare(job.id); }}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                          >
                            📱 Share
                          </button>
                          <a
                            href={job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition"
                          >
                            🔗 Official
                          </a>
                        </div>

                        {/* Source */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Source: {job.sourceDomain} | Last updated: {job.lastUpdated}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Load More */}
              {sortedJobs.length > 0 && (
                <div className="text-center mt-8">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                    Load More Jobs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
