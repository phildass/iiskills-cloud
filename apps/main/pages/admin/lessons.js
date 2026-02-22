import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminGate } from "../../components/AdminGate";

export default function AdminLessons() {
  const { ready } = useAdminGate();
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    moduleId: '',
    order: 1,
    duration: '',
  });

  useEffect(() => {
    fetchLessons();
  }, []);

  useEffect(() => {
    // Update selected app when URL changes or on initial mount
    if (router.isReady && router.query.app) {
      setSelectedApp(router.query.app);
    }
  }, [router.isReady, router.query.app]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content?type=lessons');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch lessons');
      }
      
      // Transform lessons to display format
      const transformedLessons = (data.contents || []).map((item) => ({
        id: item.id,
        title: item.title,
        module: item.data.module_id || item.data.moduleId || item.data.moduleName || 'N/A',
        duration: item.data.duration || 'N/A',
        sourceApp: item.sourceApp,
        sourceBackend: item.sourceBackend,
        order: item.data.order || 0,
      }));
      
      setLessons(transformedLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAppFilterChange = (e) => {
    const app = e.target.value;
    setSelectedApp(app);
    // Update URL without reload
    if (app === 'all') {
      router.push('/admin/lessons', undefined, { shallow: true });
    } else {
      router.push(`/admin/lessons?app=${app}`, undefined, { shallow: true });
    }
  };

  // Filter lessons by selected app
  const filteredLessons = selectedApp === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.sourceApp === selectedApp);

  // Get unique apps for filter dropdown
  const uniqueApps = [...new Set(lessons.map(l => l.sourceApp))].sort();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lesson creation will be implemented when database schema is added
    alert('Lesson management will be fully functional once the database schema is set up.');
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
        <title>Lesson Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-semibold">Lessons</span>
        </nav>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Lesson Management</h1>
            <p className="text-gray-600 mt-2">Create and manage lesson content</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            + Add New Lesson
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
                <strong>Viewing aggregated lessons:</strong> Showing lessons from all sources including local filesystem and Supabase.
              </p>
            </div>
          </div>
        </div>

        {/* App Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <label htmlFor="appFilter" className="text-sm font-medium text-gray-700">
              Filter by App:
            </label>
            <select
              id="appFilter"
              value={selectedApp}
              onChange={handleAppFilterChange}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Apps ({lessons.length} lessons)</option>
              {uniqueApps.map(app => (
                <option key={app} value={app}>
                  {app} ({lessons.filter(l => l.sourceApp === app).length} lessons)
                </option>
              ))}
            </select>
            {selectedApp !== 'all' && (
              <span className="text-sm text-gray-600">
                Showing {filteredLessons.length} of {lessons.length} lessons
              </span>
            )}
          </div>
        </div>

        {/* Lessons Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading lessons...</div>
          ) : filteredLessons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {selectedApp === 'all' 
                ? "No lessons found. Lessons will appear here once content is aggregated from all sources."
                : `No lessons found for ${selectedApp}.`}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    App
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {lesson.order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {lesson.module}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {lesson.sourceApp}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        lesson.sourceBackend === 'supabase' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lesson.sourceBackend}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {lesson.duration}
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
                <h3 className="font-semibold text-gray-800">Rich Text Editor</h3>
                <p className="text-sm text-gray-600">Create lesson content with formatting, images, and videos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Lesson Ordering</h3>
                <p className="text-sm text-gray-600">Arrange lessons in logical progression within modules</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Duration Tracking</h3>
                <p className="text-sm text-gray-600">Set estimated completion time for each lesson</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Content Preview</h3>
                <p className="text-sm text-gray-600">Preview lessons before publishing</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Media Management</h3>
                <p className="text-sm text-gray-600">Upload and manage images, videos, and documents</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-green-500 text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-800">Draft/Publish Workflow</h3>
                <p className="text-sm text-gray-600">Save drafts and publish when ready</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Lesson</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Understanding Neural Networks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module *
                  </label>
                  <select
                    required
                    value={formData.moduleId}
                    onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a module...</option>
                    <option value="1">Sample Module (Placeholder)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Content
                  </label>
                  <textarea
                    rows="8"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    placeholder="Lesson content (Rich text editor will be available in production)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rich text editor with formatting, images, and videos will be available in the full implementation
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., 15 minutes"
                    />
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
                  </div>
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
                    Create Lesson
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
