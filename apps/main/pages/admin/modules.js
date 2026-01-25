import Head from "next/head";
import { useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminNav from "../../components/AdminNav";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminModules() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    order: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Module creation will be implemented when database schema is added
    alert('Module management will be fully functional once the database schema is set up.');
    setShowModal(false);
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Module Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Module Management</h1>
            <p className="text-gray-600 mt-2">Organize course modules across all sites</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            + Add New Module
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Module management functionality will be fully operational once the database schema for modules is created. The interface is ready to manage course modules including creation, editing, ordering, and deletion.
              </p>
            </div>
          </div>
        </div>

        {/* Modules Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lessons
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No modules found. Module management will be available once the database schema is set up.
                  <br />
                  <span className="text-xs text-gray-400 mt-2 block">
                    Database table 'modules' needs to be created with fields: id, course_id, title, description, order, created_at, updated_at
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Feature List */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Planned Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Create & Edit Modules</h3>
                <p className="text-sm text-gray-600">Add new modules to courses with titles and descriptions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Module Ordering</h3>
                <p className="text-sm text-gray-600">Drag-and-drop or manual ordering of modules</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Course Association</h3>
                <p className="text-sm text-gray-600">Link modules to specific courses</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Lesson Management</h3>
                <p className="text-sm text-gray-600">View and manage lessons within each module</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Module</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Introduction to AI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Brief description of this module"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <select
                    required
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a course...</option>
                    <option value="1">Sample Course (Placeholder)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Module order within the course</p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-blue-700 transition"
                  >
                    Create Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </ProtectedRoute>
  );
}
