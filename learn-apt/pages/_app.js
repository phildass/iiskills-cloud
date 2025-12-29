import '../styles/globals.css'
import { AdminProvider } from '../contexts/AdminContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SharedNavbar from '../components/shared/SharedNavbar'
import Footer from '../components/Footer'
import { getCurrentUser, signOutUser } from '../lib/supabaseClient'

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  const handleLogout = async () => {
    const { success } = await signOutUser()
    if (success) {
      setUser(null)
      router.push('/')
    }
  }

  return (
    <AdminProvider>
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn-Apt"
        homeUrl="/"
        showAuthButtons={true}
      />
      <Component {...pageProps} />
      <Footer />
    </AdminProvider>
  )
}
