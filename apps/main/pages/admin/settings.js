import Head from "next/head";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { getCurrentPricing, formatPrice } from "../../utils/pricing";

export default function AdminSettings() {
  const pricing = getCurrentPricing();
  return (
    <ProtectedRoute>
      <Head>
        <title>Settings - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav /><main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Site Settings</h1>

        <div className="space-y-6">
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
                    New fees will be effective from Feb 29, 2026 midnight. Regular pricing (₹352.82)
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
                    <span className="text-gray-700">Introductory Period (Until Feb 28, 2026):</span>
                    <span className="font-bold">₹116.82</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">
                      Regular Pricing (From Feb 29, 2026 midnight):
                    </span>
                    <span className="font-bold">₹352.82</span>
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
    </ProtectedRoute>
  );
}
