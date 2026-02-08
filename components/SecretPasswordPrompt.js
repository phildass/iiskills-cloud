/**
 * Secret Password Prompt Component
 * 
 * Provides an alternative admin access mechanism through a secret password.
 * When user is not logged in as admin, shows a password input box.
 * On correct password entry ('iiskills123'), grants admin access for the session.
 * 
 * Usage:
 * - Local dev (NEXT_PUBLIC_DISABLE_AUTH=true): Full access, no prompt shown
 * - Online (NEXT_PUBLIC_DISABLE_AUTH=false): Only authenticated admins OR users 
 *   who enter the secret password get admin access
 * 
 * ⚠️ SECURITY WARNING: This is a backdoor for demo/testing purposes.
 * Remove or disable for production deployments!
 */

import { useState, useEffect } from "react";

const SECRET_PASSWORD = "iiskills123";
const ADMIN_FLAG_KEY = "iiskills_secret_admin";

export default function SecretPasswordPrompt({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate a small delay for UX
    setTimeout(() => {
      if (password === SECRET_PASSWORD) {
        // Store admin flag in localStorage for session persistence
        if (typeof window !== "undefined") {
          localStorage.setItem(ADMIN_FLAG_KEY, "true");
          sessionStorage.setItem(ADMIN_FLAG_KEY, "true");
        }
        
        console.log("✅ Secret password accepted - Admin access granted");
        
        // Call success callback to update parent component
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Access</h1>
          <p className="text-gray-600">Enter the secret password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="secretPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Secret Password
            </label>
            <input
              id="secretPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-lg"
              placeholder="Enter secret password"
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Unlock Admin Access"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Or login with your account</p>
          <a
            href="/login"
            className="text-primary hover:text-blue-700 font-medium text-sm"
          >
            Go to Login →
          </a>
        </div>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Utility function to check if user has secret admin access
 * @returns {boolean} True if secret password was entered
 */
export function hasSecretAdminAccess() {
  if (typeof window === "undefined") return false;
  
  return (
    localStorage.getItem(ADMIN_FLAG_KEY) === "true" ||
    sessionStorage.getItem(ADMIN_FLAG_KEY) === "true"
  );
}

/**
 * Utility function to clear secret admin access
 * Call this on logout or session end
 */
export function clearSecretAdminAccess() {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(ADMIN_FLAG_KEY);
  sessionStorage.removeItem(ADMIN_FLAG_KEY);
  console.log("🔓 Secret admin access cleared");
}
