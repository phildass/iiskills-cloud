import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UniversalAdminDashboard from '../../components/UniversalAdminDashboard';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check if DEBUG_ADMIN is enabled
    const debugAdmin = process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true';
    
    if (debugAdmin) {
      console.log('🔓 DEBUG_ADMIN mode: Authentication bypassed');
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if user has admin token in localStorage
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      // Verify token
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify', token }),
        });
        
        const data = await response.json();
        
        if (data.valid) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      }
    }

    // Check if password has been set
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check' }),
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

    try {
      const action = hasPassword ? 'login' : 'setup';
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
        }
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
          <title>Admin Login - iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
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
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={hasPassword ? 'Enter your password' : 'Create a password'}
                  required
                />
              </div>

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

            {process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Debug Mode:</strong> Set NEXT_PUBLIC_DEBUG_ADMIN=true to bypass authentication
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
      
      <UniversalAdminDashboard />
    </>
  );
}
