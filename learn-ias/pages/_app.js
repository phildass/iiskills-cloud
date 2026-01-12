import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase, getCurrentUser } from '../lib/supabaseClient'
import AuthenticationChecker from '../../components/shared/AuthenticationChecker'
import Link from 'next/link'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: authListener } = supabase?.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      router.push('/')
    }
  }

  return (
    <>
      <AuthenticationChecker />
      <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Learn IAS</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-charcoal hover:text-primary transition">
                Home
              </Link>
              {user ? (
                <>
                  <Link href="/learn" className="text-charcoal hover:text-primary transition">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-charcoal hover:text-primary transition">
                    Sign In
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Component {...pageProps} user={user} loading={loading} />
      </main>
    </div>
    </>
  )
}
