"use client";

import { useState } from "react";
import { 
  Brain, 
  Settings, 
  BarChart3, 
  FileText, 
  ExternalLink,
  Globe,
  CheckCircle,
  AlertCircle,
  Wrench,
  ArrowRight,
  Home,
} from "lucide-react";
import { SUBDOMAINS, SubdomainConfig, getAdminUrl } from "@/config/subdomains";
import Link from "next/link";

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Settings,
  BarChart3,
  FileText,
  Globe,
};

// Map status to icon and color
const statusConfig = {
  active: { icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/50" },
  development: { icon: Wrench, color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/50" },
  maintenance: { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/50" },
};

// Map category to color
const categoryColors = {
  learning: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10",
  admin: "border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10",
  content: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10",
  analytics: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10",
};

export default function SubdomainsPage() {
  const [selectedCategory, setSelectedCategory] = useState<SubdomainConfig["category"] | "all">("all");

  // Filter subdomains by selected category
  const filteredSubdomains = selectedCategory === "all" 
    ? SUBDOMAINS 
    : SUBDOMAINS.filter(subdomain => subdomain.category === selectedCategory);

  // Group subdomains by category for display
  const subdomainsByCategory = SUBDOMAINS.reduce((acc, subdomain) => {
    if (!acc[subdomain.category]) {
      acc[subdomain.category] = [];
    }
    acc[subdomain.category].push(subdomain);
    return acc;
  }, {} as Record<string, SubdomainConfig[]>);

  const handleSubdomainClick = (subdomainId: string) => {
    const adminUrl = getAdminUrl(subdomainId);
    if (adminUrl) {
      window.location.assign(adminUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Central Admin Dashboard</span>
            </div>
            <Link
              href="/admin"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              <Home className="h-5 w-5" />
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Subdomain Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and access all iiskills.cloud subdomains from this central dashboard
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Subdomains</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{SUBDOMAINS.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {SUBDOMAINS.filter(s => s.status === "active").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <Wrench className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">In Development</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {SUBDOMAINS.filter(s => s.status === "development").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Maintenance</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {SUBDOMAINS.filter(s => s.status === "maintenance").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            }`}
          >
            All Categories
          </button>
          {Object.keys(subdomainsByCategory).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as SubdomainConfig["category"])}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {category} ({subdomainsByCategory[category].length})
            </button>
          ))}
        </div>

        {/* Subdomains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubdomains.map((subdomain) => {
            const Icon = iconMap[subdomain.icon] || Globe;
            const StatusIcon = statusConfig[subdomain.status].icon;
            const statusColor = statusConfig[subdomain.status].color;
            const statusBgColor = statusConfig[subdomain.status].bgColor;
            const categoryColor = categoryColors[subdomain.category];

            return (
              <div
                key={subdomain.id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${categoryColor}`}
              >
                <div className="p-6">
                  {/* Icon and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${statusBgColor}`}>
                      <Icon className={`h-8 w-8 ${statusColor}`} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusBgColor} ${statusColor} flex items-center gap-1`}>
                      <StatusIcon className="h-3 w-3" />
                      {subdomain.status}
                    </div>
                  </div>

                  {/* Title and Category */}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {subdomain.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                    {subdomain.category}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                    {subdomain.description}
                  </p>

                  {/* URL */}
                  <div className="mb-4 p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs text-slate-600 dark:text-slate-400 font-mono truncate">
                    {subdomain.url}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubdomainClick(subdomain.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      Open Admin
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <a
                      href={subdomain.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                      title="Open subdomain in new tab"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSubdomains.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <Globe className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No subdomains found
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No subdomains match the selected category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
