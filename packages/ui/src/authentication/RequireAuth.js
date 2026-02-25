"use client";

import { useUser } from './useUser';
import Link from 'next/link';

/**
 * RequireAuth — wraps content that needs an authenticated user.
 *
 * - If loading: shows a spinner
 * - If not authenticated: shows a login/register prompt
 * - If authenticated: renders children
 *
 * Props:
 *   children       — content to render when authenticated
 *   loginPath      — path to login page (default: /login)
 *   registerPath   — path to register page (default: /register)
 *   message        — custom message for unauthenticated state
 */
export default function RequireAuth({
  children,
  loginPath = '/login',
  registerPath = '/register',
  message = 'Please log in or register to access this content.',
}) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-3 text-gray-600 text-sm">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-4 justify-center">
            <Link
              href={loginPath}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href={registerPath}
              className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
