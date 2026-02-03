import '../styles/globals.css'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import SharedNavbar from '../../../components/shared/SharedNavbar'
import { canonicalLinks } from '../../../components/shared/canonicalNavLinks'
import Footer from '@iiskills/ui/src/Footer'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (if configured)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
    }
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon-learn-cricket.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-cricket.svg" />
      </Head>

      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn Cricket"
        homeUrl="/"
        customLinks={canonicalLinks}
        showAuthButtons={true}
      />
      <Component {...pageProps} user={user} />
      <Footer />
    </>
  )
}
