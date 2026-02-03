"use client";

import { useState } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import NewsList from '../components/NewsList';

export default function News() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);

    try {
      const response = await fetch(`/api/news/fetch?q=${encodeURIComponent(searchQuery)}&limit=9`);
      if (response.ok) {
        const data = await response.json();
        setStories(data.articles || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;

    try {
      const response = await fetch(`/api/news/fetch?q=${encodeURIComponent(searchQuery)}&limit=9&page=${nextPage}`);
      if (response.ok) {
        const data = await response.json();
        setStories(prev => [...prev, ...(data.articles || [])]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more news:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI News - Learn AI</title>
        <meta name="description" content="Latest news and updates in Artificial Intelligence" />
      </Head><main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">AI News Monitor</h1>
            <p className="text-gray-700 mb-8">
              Stay updated with the latest developments in Artificial Intelligence
            </p>

            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search AI news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="submit" className="btn-primary">
                  Search
                </button>
              </div>
            </form>

            <NewsList stories={stories} loading={loading} />

            {stories.length > 0 && !loading && (
              <div className="text-center mt-8">
                <button onClick={loadMore} className="btn-secondary">
                  Load More Articles
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
