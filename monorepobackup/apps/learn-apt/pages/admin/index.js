"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { getCurrentUser } from '../../lib/supabaseClient';
import { COGNITIVE_DOMAINS, QUESTION_BANK } from '../../lib/questionBank';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('tests');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const testSections = [
    { id: 'numerical', title: COGNITIVE_DOMAINS.NUMERICAL, questionCount: (QUESTION_BANK.numerical || []).length },
    { id: 'logical', title: COGNITIVE_DOMAINS.LOGICAL, questionCount: (QUESTION_BANK.logical || []).length },
    { id: 'verbal', title: COGNITIVE_DOMAINS.VERBAL, questionCount: (QUESTION_BANK.verbal || []).length },
    { id: 'spatial', title: COGNITIVE_DOMAINS.SPATIAL, questionCount: (QUESTION_BANK.spatial || []).length },
    { id: 'dataInterpretation', title: COGNITIVE_DOMAINS.DATA_INTERPRETATION, questionCount: (QUESTION_BANK.dataInterpretation || []).length },
  ];

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
      router.push('/');
      return;
    }

    setUser(currentUser);
    loadData();
  };

  const loadData = async () => {
    try {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Learn APT</title>
        <meta name="description" content="Learn APT Admin Dashboard" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="mb-6">
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'tests'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Test Sections
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
            </div>
          </div>

          {activeTab === 'tests' && (
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">Aptitude Test Sections</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Section</th>
                      <th className="text-left py-3 px-4">Questions</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testSections.map(section => (
                      <tr key={section.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{section.title}</td>
                        <td className="py-3 px-4">{section.questionCount}</td>
                        <td className="py-3 px-4">
                          <Link href="/test/diagnostic" className="text-green-600 hover:text-green-800 mr-4">Preview</Link>
                          <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
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
        </div>
      </main>
    </>
  );
}
