"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';
import ModuleCard from '../components/ModuleCard';
import NewsList from '../components/NewsList';
import { getAllModules } from '../lib/curriculumGenerator';

export default function Home() {
  const [modules, setModules] = useState([]);
  const [newsStories, setNewsStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load first 3 modules for preview
    const allModules = getAllModules();
    setModules(allModules.slice(0, 3));

    // Fetch news stories
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news/fetch?limit=9');
      if (response.ok) {
        const data = await response.json();
        setNewsStories(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const marketReasons = [
    {
      title: "AI is Reshaping Every Industry",
      description: "From healthcare to finance, AI is creating unprecedented opportunities for professionals who understand its power."
    },
    {
      title: "High-Paying Career Opportunities",
      description: "AI professionals command premium salaries with growing demand across tech giants and startups alike."
    },
    {
      title: "Multiple Income Streams",
      description: "Learn to monetize AI skills through freelancing, consulting, product development, and more."
    }
  ];

  const skillOutcomes = [
    "Build and deploy AI models",
    "Understand machine learning algorithms",
    "Create AI-powered applications",
    "Monetize your AI expertise",
    "Navigate career pathways in AI"
  ];

  return (
    <>
      <Head>
        <title>Learn AI - Master Artificial Intelligence & Unlock New Earning Streams</title>
        <meta name="description" content="Future-proof your career with comprehensive AI training. Learn AI fundamentals to advanced techniques and discover multiple earning opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="gradient-bg text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Future-Proof Your Career: Master AI and Unlock New Earning Streams
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Transform your career with comprehensive AI training that takes you from fundamentals to monetization in just 3 months
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton 
                  text="Register Here" 
                  href="/register" 
                  primary={true}
                />
                <CTAButton 
                  text="No. I want to know more" 
                  href="/curriculum" 
                  primary={false}
                />
              </div>
              <p className="mt-6 text-lg">
                <strong>Special Offer:</strong> Register by paying only Rs 99 and get membership for a free period
              </p>
            </div>
          </div>
        </section>

        {/* Market Reasons Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why AI Skills Matter Now</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {marketReasons.map((reason, index) => (
                <div key={index} className="card">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-3">{reason.title}</h3>
                  <p className="text-gray-600">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skill Outcomes Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What You'll Master</h2>
            <div className="max-w-3xl mx-auto card">
              <ul className="space-y-4">
                {skillOutcomes.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Curriculum Preview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Course Curriculum</h2>
            <p className="text-center text-gray-600 mb-12">
              10 comprehensive modules with 100 lessons covering everything from basics to advanced AI
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} preview={true} />
              ))}
            </div>
            <div className="text-center mt-8">
              <CTAButton text="View Full Curriculum" href="/curriculum" />
            </div>
          </div>
        </section>

        {/* News Monitor Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">AI News Monitor</h2>
            <NewsList stories={newsStories} loading={loading} />
          </div>
        </section>

        {/* Promise Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center card">
              <h2 className="text-3xl font-bold mb-6">Our Promise to You</h2>
              <p className="text-lg text-gray-700 mb-6">
                At the end of three months or shorter, you will receive a certificate of completion. 
                Before that, you'll take a comprehensive test that takes hardly more than 10 minutes.
              </p>
              <p className="text-xl font-semibold text-primary">
                Pass the test, earn your certificate, and open doors to new opportunities.
              </p>
              <div className="mt-8">
                <CTAButton text="Start Your Journey" href="/register" primary={true} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
