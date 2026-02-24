import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

/**
 * Newsletter Archive Page
 * 
 * Browse all past "Skilling" newsletter editions
 * Visually appealing cards/tiles for each newsletter
 */

export default function NewsletterArchive({ newsletters, error }) {
  return (
    <>
      <Head>
        <title>Skilling Newsletter Archive - iiskills.cloud</title>
        <meta name="description" content="Browse past editions of Skilling, the AI-powered newsletter highlighting new courses on iiskills.cloud" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold mb-4">
              Skilling Newsletter 🚀
            </h1>
            <p className="text-xl opacity-90 mb-2">
              by iiskills.cloud
            </p>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Your weekly dose of awesome new courses, delivered with energy and excitement!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">⚠️ {error}</p>
            </div>
          ) : newsletters.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📬 No newsletters yet!
              </h2>
              <p className="text-gray-600 mb-6">
                We'll send out our first Skilling newsletter when we publish a new course.
              </p>
              <Link href="/newsletter">
                <a className="inline-block bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
                  Subscribe to get notified! 📧
                </a>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Past Editions
                </h2>
                <p className="text-gray-600">
                  {newsletters.length} newsletter{newsletters.length !== 1 ? 's' : ''} sent
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsletters.map((newsletter) => (
                  <NewsletterCard key={newsletter.id} newsletter={newsletter} />
                ))}
              </div>
            </>
          )}

          {/* Subscribe CTA */}
          {newsletters.length > 0 && (
            <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">
                Don't miss the next one! 📬
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Subscribe to Skilling and get notified when we launch new courses
              </p>
              <Link href="/newsletter">
                <a className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
                  Subscribe Now 🚀
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * Newsletter Card Component
 */
function NewsletterCard({ newsletter }) {
  const formattedDate = new Date(newsletter.sent_at || newsletter.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Link href={`/newsletter/view/${newsletter.id}`}>
      <a className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
          <div className="text-sm font-semibold mb-2 opacity-90">
            Edition #{newsletter.edition_number}
          </div>
          <h3 className="text-xl font-bold leading-tight">
            {newsletter.title}
          </h3>
        </div>

        {/* Content Preview */}
        <div className="p-6">
          {/* Emoji Block */}
          {newsletter.emoji_block && (
            <div className="text-3xl mb-4 text-center">
              {newsletter.emoji_block}
            </div>
          )}

          {/* Intro */}
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {newsletter.intro_text}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
            <span>📅 {formattedDate}</span>
            {newsletter.sent_count > 0 && (
              <span>📧 Sent to {newsletter.sent_count}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <span className="text-purple-600 font-semibold text-sm hover:underline">
            Read Full Newsletter →
          </span>
        </div>
      </a>
    </Link>
  );
}

/**
 * Server-side data fetching
 */
export async function getServerSideProps() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('newsletter_editions')
      .select('*')
      .eq('status', 'sent')
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching newsletters:', error);
      return {
        props: {
          newsletters: [],
          error: 'Failed to load newsletters. Please try again later.'
        }
      };
    }

    return {
      props: {
        newsletters: data || [],
        error: null
      }
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      props: {
        newsletters: [],
        error: 'An unexpected error occurred.'
      }
    };
  }
}
