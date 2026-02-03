"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../components/Footer';
import { getCurrentUser } from '../../lib/supabaseClient';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('modules');
  const [modules, setModules] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      setUser({ email: 'admin@example.com' });
      loadData();
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/register');
      return;
    }

    // In production, check if user is admin
    setUser(currentUser);
    loadData();
  };

  const loadData = async () => {
    try {
      // Load mock data - in production, fetch from Supabase
      const { getAllModules } = await import('../../lib/curriculumGenerator');
      setModules(getAllModules());
      
      setRegistrations([
        { id: 1, email: 'user1@example.com', date: '2024-01-15', status: 'active' },
        { id: 2, email: 'user2@example.com', date: '2024-01-20', status: 'active' },
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin panel...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Learn AI</title>
        <meta name="description" content="Learn AI Admin Dashboard" />
      </Head>

      

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="mb-6">
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'modules'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Modules & Lessons
              </button>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'registrations'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Registrations
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'certificates'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Certificates
              </button>
            </div>
          </div>

          {activeTab === 'modules' && (
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">Course Modules</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Difficulty</th>
                      <th className="text-left py-3 px-4">Lessons</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map(module => (
                      <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{module.id}</td>
                        <td className="py-3 px-4">{module.title}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            module.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {module.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-4">10</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                          <button className="text-red-600 hover:text-red-800">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'registrations' && (
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">User Registrations</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">ID</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Registration Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(reg => (
                      <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{reg.id}</td>
                        <td className="py-3 px-4">{reg.email}</td>
                        <td className="py-3 px-4">{reg.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 mr-4">View</button>
                          <button className="text-red-600 hover:text-red-800">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">Issued Certificates</h2>
              <p className="text-gray-600">
                Certificates will appear here when students complete the course and pass the final exam.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
