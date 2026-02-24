import { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin Courses Management
 * 
 * Add, edit, and publish courses
 * Publishing automatically triggers newsletter generation
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminCoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    setCourses(data || []);
    setLoading(false);
  }

  function handleEdit(course) {
    setEditingCourse(course);
    setShowForm(true);
  }

  function handleNew() {
    setEditingCourse(null);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Course deleted' });
        loadCourses();
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: `❌ ${data.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    }
  }

  return (
    <>
      <Head>
        <title>Course Management - Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                📚 Course Management
              </h1>
              <p className="text-gray-600">
                Add and publish courses • Auto-generates Skilling newsletter
              </p>
            </div>
            <button
              onClick={handleNew}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              ➕ Add New Course
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Course Form Modal */}
          {showForm && (
            <CourseForm
              course={editingCourse}
              onClose={() => {
                setShowForm(false);
                setEditingCourse(null);
              }}
              onSuccess={(msg) => {
                setMessage({ type: 'success', text: msg });
                setShowForm(false);
                setEditingCourse(null);
                loadCourses();
              }}
              onError={(msg) => {
                setMessage({ type: 'error', text: msg });
              }}
            />
          )}

          {/* Courses List */}
          <div className="bg-white rounded-lg shadow-sm">
            {loading ? (
              <p className="text-center py-8 text-gray-500">Loading...</p>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No courses yet</p>
                <button
                  onClick={handleNew}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Add your first course →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Created</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-800">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            course.status === 'published' ? 'bg-green-100 text-green-800' :
                            course.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {course.category || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(course.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="text-red-600 hover:text-red-700 font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Course Form Component
 */
function CourseForm({ course, onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    slug: course?.slug || '',
    short_description: course?.short_description || '',
    full_description: course?.full_description || '',
    highlights: course?.highlights?.join('\n') || '',
    duration: course?.duration || '',
    category: course?.category || '',
    target_audience: course?.target_audience || '',
    topics_skills: course?.topics_skills?.join('\n') || '',
    price: course?.price || 0,
    is_free: course?.is_free || false,
    subdomain: course?.subdomain || '',
    status: course?.status || 'draft',
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      // Prepare data
      const data = {
        ...formData,
        highlights: formData.highlights.split('\n').filter(h => h.trim()),
        topics_skills: formData.topics_skills.split('\n').filter(t => t.trim()),
        price: parseFloat(formData.price) || 0,
      };

      const url = course?.id ? `/api/courses?id=${course.id}` : '/api/courses';
      const method = course?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess(result.message);
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError(error.message);
    }

    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Master Python for Data Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Data Science"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published (triggers newsletter!)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Brief 1-2 sentence description"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Highlights (one per line)
              </label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
                placeholder="Learn Python basics&#10;Build real projects&#10;Get certified"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., 4 weeks, 30 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Beginners, Professionals"
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
          </button>
        </div>
      </div>
    </div>
  );
}
