import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UniversalAdminDashboard from '../../components/UniversalAdminDashboard';

/**
 * Universal Admin Page with Password-First Authentication
 * 
 * ⚠️ TEST MODE ONLY - DO NOT KEEP IN PRODUCTION
 * 
 * Features:
 * - First-time password setup flow
 * - Persistent password storage in Supabase
 * - JWT-based session management
 * - HttpOnly cookie authentication
 * 
 * Rollback Instructions:
 * - Restore Supabase user-based authentication
 * - Remove password-first authentication
 * - Use isAdmin() check for authorization
 */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if TEST_MODE is enabled - if not, we should still support the password auth
    const testMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
    
    if (testMode) {
      console.log('🧪 TEST MODE: Password-first admin authentication enabled');
    }

    try {
      // First, verify if user already has a valid token (from cookie)
      const verifyResponse = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify' }),
        credentials: 'include', // Include cookies
      });

      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        if (verifyData.ok) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    // Check if password has been set
    try {
      const response = await fetch('/api/admin/auth?action=check', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      setHasPassword(data.hasPassword);
    } catch (error) {
      console.error('Failed to check password status:', error);
    }
    
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    // For setup, require password confirmation
    if (!hasPassword) {
      if (!confirmPassword) {
        setError('Please confirm your password');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    }

    try {
      const action = hasPassword ? 'login' : 'setup';
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password }),
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setHasPassword(true);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
        credentials: 'include',
      });
      
      setIsAuthenticated(false);
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to check if password still exists
      checkAuth();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin {hasPassword ? 'Login' : 'Setup'} - iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
            {/* Test Mode Warning */}
            {process.env.NEXT_PUBLIC_TEST_MODE === 'true' && (
              <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ TEST MODE ACTIVE</strong><br />
                      Password-first admin authentication enabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {hasPassword ? 'Admin Login' : 'Setup Admin Access'}
              </h1>
              <p className="text-gray-600">
                {hasPassword 
                  ? 'Enter your password to access the admin dashboard' 
                  : 'Set up your admin password (first time only)'}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {hasPassword ? 'Password' : 'Create Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={hasPassword ? 'Enter your password' : 'Min. 8 characters'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {!hasPassword && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                {hasPassword ? 'Login' : 'Set Password & Continue'}
              </button>
            </form>

            {!hasPassword && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> This password will be securely stored and required for all future admin access.
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Universal Admin Dashboard - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      {/* Test Mode Warning Banner */}
      {process.env.NEXT_PUBLIC_TEST_MODE === 'true' && (
        <div className="bg-yellow-100 border-b-2 border-yellow-400 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-yellow-800">
                <strong>TEST MODE:</strong> All paywalls and authentication bypassed
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Logout button for normal mode */}
        {process.env.NEXT_PUBLIC_TEST_MODE !== 'true' && (
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow"
            >
              Logout
            </button>
          </div>
        )}
        
        <UniversalAdminDashboard />
      </div>
    </>
  );
}
