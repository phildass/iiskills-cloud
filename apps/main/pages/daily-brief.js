import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import CommandCenterSidebar from "../components/CommandCenterSidebar";

/**
 * Daily Brief Page - AI-Summarized News
 * 
 * Features:
 * - Top headlines from NewsAPI.org or GNews
 * - AI-generated 60-word summaries (OpenAI, Gemini, etc.)
 * - Personalized based on Learn interests
 * - "Bridge" links to relevant Learn modules
 * - 3 reads = Free Hint or Module Unlock
 * - Free access for all users
 * 
 * Planned API: NewsAPI.org (or GNews as backup)
 */
export default function DailyBrief() {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [readCount, setReadCount] = useState(2); // Mock: User has read 2 articles today

  // Mock data - Replace with API integration
  useEffect(() => {
    const mockNews = [
      {
        id: 1,
        title: "Red Sea Shipping Routes Face New Challenges",
        category: "Geography",
        source: "Global Trade News",
        publishedAt: "2 hours ago",
        imageUrl: "/api/placeholder/400/250",
        summary:
          "Maritime experts report disruptions in Red Sea shipping routes affecting global supply chains. Over 30% of container traffic rerouted through longer Cape of Good Hope route, impacting delivery times and costs significantly. Indian ports see increased activity.",
        bridgeModule: "Learn-Geography",
        bridgeLesson: "Global Trade Routes & Economic Geography",
        bridgeUrl: "#",
        readTime: "2 min",
        originalUrl: "#",
      },
      {
        id: 2,
        title: "Breakthrough in Quantum Computing Announced",
        category: "Physics",
        source: "Science Daily",
        publishedAt: "5 hours ago",
        imageUrl: "/api/placeholder/400/250",
        summary:
          "Researchers achieve stable quantum state for record 10 minutes, marking major advancement in quantum computing. This breakthrough could accelerate development of quantum computers capable of solving complex problems beyond classical computing capabilities.",
        bridgeModule: "Learn-Physics",
        bridgeLesson: "Quantum Mechanics & Modern Physics",
        bridgeUrl: "#",
        readTime: "2 min",
        originalUrl: "#",
      },
      {
        id: 3,
        title: "AI Tools Transforming Public Relations Industry",
        category: "PR",
        source: "Marketing Week",
        publishedAt: "1 day ago",
        imageUrl: "/api/placeholder/400/250",
        summary:
          "PR professionals increasingly adopt AI-powered tools for media monitoring, sentiment analysis, and content creation. Survey shows 67% of agencies now use AI assistants for routine tasks, freeing time for strategic client work and creative campaigns.",
        bridgeModule: "Learn-PR",
        bridgeLesson: "Digital PR & Modern Communication Strategies",
        bridgeUrl: "#",
        readTime: "2 min",
        originalUrl: "#",
      },
      {
        id: 4,
        title: "India's AI Startup Ecosystem Reaches $50 Billion Valuation",
        category: "AI",
        source: "Tech India Today",
        publishedAt: "1 day ago",
        imageUrl: "/api/placeholder/400/250",
        summary:
          "Indian artificial intelligence startups collectively valued at $50 billion, with 200+ companies focusing on healthcare, agriculture, and education sectors. Government's National AI Strategy drives growth through funding and regulatory support for innovation hubs.",
        bridgeModule: "Learn-AI",
        bridgeLesson: "AI Industry & Career Opportunities",
        bridgeUrl: "#",
        readTime: "2 min",
        originalUrl: "#",
      },
      {
        id: 5,
        title: "New Developer Tools Streamline Cloud Deployment",
        category: "Developer",
        source: "DevOps Weekly",
        publishedAt: "2 days ago",
        imageUrl: "/api/placeholder/400/250",
        summary:
          "Major cloud platforms introduce simplified deployment tools for developers. New containerization features and one-click deployment options reduce setup time by 70%. Particularly beneficial for junior developers and small teams launching applications quickly.",
        bridgeModule: "Learn-Developer",
        bridgeLesson: "Cloud Computing & Deployment Strategies",
        bridgeUrl: "#",
        readTime: "2 min",
        originalUrl: "#",
      },
      {
        id: 6,
        title: "Climate Change Impact on India's Monsoon Patterns",
        category: "Geography",
        source: "Climate India",
        publishedAt: "3 days ago",
        imageUrl: "/api/placeholder/400/250",
        summary:
          "Latest meteorological data reveals shifting monsoon patterns across India. Rainfall variability increases in northern regions while southern states experience prolonged dry spells. Agricultural sector adapts with new crop rotation strategies and water conservation methods.",
        bridgeModule: "Learn-Geography",
        bridgeLesson: "Climate Systems & Environmental Geography",
        bridgeUrl: "#",
        readTime: "2 min",
        originalUrl: "#",
      },
    ];

    setNews(mockNews);
  }, []);

  const categories = [
    "all",
    "Geography",
    "Physics",
    "AI",
    "Developer",
    "PR",
  ];

  const filteredNews =
    selectedCategory === "all"
      ? news
      : news.filter((item) => item.category === selectedCategory);

  const [readArticles, setReadArticles] = useState(new Set());

  const handleReadArticle = (articleId) => {
    // Track unique articles read to prevent duplicate counting
    if (!readArticles.has(articleId) && readCount < 3) {
      setReadArticles(new Set([...readArticles, articleId]));
      setReadCount(readCount + 1);
    }
  };

  return (
    <>
      <Head>
        <title>Daily Brief - AI News Summaries | iiskills.cloud</title>
        <meta
          name="description"
          content="Get AI-summarized news personalized to your learning interests. Bridge news to knowledge with direct links to relevant Learn modules."
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
                  📰 Daily Brief
                </h1>
                <p className="text-gray-600">
                  AI-summarized news personalized to your Learn interests
                </p>
              </div>
              <div className="bg-purple-100 border border-purple-300 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-purple-800">
                  🤖 AI-Powered Summaries
                </p>
              </div>
            </div>

            {/* Reading Streak Challenge */}
            <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white p-4 rounded-lg mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📚</span>
                  <div>
                    <h3 className="font-bold text-lg">Reading Challenge</h3>
                    <p className="text-sm text-white/90">
                      Read 3 summaries today, unlock a free learning hint!
                    </p>
                  </div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <p className="font-bold text-2xl">{readCount}/3</p>
                  <p className="text-xs">Read Today</p>
                </div>
              </div>
              {readCount >= 3 && (
                <div className="mt-3 bg-white/20 p-3 rounded-lg border-2 border-white/40">
                  <p className="font-bold text-lg">🎉 Challenge Complete!</p>
                  <p className="text-sm">
                    Claim your free hint in any Learn module
                  </p>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-charcoal">
                  Filter by Interest
                </h2>
                <p className="text-sm text-gray-600">
                  Based on your Learn modules
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-full font-semibold transition-all
                      ${
                        selectedCategory === category
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {category === "all" ? "All News" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                Showing <strong>{filteredNews.length}</strong> articles
              </p>
            </div>

            {/* News Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredNews.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  {/* Image Placeholder */}
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 flex items-center justify-center">
                    <span className="text-6xl">
                      {article.category === "Geography"
                        ? "🌍"
                        : article.category === "Physics"
                        ? "⚛️"
                        : article.category === "AI"
                        ? "🤖"
                        : article.category === "Developer"
                        ? "💻"
                        : article.category === "PR"
                        ? "📢"
                        : "📰"}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {article.category}
                      </span>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span>⏰ {article.publishedAt}</span>
                        <span>📖 {article.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-charcoal mb-2 leading-tight">
                      {article.title}
                    </h3>

                    {/* Source */}
                    <p className="text-sm text-gray-600 mb-4">
                      {article.source}
                    </p>

                    {/* AI Summary (60 words) */}
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-semibold text-purple-700">
                          AI Summary:
                        </span>{" "}
                        {article.summary}
                      </p>
                    </div>

                    {/* Bridge to Learn Module */}
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">🌉</span>
                        <div className="flex-1">
                          <p className="font-semibold text-green-900 mb-1">
                            Bridge to Learning
                          </p>
                          <p className="text-sm text-green-800 mb-2">
                            {article.bridgeModule}: {article.bridgeLesson}
                          </p>
                          <Link
                            href={article.bridgeUrl}
                            className="inline-block text-sm font-semibold text-green-700 hover:text-green-900 hover:underline"
                          >
                            → Go to Module
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={article.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleReadArticle(article.id)}
                        className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors"
                      >
                        Read Full Article
                      </a>
                      <button className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                        💾
                      </button>
                    </div>
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
                <li>
                  NewsAPI.org (primary) - Fetch top headlines by category
                </li>
                <li>GNews API (backup) - Alternative news aggregator</li>
                <li>
                  OpenAI API - Generate 60-word summaries from article content
                </li>
                <li>
                  Gemini API (backup) - Alternative AI summarization service
                </li>
              </ul>
              <p className="text-yellow-800 mt-3 text-sm font-semibold">
                Environment Variables Needed:
              </p>
              <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1 mt-1">
                <li>NEXT_PUBLIC_NEWS_API_KEY (NewsAPI.org)</li>
                <li>OPENAI_API_KEY (server-side for summaries)</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
