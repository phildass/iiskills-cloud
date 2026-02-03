"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Mock jobs data - in production, fetch from JOBS_FEED_URL
      const mockJobs = [
        {
          id: 1,
          title: 'AI/ML Engineer',
          company: 'Tech Corp India',
          location: 'Bangalore, India',
          salary: '₹15-25 LPA',
          type: 'Full-time',
          description: 'Looking for AI/ML engineer with 2+ years experience',
          posted: '2 days ago'
        },
        {
          id: 2,
          title: 'Data Scientist',
          company: 'Analytics Solutions',
          location: 'Mumbai, India',
          salary: '₹12-20 LPA',
          type: 'Full-time',
          description: 'Data scientist role focusing on predictive analytics',
          posted: '5 days ago'
        },
        {
          id: 3,
          title: 'AI Research Intern',
          company: 'Innovation Labs',
          location: 'Hyderabad, India',
          salary: '₹30k-50k/month',
          type: 'Internship',
          description: 'Research internship in computer vision and NLP',
          posted: '1 week ago'
        }
      ];

      setJobs(mockJobs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(filter.toLowerCase()) ||
    job.company.toLowerCase().includes(filter.toLowerCase()) ||
    job.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>AI Jobs in India - Learn AI</title>
        <meta name="description" content="Explore AI and ML job opportunities in India" />
      </Head><main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">AI Jobs in India</h1>
            <p className="text-gray-700 mb-8">
              Discover exciting career opportunities in Artificial Intelligence and Machine Learning
            </p>

            <div className="mb-8">
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-gray-600">No jobs found matching your search.</p>
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <div key={job.id} className="card hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
                          <div className="text-gray-600 space-y-1">
                            <p className="font-semibold">{job.company}</p>
                            <p>📍 {job.location}</p>
                            <p>💰 {job.salary}</p>
                          </div>
                        </div>
                        <div>
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{job.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Posted {job.posted}</span>
                        <button className="btn-primary">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="mt-12 card bg-blue-50">
              <h3 className="text-xl font-semibold mb-4">Not finding the right job?</h3>
              <p className="text-gray-700 mb-4">
                Complete our AI course to build the skills employers are looking for. Many of our graduates land their dream jobs within weeks of completion.
              </p>
              <button
                onClick={() => window.location.href = '/curriculum'}
                className="btn-primary"
              >
                View Course Curriculum
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
