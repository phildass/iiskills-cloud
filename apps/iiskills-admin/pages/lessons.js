import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function AdminLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      
      // Fetch from API endpoint
      const response = await fetch('/api/lessons');
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      setLessons(result.data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Manage Lessons - Admin Dashboard (LOCAL MODE)</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
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

            {/* Lessons Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading lessons...</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No lessons found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                          <div className="text-sm text-gray-500">{lesson.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.module_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.type || 'content'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lesson.order_index}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
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
