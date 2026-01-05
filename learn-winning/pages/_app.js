import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SharedNavbar from '../../components/shared/SharedNavbar'
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
    <>
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn Winning"
        homeUrl="/"
        showAuthButtons={true}
        customLinks={[
          { href: 'https://iiskills.cloud', label: 'Home', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/courses', label: 'Courses', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/certification', label: 'Certification', className: 'hover:text-primary transition' },
          { href: 'https://www.aienter.in/payments', label: 'Payments', className: 'bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold', mobileClassName: 'block bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold', target: '_blank', rel: 'noopener noreferrer' },
          { href: 'https://iiskills.cloud/about', label: 'About', className: 'hover:text-primary transition' },
          { href: 'https://iiskills.cloud/terms', label: 'Terms & Conditions', className: 'hover:text-primary transition' }
        ]}
      />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
