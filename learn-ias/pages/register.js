import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Register({ user, loading }) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to learn page if already logged in
    if (user && !loading) {
      router.push('/learn')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Redirect to universal registration from main site
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://iiskills.cloud'
  
  useEffect(() => {
    // Redirect to main site registration with return URL
    window.location.href = `${mainSiteUrl}/register?return=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3015')}/learn`
  }, [])

  return (
    <>
      <Head>
        <title>Register - Learn IAS</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-xl mb-4">Redirecting to registration...</div>
          <p className="text-gray-600">
            You will be redirected to the universal registration page
          </p>
        </div>
      </div>
    </>
  )
}
