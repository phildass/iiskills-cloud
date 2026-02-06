import { useState, useEffect } from "react";
import Head from "next/head";
import CommandCenterSidebar from "../components/CommandCenterSidebar";

/**
 * Opportunity Feed Page - Jobs & Internships
 * 
 * Features:
 * - Live job/internship/gig postings (currently mock data, API integration planned)
 * - Personalized curation based on Learn progress
 * - Filtering by city, field, and remote/on-site
 * - Streak challenges and auto-update notifications
 * - Free access for all users
 * 
 * Planned API: Adzuna API (or LinkedIn/Indeed/RapidAPI as backup)
 */
export default function OpportunityFeed() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    city: "all",
    field: "all",
    type: "all", // remote, on-site, hybrid
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - Replace with API integration
  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: "Junior Developer",
        company: "Tech Solutions Pvt Ltd",
        location: "Bengaluru",
        type: "On-site",
        field: "Developer",
        salary: "₹3.5-5 LPA",
        posted: "2 hours ago",
        match: 85,
        matchReason: "You passed 30% in Learn-Developer",
        description: "Looking for passionate junior developers with basic understanding of web development.",
        requirements: ["HTML/CSS", "JavaScript basics", "Problem solving"],
        applyUrl: "#",
      },
      {
        id: 2,
        title: "AI/ML Intern",
        company: "DataMind Labs",
        location: "Hyderabad",
        type: "Hybrid",
        field: "AI",
        salary: "₹15,000/month",
        posted: "5 hours ago",
        match: 72,
        matchReason: "Based on your AI module progress",
        description: "6-month internship for students learning AI and machine learning.",
        requirements: ["Python basics", "ML concepts", "Eager to learn"],
        applyUrl: "#",
      },
      {
        id: 3,
        title: "Content Writer - Physics",
        company: "EduTech India",
        location: "Remote",
        type: "Remote",
        field: "Physics",
        salary: "₹20,000-25,000/month",
        posted: "1 day ago",
        match: 68,
        matchReason: "Matches your Physics module activity",
        description: "Create educational content for physics learning platform.",
        requirements: ["Physics knowledge", "Content writing", "Remote work"],
        applyUrl: "#",
      },
      {
        id: 4,
        title: "PR & Communications Associate",
        company: "Brand Builders Co.",
        location: "Mumbai",
        type: "On-site",
        field: "PR",
        salary: "₹4-6 LPA",
        posted: "3 days ago",
        match: 60,
        matchReason: "Good fit for PR learners",
        description: "Support PR campaigns and client communications.",
        requirements: ["Communication skills", "Social media", "Team player"],
        applyUrl: "#",
      },
      {
        id: 5,
        title: "Geography Researcher",
        company: "Global Climate Initiative",
        location: "Delhi",
        type: "Hybrid",
        field: "Geography",
        salary: "₹3-4.5 LPA",
        posted: "5 days ago",
        match: 55,
        matchReason: "Aligns with Geography coursework",
        description: "Research on climate patterns and geographical data analysis.",
        requirements: ["Geography knowledge", "Research skills", "Data analysis"],
        applyUrl: "#",
      },
    ];

    setJobs(mockJobs);
  }, []);

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter((job) => {
    const matchesCity = filters.city === "all" || job.location === filters.city;
    const matchesField = filters.field === "all" || job.field === filters.field;
    const matchesType = filters.type === "all" || job.type === filters.type;
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesField && matchesType && matchesSearch;
  });

  const cities = ["all", "Bengaluru", "Hyderabad", "Mumbai", "Delhi", "Remote"];
  const fields = ["all", "Developer", "AI", "PR", "Physics", "Geography"];
  const types = ["all", "Remote", "On-site", "Hybrid"];

  return (
    <>
      <Head>
        <title>Opportunity Feed - Jobs & Internships | iiskills.cloud</title>
        <meta
          name="description"
          content="Discover personalized job and internship opportunities curated based on your learning progress. Free access to live opportunities across India."
        />
      </Head>

      <div className="flex min-h-screen bg-neutral">
        {/* Sidebar */}
        <CommandCenterSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">
                  💼 Opportunity Feed
                </h1>
                <p className="text-gray-600">
                  Personalized jobs & internships based on your Learn progress
                </p>
              </div>
              <div className="bg-green-100 border border-green-300 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-green-800">
                  🔄 Auto-updates every 30 min
                </p>
              </div>
            </div>

            {/* Streak Challenge Banner */}
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h3 className="font-bold text-lg">Weekly Challenge</h3>
                    <p className="text-sm text-white/90">
                      Apply to 3 jobs this week, unlock a free learning hint!
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <p className="font-bold text-2xl">1/3</p>
                  <p className="text-xs">Applied</p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              {/* Search Bar */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  🔍 Search Opportunities
                </label>
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    📍 City
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city === "all" ? "All Cities" : city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    🎯 Field
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={filters.field}
                    onChange={(e) => setFilters({ ...filters, field: e.target.value })}
                  >
                    {fields.map((field) => (
                      <option key={field} value={field}>
                        {field === "all" ? "All Fields" : field}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    💻 Work Type
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    {types.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <strong>{filteredJobs.length}</strong> opportunities
              </p>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-charcoal mb-1">
                        {job.title}
                      </h3>
                      <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          📍 {job.location}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          💻 {job.type}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                          💰 {job.salary}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          ⏰ {job.posted}
                        </span>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-center ml-4">
                      <div
                        className={`
                          w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
                          ${
                            job.match >= 75
                              ? "bg-green-100 text-green-800 border-4 border-green-500"
                              : job.match >= 60
                              ? "bg-yellow-100 text-yellow-800 border-4 border-yellow-500"
                              : "bg-orange-100 text-orange-800 border-4 border-orange-500"
                          }
                        `}
                      >
                        {job.match}%
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Match</p>
                    </div>
                  </div>

                  {/* Match Reason */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Why this matches you:</strong> {job.matchReason}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{job.description}</p>

                  {/* Requirements */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-charcoal mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-700">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Apply Button */}
                  <div className="flex gap-3">
                    <a
                      href={job.applyUrl}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </a>
                    <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      💾 Save
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* API Integration Notice */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">
                🚧 Development Note
              </h3>
              <p className="text-yellow-800 mb-2">
                Currently showing mock data. API integration planned with:
              </p>
              <ul className="list-disc list-inside text-yellow-800 space-y-1">
                <li>Adzuna API (primary)</li>
                <li>LinkedIn Jobs API (backup)</li>
                <li>Indeed API (backup)</li>
                <li>RapidAPI job aggregators (backup)</li>
              </ul>
              <p className="text-yellow-800 mt-2 text-sm">
                To enable: Add API keys to .env.local and implement fetch logic in useEffect
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
