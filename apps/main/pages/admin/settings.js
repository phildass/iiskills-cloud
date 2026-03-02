import Head from "next/head";
import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { getCurrentPricing, formatPrice } from "../../utils/pricing";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

export default function AdminSettings() {
  const { ready, denied } = useAdminProtectedPage();
  const pricing = getCurrentPricing();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    // Check current password (default is 'iiskills123')
    const storedPassword = localStorage.getItem("iiskills_admin_password") || "iiskills123";
    if (currentPassword !== storedPassword) {
      setPasswordError("Current password is incorrect");
      return;
    }

    // Save new password to localStorage
    // NOTE: This is for demo purposes only. In production, this should be stored securely in a database
    localStorage.setItem("iiskills_admin_password", newPassword);
    
    // Update the environment variable equivalent in localStorage for SecretPasswordPrompt
    // This ensures the new password works with the login prompt
    if (typeof window !== "undefined") {
      // Clear the session to force re-authentication with new password
      localStorage.removeItem("iiskills_secret_admin");
      sessionStorage.removeItem("iiskills_secret_admin");
    }

    setPasswordMessage("Password changed successfully! Please log in again with your new password.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Redirect to login after 2 seconds
    setTimeout(() => {
      window.location.href = "/admin";
    }, 2000);
  };

  if (denied) return <AccessDenied />;
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>;

  return (
    <>
      <Head>
        <title>Settings - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Site Settings</h1>

        <div className="space-y-6">
          {/* Admin Password Management */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-red-600 mb-4">🔐 Admin Password Management</h2>
            <p className="text-sm text-gray-600 mb-4">
              Change your admin password. Default password is <code className="bg-gray-100 px-2 py-1 rounded">iiskills123</code>
            </p>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <div className="bg-red-50 border-2 border-red-300 rounded p-3">
                  <p className="text-red-700 text-sm font-medium">{passwordError}</p>
                </div>
              )}

              {passwordMessage && (
                <div className="bg-green-50 border-2 border-green-300 rounded p-3">
                  <p className="text-green-700 text-sm font-medium">{passwordMessage}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Change Admin Password
              </button>
            </form>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-yellow-800 text-xs">
                <strong>⚠️ Security Note:</strong> This is a demo implementation. In production, passwords should be stored securely in a database with proper hashing and encryption.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Site Title</label>
                <input
                  type="text"
                  defaultValue="iiskills.cloud"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Site Description
                </label>
                <textarea
                  rows="3"
                  defaultValue="Indian Institute of Professional Skills Development"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Pricing Settings</h2>

            {/* Current Pricing Display */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <h3 className="font-semibold text-blue-900 mb-2">Current Active Pricing</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Base Price:</span>
                  <span className="ml-2 font-bold">{formatPrice(pricing.basePrice)}</span>
                </div>
                <div>
                  <span className="text-blue-700">
                    GST ({(pricing.gstRate * 100).toFixed(0)}%):
                  </span>
                  <span className="ml-2 font-bold">{formatPrice(pricing.gstAmount)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Total Price:</span>
                  <span className="ml-2 font-bold text-lg">{formatPrice(pricing.totalPrice)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Status:</span>
                  <span className="ml-2 font-bold">
                    {pricing.isIntroductory ? "Introductory" : "Regular"}
                  </span>
                </div>
              </div>
              {pricing.isIntroductory && (
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <p className="text-blue-800 text-sm">
                    <strong>⏰ Introductory offer ends:</strong>{" "}
                    {pricing.introEndDate.toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-blue-700 text-xs mt-1">
                    New fees will be effective from April 01, 2026. Regular pricing (Rs 352.82)
                    will apply.
                  </p>
                </div>
              )}
            </div>

            {/* Pricing Schedule Information */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Automated Pricing Schedule</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">Introductory Period (Until March 31, 2026):</span>
                    <span className="font-bold">Rs 116.82</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">
                      Regular Pricing (From April 01, 2026):
                    </span>
                    <span className="font-bold">Rs 352.82</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Note: Pricing is managed automatically based on date. Courses purchased during the
                  introductory period maintain their purchase price.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Certification Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Minimum Pass Percentage
                </label>
                <input
                  type="number"
                  defaultValue="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition">
              Cancel
            </button>
            <button className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-blue-700 transition">
              Save Settings
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-800">
            <strong>Note:</strong> Settings changes are for demonstration. Backend integration is
            required for persistent changes.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
