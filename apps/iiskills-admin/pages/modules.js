import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function AdminModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      
      // Fetch from API endpoint
      const response = await fetch('/api/modules');
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      setModules(result.data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Manage Modules - Admin Dashboard (LOCAL MODE)</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
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

            {/* Modules Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading modules...</p>
                </div>
              ) : modules.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No modules found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
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
                    {modules.map((module) => (
                      <tr key={module.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{module.title}</div>
                          <div className="text-sm text-gray-500">{module.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {module.course_id || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {module.order_index}
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
