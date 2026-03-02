import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { SUBDOMAIN_OPTIONS } from "../../lib/siteConfig";
import { getCoursePreviewUrl } from "../../lib/navigation";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

export default function AdminCourses() {
  const { ready, denied } = useAdminProtectedPage();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filterSubdomain, setFilterSubdomain] = useState('all');
  const fetchIdRef = useRef(0);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    duration: '',
    category: '',
    subdomain: 'main',
    price: 0,
    is_free: true,
    status: 'draft',
  });

  // Get site filter from URL query params
  useEffect(() => {
    if (router.query.site && router.query.site !== 'all') {
      setFilterSubdomain(router.query.site);
    }
  }, [router.query.site]);

  const subdomains = SUBDOMAIN_OPTIONS;

  useEffect(() => {
    fetchCourses();
  }, [filterSubdomain]);

  const fetchCourses = async () => {
    const fetchId = ++fetchIdRef.current;
    try {
      setLoading(true);
      
      // Fetch courses from the aggregated content API
      const response = await fetch('/api/admin/content?type=courses');
      
      // Ignore result if a newer fetch has already started
      if (fetchId !== fetchIdRef.current) return;
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch courses');
      }
      
      let allCourses = data.contents || [];
      
      // Transform to match expected structure and add source info
      allCourses = allCourses.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.data.slug || item.id,
        short_description: item.data.short_description || item.data.description,
        full_description: item.data.full_description,
        duration: item.data.duration,
        category: item.data.category,
        subdomain: item.sourceApp || item.data.subdomain || 'unknown',
        price: item.data.price || 0,
        is_free: item.data.is_free !== false,
        status: item.data.status || 'published',
        source: item.source,
        sourceApp: item.sourceApp,
        sourceBackend: item.sourceBackend,
        created_at: item.data.created_at || item.data.createdAt,
        updated_at: item.data.updated_at || item.data.updatedAt,
      }));
      
      // Filter by subdomain if needed
      if (filterSubdomain !== 'all') {
        allCourses = allCourses.filter(c => c.subdomain === filterSubdomain);
      }
      
      setCourses(allCourses);
    } catch (error) {
      if (fetchId !== fetchIdRef.current) return;
      console.error('Error fetching courses:', error);
      alert('Error loading courses. Check console for details.');
    } finally {
      if (fetchId === fetchIdRef.current) setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        // Update existing course via admin API (uses service role)
        const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update course');
        alert('Course updated successfully!');
      } else {
        // Create new course via admin API (uses service role)
        const res = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create course');
        alert('Course created successfully!');
      }
      
      setShowModal(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      slug: course.slug,
      short_description: course.short_description || '',
      full_description: course.full_description || '',
      duration: course.duration || '',
      category: course.category || '',
      subdomain: course.subdomain || 'main',
      price: course.price || 0,
      is_free: course.is_free,
      status: course.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete course');
      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      duration: '',
      category: '',
      subdomain: 'main',
      price: 0,
      is_free: true,
      status: 'draft',
    });
  };

  const handleNewCourse = () => {
    resetForm();
    setEditingCourse(null);
    setShowModal(true);
  };

  if (denied) return <AccessDenied />;

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
        <title>Course Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-semibold">Courses</span>
        </nav>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Course Management</h1>
            <p className="text-gray-600 mt-2">Manage courses across all iiskills sites</p>
          </div>
          <button
            onClick={handleNewCourse}
            className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            + Add New Course
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 flex items-center space-x-4">
          <label className="font-semibold text-gray-700">Filter by Site:</label>
          <select
            value={filterSubdomain}
            onChange={(e) => setFilterSubdomain(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {subdomains.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            ({courses.length} course{courses.length !== 1 ? 's' : ''} found)
          </span>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No courses found. Click "Add New Course" to create one.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.slug}</div>
                      {course.short_description && (
                        <div className="text-xs text-gray-600 mt-1">{course.short_description.substring(0, 60)}...</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {course.subdomain || 'main'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        course.sourceBackend === 'supabase' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {course.sourceBackend || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {course.category || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        course.status === 'published' ? 'bg-green-100 text-green-800' :
                        course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {course.is_free ? 'Free' : `₹${course.price}`}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                      <a
                        href={getCoursePreviewUrl(course.subdomain || 'main', course.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => handleDelete(course.id, course.title)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL-friendly) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., ai-fundamentals"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site *
                  </label>
                  <select
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {subdomains.filter(s => s.value !== 'all').map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows="2"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea
                    rows="4"
                    value={formData.full_description}
                    onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 4 weeks"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      disabled={formData.is_free}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_free" className="text-sm font-medium text-gray-700">
                    Free Course
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded font-medium hover:bg-blue-700 transition"
                  >
                    {editingCourse ? 'Update Course' : 'Create Course'}
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
