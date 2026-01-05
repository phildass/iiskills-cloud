import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

/**
 * Admin Login Redirect Page
 * 
 * This page redirects to the main login page with admin access request.
 * Admin access is granted based on Supabase user role, not a separate login.
 * 
 * Security:
 * - No separate admin credentials
 * - Uses main Supabase authentication
 * - Role-based access control via user metadata
 */
export default function AdminLogin() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main login with admin redirect parameter
    router.push('/login?redirect=/admin')
  }, [router])

  return (
    <>
      <Head>
        <title>Admin Access - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">Admin Access</h1>
          <p className="text-charcoal mb-4">Redirecting to login...</p>
          <p className="text-sm text-gray-600">
            Admin access requires a valid user account with admin role.
          </p>
        </div>
      </div>
    </>
  )
}
