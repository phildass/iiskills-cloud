import '../styles/globals.css'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { supabase, getCurrentUser, signOutUser } from '../lib/supabaseClient'
import AuthenticationChecker from '../../components/shared/AuthenticationChecker'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    checkUser()

    // Listen for auth state changes to update navbar when user logs in/out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOutUser()
    setUser(null)
    router.push('/')
  }

  return (
    <>
      <AuthenticationChecker />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-primary">
                Learn JEE
              </Link>
              <Link href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://iiskills.cloud'} className="text-charcoal hover:text-primary transition">
                ← Back to iiskills.cloud
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {loading ? null : user ? (
                <>
                  <Link href="/learn" className="text-charcoal hover:text-primary transition">
                    My Learning
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-charcoal hover:text-primary transition">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Component {...pageProps} user={user} />

      <Footer />
    </>
  )
}
