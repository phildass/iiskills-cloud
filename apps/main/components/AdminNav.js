import Link from 'next/link'
import { useRouter } from 'next/router'
import { getMainSiteUrl, isOnSubdomain } from '../utils/urlHelper'
import { signOutUser } from '../lib/supabaseClient'

/**
 * Admin Navigation Bar
 * 
 * Navigation bar for admin pages with Supabase authentication.
 * Shows admin section links and logout functionality.
 */
export default function AdminNav() {
  const router = useRouter()

  const handleLogout = async () => {
    const { success } = await signOutUser()
    if (success) {
      router.push('/')
    }
  }

  // Determine the main site URL
  const mainSiteUrl = getMainSiteUrl()
  const onAdminSubdomain = isOnSubdomain('admin')

  return (
    <div className="bg-yellow-100 border-b-4 border-yellow-500 py-2 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-yellow-800">🔒 ADMIN MODE</span>
          <nav className="space-x-4 text-sm">
            <Link href="/admin" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Dashboard
            </Link>
            <Link href="/admin/courses" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Courses
            </Link>
            <Link href="/admin/content" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Content
            </Link>
            <Link href="/admin/users" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Users
            </Link>
            <Link href="/admin/settings" className="text-yellow-900 hover:text-yellow-700 font-medium">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
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
  )
}
