import Head from 'next/head'
import ProtectedRoute from '../../components/ProtectedRoute'
import AdminNav from '../../components/AdminNav'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AdminSettings() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Settings - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
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
                <label className="block text-sm font-medium text-charcoal mb-2">Site Description</label>
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Course Base Price (₹)</label>
                <input 
                  type="number" 
                  defaultValue="99"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">GST Rate (%)</label>
                <input 
                  type="number" 
                  defaultValue="18"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Certification Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Minimum Pass Percentage</label>
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
            <strong>Note:</strong> Settings changes are for demonstration. Backend integration is required for persistent changes.
          </p>
        </div>
      </main>
      
      <Footer />
    </ProtectedRoute>
  )
}
