"use client";

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../components/Footer';

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    learningPath: '',
    hasExperience: false,
    goals: ''
  });
  const [loading, setLoading] = useState(false);

  const learningPaths = [
    {
      id: 'beginner',
      title: 'Complete Beginner',
      description: 'Start from scratch with AI fundamentals',
      requiresTest: false
    },
    {
      id: 'intermediate',
      title: 'Some Programming Experience',
      description: 'You know basics, ready for AI concepts',
      requiresTest: true
    },
    {
      id: 'advanced',
      title: 'Technical Background',
      description: 'Fast-track through advanced topics',
      requiresTest: true
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If path 2 or 3, check for required test
      if (formData.learningPath !== 'beginner' && !formData.hasExperience) {
        alert('A quick assessment is required for this learning path.');
        // In production, redirect to assessment
        setLoading(false);
        return;
      }

      // Save onboarding data
      const response = await fetch('/api/users/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        router.push('/curriculum');
      } else {
        alert('Error saving profile. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <>
      <Head>
        <title>Welcome - Learn AI</title>
        <meta name="description" content="Complete your profile to get started" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="card">
            <h1 className="text-3xl font-bold mb-6">Welcome to Learn AI!</h1>
            <p className="text-gray-700 mb-8">
              Let's personalize your learning experience. This will take less than 2 minutes.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-4">Choose Your Learning Path</label>
                <div className="space-y-4">
                  {learningPaths.map(path => (
                    <label key={path.id} className="flex items-start p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                      <input
                        type="radio"
                        name="learningPath"
                        value={path.id}
                        checked={formData.learningPath === path.id}
                        onChange={handleChange}
                        className="mt-1 mr-4"
                        required
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{path.title}</div>
                        <div className="text-sm text-gray-600">{path.description}</div>
                        {path.requiresTest && (
                          <div className="text-xs text-blue-600 mt-1">
                            * Quick assessment required
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">What are your goals? (Optional)</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us what you hope to achieve with this course..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Start Learning'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
