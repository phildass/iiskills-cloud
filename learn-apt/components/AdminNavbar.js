/**
 * Admin Navigation Component
 * 
 * Navigation bar for admin pages with links to all admin sections
 * and a sign-out button.
 */

import { useRouter } from 'next/router'
import { useAdmin } from '../contexts/AdminContext'

export default function AdminNavbar() {
  const router = useRouter()
  const { signOut } = useAdmin()

  const handleSignOut = () => {
    signOut()
    router.push('/admin')
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/change-password', label: 'Change Password', icon: '🔑' },
    { href: '/', label: 'View Site', icon: '🏠' },
  ]

  return (
    <nav className="bg-gradient-to-r from-primary to-accent text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔐</span>
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs opacity-90">Learn-Apt</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  router.pathname === link.href
                    ? 'bg-white bg-opacity-20 font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4 flex flex-wrap gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
                router.pathname === link.href
                  ? 'bg-white bg-opacity-20 font-semibold'
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
