import { useState } from 'react'
import Link from 'next/link'

/**
 * Subdomain Navigation Bar Component
 * 
 * This component provides a secondary navigation bar for subdomains
 * with a dropdown menu for subdomain-specific pages/sections.
 * Should be placed below the main SharedNavbar.
 * 
 * Props:
 * - subdomainName: Name of the subdomain (e.g., 'Learn-Apt', 'Learn AI')
 * - sections: Array of section objects with { label, href, description }
 */
export default function SubdomainNavbar({ 
  subdomainName = 'Module',
  sections = []
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Subdomain Name and Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <span className="text-lg">{subdomainName} Navigation</span>
            <svg 
              className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && sections.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 text-sm">Navigate to:</h3>
              </div>
              {sections.map((section, index) => (
                <Link
                  key={index}
                  href={section.href}
                  className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <div className="text-gray-800 font-medium text-sm">
                    {section.label}
                  </div>
                  {section.description && (
                    <div className="text-gray-600 text-xs mt-1">
                      {section.description}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Helper Text */}
        <div className="hidden md:block text-sm opacity-90">
          {sections.length > 0 ? `${sections.length} sections available` : 'Module navigation'}
        </div>
      </div>

      {/* Mobile Dropdown Overlay */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  )
}
