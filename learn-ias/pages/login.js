import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login({ user, loading }) {
  const router = useRouter()
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://iiskills.cloud'

  useEffect(() => {
    // Redirect to learn page if already logged in
    if (user && !loading) {
      router.push('/learn')
      return
    }

    // Redirect to main site login with return URL if not logged in
    if (!loading) {
      window.location.href = `${mainSiteUrl}/login?return=${encodeURIComponent(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3015')}/learn`
    }
  }, [user, loading, router, mainSiteUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Sign In - Learn IAS</title>
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-xl mb-4">Redirecting to login...</div>
          <p className="text-gray-600">
            You will be redirected to the universal login page
          </p>
        </div>
      </div>
    </>
  )
}
