import Head from 'next/head'
import ProtectedRoute from '../../components/ProtectedRoute'
import AdminNav from '../../components/AdminNav'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function AdminContent() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Content Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Content Management</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Homepage Content</h2>
            <p className="text-gray-600 mb-4">Edit homepage sections, hero text, and featured content</p>
            <button className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
              Edit Homepage
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">About Page</h2>
            <p className="text-gray-600 mb-4">Update mission, vision, and organization information</p>
            <button className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
              Edit About
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Certification Page</h2>
            <p className="text-gray-600 mb-4">Edit certification requirements and information</p>
            <button className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
              Edit Certification
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">Update contact details and company information</p>
            <button className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
              Edit Contact
            </button>
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-800">
            <strong>Note:</strong> Content editing functionality is in development. For now, content can be edited directly in the page files.
          </p>
        </div>
      </main>
      
      <Footer />
    </ProtectedRoute>
  )
}
