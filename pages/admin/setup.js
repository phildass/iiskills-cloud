/**
 * Admin Setup Page
 * 
 * First-time admin account creation page.
 * 
 * SECURITY REQUIREMENTS:
 * - Only active when process.env.ADMIN_SETUP_MODE === 'true'
 * - Only active when no admin accounts exist
 * - Creates first admin with bcrypt-hashed password
 * - Logs all setup attempts to logs/admin-setup.log
 * - Instructs operator to set ADMIN_SETUP_MODE=false after setup
 * 
 * DO NOT LEAVE OPEN BYPASS IN PRODUCTION!
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AdminSetup() {
  const router = useRouter();
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [setupInstructions, setSetupInstructions] = useState('');

  useEffect(() => {
    // Check if setup mode is enabled
    checkSetupMode();
  }, []);

  const checkSetupMode = async () => {
    try {
      const response = await fetch('/api/admin/setup/check');
      const data = await response.json();
      
      if (data.setupEnabled) {
        setIsSetupMode(true);
      } else {
        setError(data.message || 'Admin setup is not available');
      }
    } catch (err) {
      setError('Failed to check setup mode');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName || formData.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setSetupInstructions(data.instructions || 'Admin account created successfully. Please set ADMIN_SETUP_MODE=false in your environment variables.');
      } else {
        setError(data.error || 'Failed to create admin account');
      }
    } catch (err) {
      setError('An error occurred during setup: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking setup mode...</p>
        </div>
      </div>
    );
  }

  if (!isSetupMode) {
    return (
      <>
        <Head>
          <title>Admin Setup Not Available | Cricket Universe</title>
        </Head>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Not Available</h1>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">{error}</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Admin setup is only available when:
            </p>
            <ul className="text-sm text-gray-600 mb-6 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>ADMIN_SETUP_MODE environment variable is set to "true"</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>No admin accounts exist in the system</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Admin Setup Complete | Cricket Universe</title>
        </Head>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Admin Account Created!</h1>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-gray-800 font-semibold mb-2">Setup Successful</p>
              <p className="text-gray-700 mb-4">
                Your admin account has been created and the setup has been logged.
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
              <p className="text-red-800 font-bold mb-2">⚠️ IMPORTANT - Next Steps:</p>
              <ol className="text-gray-800 space-y-2 list-decimal list-inside">
                <li>Immediately set <code className="bg-gray-200 px-2 py-1 rounded">ADMIN_SETUP_MODE=false</code> in your environment variables</li>
                <li>Restart your application</li>
                <li>Verify that this setup page is no longer accessible</li>
                <li>Review the audit log at <code className="bg-gray-200 px-2 py-1 rounded">logs/admin-setup.log</code></li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 whitespace-pre-line">{setupInstructions}</p>
            </div>

            <button
              onClick={() => router.push('/admin')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>First-Time Admin Setup | Cricket Universe</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">First-Time Admin Setup</h1>
            <p className="text-gray-600">Create the initial administrator account</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Security Notice:</p>
            <p className="text-sm text-yellow-700">
              This page is only accessible because ADMIN_SETUP_MODE is enabled. 
              After creating your admin account, you MUST disable this mode.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name (Optional)
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Re-enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold mt-6"
            >
              Create Admin Account
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This admin account will have full system access. 
              Choose a strong password and store it securely.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
