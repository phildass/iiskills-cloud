import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import CommandCenterSidebar from "../components/CommandCenterSidebar";

/**
 * Exam Countdown Page - Education & Government Alerts
 * 
 * Features:
 * - Real-time exam alerts from NTA, UPSC, and other official portals
 * - Exam dates, admit card releases, and results
 * - Personalized countdown timers
 * - Links to relevant Learn modules for preparation
 * - Streak rewards for checking exams
 * - Free access for all users
 * 
 * Planned Data Sources: Official portals (NTA, UPSC) or education RSS feeds
 */
export default function ExamCountdown() {
  const [exams, setExams] = useState([]);
  const [filter, setFilter] = useState("all"); // all, upcoming, results
  const [searchQuery, setSearchQuery] = useState("");
  const [checkCount, setCheckCount] = useState(2); // Mock: User checked 2 exams this week

  // Mock data - Replace with API/scraper integration
  useEffect(() => {
    const mockExams = [
      {
        id: 1,
        name: "SSC CGL 2026",
        fullName: "Staff Selection Commission Combined Graduate Level",
        authority: "SSC",
        category: "Government Job",
        examDate: new Date("2026-05-15"),
        admitCardDate: new Date("2026-05-01"),
        resultDate: null,
        status: "upcoming",
        registrationOpen: true,
        registrationDeadline: new Date("2026-03-15"),
        officialUrl: "https://ssc.nic.in",
        relevantModules: ["Learn-Aptitude", "Learn-Maths"],
        learningProgress: 30, // Mock: User completed 30% of relevant modules
        description: "Exam for recruitment to various Group B and Group C posts in government ministries and departments.",
      },
      {
        id: 2,
        name: "JEE Main 2026",
        fullName: "Joint Entrance Examination Main",
        authority: "NTA",
        category: "Engineering",
        examDate: new Date("2026-04-10"),
        admitCardDate: new Date("2026-03-25"),
        resultDate: null,
        status: "upcoming",
        registrationOpen: true,
        registrationDeadline: new Date("2026-02-28"),
        officialUrl: "https://jeemain.nta.nic.in",
        relevantModules: ["Learn-Physics", "Learn-Maths", "Learn-Chemistry"],
        learningProgress: 45,
        description: "National level engineering entrance exam for admission to NITs, IIITs, and other institutions.",
      },
      {
        id: 3,
        name: "UPSC CSE 2026",
        fullName: "Union Public Service Commission Civil Services Examination",
        authority: "UPSC",
        category: "Civil Services",
        examDate: new Date("2026-06-07"),
        admitCardDate: new Date("2026-05-20"),
        resultDate: null,
        status: "upcoming",
        registrationOpen: false,
        registrationDeadline: new Date("2026-02-01"),
        officialUrl: "https://upsc.gov.in",
        relevantModules: ["Learn-Geography", "Learn-Aptitude"],
        learningProgress: 20,
        description: "India's premier civil services exam for recruitment to IAS, IPS, IFS, and other central services.",
      },
      {
        id: 4,
        name: "GATE 2026",
        fullName: "Graduate Aptitude Test in Engineering",
        authority: "IIT",
        category: "Engineering",
        examDate: new Date("2026-02-28"),
        admitCardDate: new Date("2026-02-15"),
        resultDate: null,
        status: "upcoming",
        registrationOpen: true,
        registrationDeadline: new Date("2026-02-10"),
        officialUrl: "https://gate.iisc.ac.in",
        relevantModules: ["Learn-Developer", "Learn-AI", "Learn-Maths"],
        learningProgress: 60,
        description: "National level exam for admission to postgraduate programs and PSU recruitment.",
      },
      {
        id: 5,
        name: "NEET UG 2026",
        fullName: "National Eligibility cum Entrance Test (Undergraduate)",
        authority: "NTA",
        category: "Medical",
        examDate: new Date("2026-05-02"),
        admitCardDate: new Date("2026-04-20"),
        resultDate: null,
        status: "upcoming",
        registrationOpen: true,
        registrationDeadline: new Date("2026-03-01"),
        officialUrl: "https://neet.nta.nic.in",
        relevantModules: ["Learn-Physics", "Learn-Chemistry"],
        learningProgress: 35,
        description: "National level medical entrance exam for admission to MBBS and BDS programs.",
      },
      {
        id: 6,
        name: "SSC CHSL 2025",
        fullName: "Staff Selection Commission Combined Higher Secondary Level",
        authority: "SSC",
        category: "Government Job",
        examDate: new Date("2026-02-20"),
        admitCardDate: new Date("2026-02-10"),
        resultDate: new Date("2026-03-30"),
        status: "results",
        registrationOpen: false,
        registrationDeadline: new Date("2025-12-31"),
        officialUrl: "https://ssc.nic.in",
        relevantModules: ["Learn-Aptitude", "Learn-Maths"],
        learningProgress: 30,
        description: "Exam for recruitment to DEO, LDC, PA, and SA posts in various government offices.",
      },
    ];

    setExams(mockExams);
  }, []);

  // Calculate days remaining
  const getDaysRemaining = (date) => {
    const now = new Date();
    const examDate = new Date(date);
    const diffTime = examDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "upcoming" && exam.status === "upcoming") ||
      (filter === "results" && exam.status === "results");
    
    const matchesSearch =
      searchQuery === "" ||
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Exam Countdown - Education Alerts | iiskills.cloud</title>
        <meta
          name="description"
          content="Track important exam dates, admit cards, and results. Get personalized countdown timers and link to relevant Learn modules for preparation."
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
                  ⏰ Exam Countdown
                </h1>
                <p className="text-gray-600">
                  Track exam dates with personalized countdowns & preparation tips
                </p>
              </div>
              <div className="bg-red-100 border border-red-300 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-red-800">
                  🔔 Real-time Alerts
                </p>
              </div>
            </div>

            {/* Streak Challenge Banner */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h3 className="font-bold text-lg">Weekly Challenge</h3>
                    <p className="text-sm text-white/90">
                      Check 3 exams this week, unlock streak rewards!
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <p className="font-bold text-2xl">{checkCount}/3</p>
                  <p className="text-xs">Checked</p>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              {/* Search Bar */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  🔍 Search Exams
                </label>
                <input
                  type="text"
                  placeholder="Search by exam name, authority, or category..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`
                    px-4 py-2 rounded-full font-semibold transition-all
                    ${
                      filter === "all"
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  All Exams
                </button>
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`
                    px-4 py-2 rounded-full font-semibold transition-all
                    ${
                      filter === "upcoming"
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter("results")}
                  className={`
                    px-4 py-2 rounded-full font-semibold transition-all
                    ${
                      filter === "results"
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  Results Pending
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <strong>{filteredExams.length}</strong> exams
              </p>
            </div>

            {/* Exam Cards */}
            <div className="space-y-6">
              {filteredExams.map((exam) => {
                const daysToExam = getDaysRemaining(exam.examDate);
                const daysToAdmit = getDaysRemaining(exam.admitCardDate);
                const urgency =
                  daysToExam <= 30
                    ? "high"
                    : daysToExam <= 60
                    ? "medium"
                    : "low";

                return (
                  <div
                    key={exam.id}
                    className={`
                      bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden
                      ${urgency === "high" ? "border-l-8 border-red-500" : ""}
                      ${urgency === "medium" ? "border-l-8 border-yellow-500" : ""}
                      ${urgency === "low" ? "border-l-8 border-green-500" : ""}
                    `}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold text-charcoal">
                              {exam.name}
                            </h3>
                            {exam.registrationOpen && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold animate-pulse">
                                Registration Open
                              </span>
                            )}
                          </div>
                          <p className="text-lg text-gray-700 mb-2">
                            {exam.fullName}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                              {exam.authority}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                              {exam.category}
                            </span>
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="text-center ml-4">
                          <div
                            className={`
                              w-28 h-28 rounded-full flex flex-col items-center justify-center font-bold border-4
                              ${
                                urgency === "high"
                                  ? "bg-red-100 text-red-800 border-red-500"
                                  : urgency === "medium"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-500"
                                  : "bg-green-100 text-green-800 border-green-500"
                              }
                            `}
                          >
                            <span className="text-3xl">{daysToExam}</span>
                            <span className="text-xs">days</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            to exam
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-4">{exam.description}</p>

                      {/* Important Dates */}
                      <div className="grid md:grid-cols-3 gap-3 mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-blue-900 mb-1">
                            Exam Date
                          </p>
                          <p className="font-bold text-blue-800">
                            {exam.examDate.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-green-900 mb-1">
                            Admit Card
                          </p>
                          <p className="font-bold text-green-800">
                            {exam.admitCardDate.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-green-700">
                            ({daysToAdmit} days)
                          </p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-purple-900 mb-1">
                            Registration
                          </p>
                          <p className="font-bold text-purple-800">
                            {exam.registrationDeadline.toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Personalized Learning Bridge */}
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-2xl">🎓</span>
                          <div className="flex-1">
                            <p className="font-bold text-cyan-900 mb-2">
                              {daysToExam} days to {exam.name} — have you finished
                              preparation?
                            </p>
                            <p className="text-sm text-cyan-800 mb-2">
                              Your progress in relevant modules:{" "}
                              <strong>{exam.learningProgress}%</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {exam.relevantModules.map((module, idx) => (
                                <Link
                                  key={idx}
                                  href="#"
                                  className="inline-block px-3 py-1 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700 transition-colors"
                                >
                                  → {module}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <a
                          href={exam.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-blue-700 transition-colors"
                        >
                          Visit Official Site
                        </a>
                        <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                          🔔 Set Alert
                        </button>
                        <button className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                          💾 Save
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* API Integration Notice */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">
                🚧 Development Note
              </h3>
              <p className="text-yellow-800 mb-2">
                Currently showing mock data. Data integration planned from:
              </p>
              <ul className="list-disc list-inside text-yellow-800 space-y-1">
                <li>NTA (National Testing Agency) - nta.nic.in RSS/scraper</li>
                <li>UPSC (Union Public Service Commission) - upsc.gov.in</li>
                <li>SSC (Staff Selection Commission) - ssc.nic.in</li>
                <li>Education portal RSS feeds</li>
                <li>Official .gov.in/.nic.in websites only (for trust)</li>
              </ul>
              <p className="text-yellow-800 mt-2 text-sm">
                Implementation: Web scraper or RSS parser with regular updates (every 6 hours)
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
