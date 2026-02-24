import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminGate } from "../../components/AdminGate";

export default function AdminModules() {
  const { ready } = useAdminGate();
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    order: 1,
  });

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    // Update selected app when URL changes or on initial mount
    if (router.isReady && router.query.app) {
      setSelectedApp(router.query.app);
    }
  }, [router.isReady, router.query.app]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content?type=modules');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch modules');
      }
      
      // Transform modules to display format
      const transformedModules = (data.contents || []).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.data.description,
        course: item.data.course_id || item.data.courseId || 'N/A',
        sourceApp: item.sourceApp,
        sourceBackend: item.sourceBackend,
        order: item.data.order || 0,
        level: item.data.level || item.level || null,
      }));
      
      setModules(transformedModules);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppFilterChange = (e) => {
    const app = e.target.value;
    setSelectedApp(app);
    // Update URL without reload
    if (app === 'all') {
      router.push('/admin/modules', undefined, { shallow: true });
    } else {
      router.push(`/admin/modules?app=${app}`, undefined, { shallow: true });
    }
  };

  // Filter modules by selected app
  const filteredModules = selectedApp === 'all' 
    ? modules 
    : modules.filter(module => module.sourceApp === selectedApp);

  // Get unique apps for filter dropdown
  const uniqueApps = [...new Set(modules.map(m => m.sourceApp))].sort();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Module creation will be implemented when database schema is added
    alert('Module management will be fully functional once the database schema is set up.');
    setShowModal(false);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Module Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-semibold">Modules</span>
        </nav>

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
                <strong>Viewing aggregated modules:</strong> Showing modules from all sources including local filesystem and Supabase.
              </p>
            </div>
          </div>
        </div>

        {/* Content Integrity Warnings */}
        {!loading && modules.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <h3 className="text-sm font-bold text-amber-800 mb-1">⚠️ Content Integrity Checks</h3>
            <ul className="text-sm text-amber-700 list-disc ml-4 space-y-1">
              <li>
                Modules without a level (basic/intermediate/advanced): <strong>{modules.filter(m => !m.level).length}</strong>
                {' '}— assign a level via Supabase or the local content generator.
              </li>
              <li>
                Each module should have a <strong>Final Test (20 questions)</strong> at{' '}
                <code>/modules/[id]/final-test</code>. Verify via the app routes.
              </li>
              <li>
                Each lesson should have a <strong>Lesson Quiz (5 questions, pass ≥ 4/5)</strong>. Missing quizzes
                will show as empty in the lesson page.
              </li>
            </ul>
          </div>
        )}

        {/* App Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <label htmlFor="appFilter" className="text-sm font-medium text-gray-700">
              Filter by App:
            </label>
            <select
              id="appFilter"
              value={selectedApp}
              onChange={handleAppFilterChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Apps ({modules.length} modules)</option>
              {uniqueApps.map(app => (
                <option key={app} value={app}>
                  {app} ({modules.filter(m => m.sourceApp === app).length} modules)
                </option>
              ))}
            </select>
            {selectedApp !== 'all' && (
              <span className="text-sm text-gray-600">
                Showing {filteredModules.length} of {modules.length} modules
              </span>
            )}
          </div>
        </div>

        {/* Modules Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading modules...</div>
          ) : filteredModules.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {selectedApp === 'all' 
                ? "No modules found. Modules will appear here once content is aggregated from all sources."
                : `No modules found for ${selectedApp}.`}
            </div>
          ) : (
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
                    App
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredModules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {module.order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{module.title}</div>
                      {module.description && (
                        <div className="text-xs text-gray-600 mt-1">{module.description.substring(0, 60)}...</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {module.course}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {module.sourceApp}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        module.sourceBackend === 'supabase' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {module.sourceBackend}
                      </span>
                    </td>
                     <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
    </>
  );
}
