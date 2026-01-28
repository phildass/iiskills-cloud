import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubdomain, setFilterSubdomain] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [filterSubdomain]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch from API endpoint
      const url = filterSubdomain === 'all'
        ? '/api/courses'
        : `/api/courses?subdomain=${filterSubdomain}`;
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      setCourses(result.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Manage Courses - Admin Dashboard (LOCAL MODE)</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Viewing local content from seeds/content.json
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Site
              </label>
              <select
                id="subdomain"
                value={filterSubdomain}
                onChange={(e) => setFilterSubdomain(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Sites</option>
                <option value="main">Main</option>
                <option value="learn-ai">Learn AI</option>
                <option value="learn-jee">Learn JEE</option>
                <option value="learn-neet">Learn NEET</option>
              </select>
            </div>

            {/* Courses Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading courses...</p>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No courses found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subdomain
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.subdomain || 'main'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.category || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.status || 'draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.is_free ? 'Free' : `$${course.price || 0}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
