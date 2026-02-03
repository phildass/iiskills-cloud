"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getMainSiteUrl, isOnSubdomain } from "../utils/urlHelper";
import { signOutUser } from "../lib/supabaseClient";
import { LEARNING_SITES } from "../lib/siteConfig";
import { getSiteUrl } from "../lib/navigation";

/**
 * Admin Navigation Bar
 *
 * Navigation bar for admin pages with Supabase authentication.
 * Shows admin section links and logout functionality.
 */
export default function AdminNav() {
  const router = useRouter();
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);

  const handleLogout = async () => {
    const { success } = await signOutUser();
    if (success) {
      router.push("/");
    }
  };

  // Determine the main site URL
  const mainSiteUrl = getMainSiteUrl();
  const onAdminSubdomain = isOnSubdomain("admin");

  return (
    <div className="bg-yellow-100 border-b-4 border-yellow-500 py-2 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-yellow-800">🔒 ADMIN MODE</span>
          <nav className="space-x-4 text-sm">
            <Link href="/admin" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Dashboard
            </Link>
            <Link
              href="/admin/courses"
              className="text-yellow-900 hover:text-yellow-700 font-medium"
            >
              Courses
            </Link>
            <Link
              href="/admin/modules"
              className="text-yellow-900 hover:text-yellow-700 font-medium"
            >
              Modules
            </Link>
            <Link
              href="/admin/lessons"
              className="text-yellow-900 hover:text-yellow-700 font-medium"
            >
              Lessons
            </Link>
            <Link
              href="/admin/content"
              className="text-yellow-900 hover:text-yellow-700 font-medium"
            >
              Content
            </Link>
            <Link href="/admin/users" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Users
            </Link>
            <Link
              href="/admin/settings"
              className="text-yellow-900 hover:text-yellow-700 font-medium"
            >
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          {/* Site Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSiteDropdown(!showSiteDropdown)}
              className="bg-yellow-800 text-white px-4 py-1 rounded text-sm font-medium hover:bg-yellow-900 transition flex items-center"
            >
              🌐 Sites
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showSiteDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="py-1">
                  {LEARNING_SITES.map((site) => (
                    <a
                      key={site.slug}
                      href={getSiteUrl(site.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {site.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Link back to main site */}
          <a
            href={mainSiteUrl}
            className="text-yellow-900 hover:text-yellow-700 font-medium text-sm"
            title="Go to main site"
          >
            ← Main Site
          </a>
          <button
            onClick={handleLogout}
            className="bg-yellow-800 text-white px-4 py-1 rounded text-sm font-medium hover:bg-yellow-900 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
