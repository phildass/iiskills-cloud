/**
 * Admin First-Time Setup Page
 * 
 * This page allows unauthenticated access for creating the first admin account
 * ONLY when ADMIN_SETUP_MODE environment variable is set to 'true'.
 * 
 * Security Features:
 * - Feature flag guard (ADMIN_SETUP_MODE must be explicitly enabled)
 * - Only accessible if no admin account exists
 * - Automatic disable after successful setup
 * - Audit logging for all setup events
 * - Password strength validation
 * - Bcrypt password hashing
 * 
 * Rollback Instructions:
 * 1. Set ADMIN_SETUP_MODE=false in environment
 * 2. Restart the server
 * 3. Page will return 404 or redirect to login
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminSetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [setupAllowed, setSetupAllowed] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkSetupAvailability();
  }, []);

  const checkSetupAvailability = async () => {
    // Check if ADMIN_SETUP_MODE is enabled
    const setupMode = process.env.NEXT_PUBLIC_ADMIN_SETUP_MODE === 'true';
    
    if (!setupMode) {
      console.log('Admin setup is disabled (ADMIN_SETUP_MODE not enabled)');
      setSetupAllowed(false);
      setIsLoading(false);
      // Redirect to login after a brief moment
      setTimeout(() => {
        router.push('/admin/universal');
      }, 2000);
      return;
    }

    // Check if admin already exists
    try {
      const response = await fetch('/api/admin/auth?action=check', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.hasPassword) {
        console.log('Admin account already exists');
        setAdminExists(true);
        setSetupAllowed(false);
        // Redirect to login page
        setTimeout(() => {
          router.push('/admin/universal');
        }, 3000);
      } else {
        console.log('✅ Admin setup available');
        setSetupAllowed(true);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setError('Failed to check setup status. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!confirmPassword) {
      setError('Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password strength (basic check)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setError('Password should contain uppercase, lowercase, and numbers');
      return;
    }

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'setup', 
          password,
          email: email || undefined // Optional email
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        
        // Show success message with instructions
        setTimeout(() => {
          router.push('/admin/universal');
        }, 5000);
      } else {
        setError(data.error || 'Setup failed. Please try again.');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('An error occurred during setup. Please try again.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking setup availability...</p>
        </div>
      </div>
    );
  }

  // Setup not allowed
  if (!setupAllowed) {
    return (
      <>
        <Head>
          <title>Admin Setup - iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              {adminExists ? (
                <>
                  <div className="text-green-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Setup Already Complete
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Admin account already exists. Redirecting to login...
                  </p>
                </>
              ) : (
                <>
                  <div className="text-red-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Admin Setup Disabled
                  </h1>
                  <p className="text-gray-600 mb-4">
                    ADMIN_SETUP_MODE is not enabled. Set ADMIN_SETUP_MODE=true to enable first-time setup.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting to admin login...
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Success state
  if (success) {
    return (
      <>
        <Head>
          <title>Setup Complete - iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="text-green-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Setup Complete!
              </h1>
              <p className="text-gray-600 mb-6">
                Admin account created successfully. You will be redirected to the admin dashboard.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 font-semibold mb-2">
                  ⚠️ IMPORTANT NEXT STEPS
                </p>
                <ol className="text-xs text-yellow-700 text-left list-decimal list-inside space-y-1">
                  <li>Set ADMIN_SETUP_MODE=false in your environment</li>
                  <li>Restart the server to disable setup mode</li>
                  <li>Keep your password secure</li>
                  <li>Review audit logs for security</li>
                </ol>
              </div>

              <div className="text-xs text-gray-500">
                Redirecting in 5 seconds...
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Setup form
  return (
    <>
      <Head>
        <title>First-Time Admin Setup - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          {/* Feature Flag Warning */}
          <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ SETUP MODE ACTIVE</strong><br />
                  This page is only accessible with ADMIN_SETUP_MODE enabled.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              First-Time Admin Setup
            </h1>
            <p className="text-gray-600">
              Create the first admin account for secure access
            </p>
          </div>

          <form onSubmit={handleSetupSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Create Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min. 8 chars, mixed case + numbers"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
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

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Create Admin Account
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Security Notes:</strong><br />
              • Password will be hashed with bcrypt (12 rounds)<br />
              • Setup event will be logged for audit<br />
              • Setup mode disables automatically after creation<br />
              • You must set ADMIN_SETUP_MODE=false and restart
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
