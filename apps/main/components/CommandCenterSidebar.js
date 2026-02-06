import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * CommandCenterSidebar - Consistent sidebar for Portal Feature Pages
 * 
 * Provides navigation between:
 * - Career Mapper (Skill Constellation & Career Guidance)
 * - Opportunity Feed (Jobs & Internships)
 * - Daily Brief (AI News Summaries)
 * - Exam Countdown (Education Alerts)
 * 
 * Features:
 * - Active state highlighting
 * - Responsive design (collapsible on mobile)
 * - Streak indicators
 */
export default function CommandCenterSidebar() {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      href: "/career-mapper",
      label: "Career Mapper",
      icon: "🌌",
      description: "Skill Constellation",
      badge: "New",
    },
    {
      href: "/opportunity-feed",
      label: "Opportunity Feed",
      icon: "💼",
      description: "Jobs & Internships",
      badge: "Live",
    },
    {
      href: "/daily-brief",
      label: "Daily Brief",
      icon: "📰",
      description: "AI News Summaries",
      badge: "Updated",
    },
    {
      href: "/exam-countdown",
      label: "Exam Countdown",
      icon: "⏰",
      description: "Education Alerts",
      badge: "Active",
    },
  ];

  const isActive = (href) => router.pathname === href;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-20 left-4 z-50 bg-primary text-white p-3 rounded-lg shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-72 lg:w-64 bg-white shadow-xl lg:shadow-lg
          z-40 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary mb-2">
            ⚡ Command Center
          </h2>
          <p className="text-sm text-gray-600">
            Your free learning utilities
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  block p-4 rounded-lg transition-all duration-200
                  ${
                    active
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-50 text-charcoal hover:bg-gray-100 hover:shadow"
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold text-base">{item.label}</span>
                    </div>
                    <p
                      className={`text-sm ${
                        active ? "text-white/90" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                  {item.badge && (
                    <span
                      className={`
                        px-2 py-1 text-xs rounded-full font-semibold
                        ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-primary/10 text-primary"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Streak Tracker */}
        <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-orange-800">Your Streak</span>
          </div>
          <p className="text-sm text-orange-700 mb-2">
            Keep exploring to unlock rewards!
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((day) => (
              <div
                key={day}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${day <= 3 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}
                `}
              >
                {day}
              </div>
            ))}
          </div>
          <p className="text-xs text-orange-600 mt-2">
            3 day streak! 🎯
          </p>
        </div>

        {/* Quick Links */}
        <div className="p-4 mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2 text-sm">
            📚 Quick Access
          </h3>
          <div className="space-y-1">
            <Link
              href="/courses"
              className="block text-sm text-blue-700 hover:text-blue-900 hover:underline"
            >
              → All Courses
            </Link>
            <Link
              href="/dashboard"
              className="block text-sm text-blue-700 hover:text-blue-900 hover:underline"
            >
              → My Dashboard
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
