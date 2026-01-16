import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

/**
 * Individual Newsletter View Page
 * 
 * Display a single newsletter edition in full
 */

export default function ViewNewsletter({ newsletter, error }) {
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/newsletter/archive">
            <a className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
              ← Back to Archive
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{newsletter.title} - Skilling Newsletter</title>
        <meta name="description" content={newsletter.intro_text} />
        <meta property="og:title" content={newsletter.title} />
        <meta property="og:description" content={newsletter.intro_text} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/newsletter/archive">
              <a className="text-purple-600 hover:text-purple-700 font-semibold">
                ← All Newsletters
              </a>
            </Link>
            <div className="flex gap-4">
              <Link href="/newsletter">
                <a className="text-gray-600 hover:text-gray-800">
                  Subscribe
                </a>
              </Link>
              <button
                onClick={() => window.print()}
                className="text-gray-600 hover:text-gray-800"
              >
                🖨️ Print
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Edition Badge */}
          <div className="text-center mb-6">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              Edition #{newsletter.edition_number}
            </span>
          </div>

          {/* Render HTML Content */}
          <div 
            className="newsletter-content bg-white rounded-lg shadow-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: newsletter.web_content || newsletter.html_content }}
          />

          {/* Share & Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Share this newsletter 📤
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  alert('Link copied to clipboard! 📋');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold transition"
              >
                📋 Copy Link
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(newsletter.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-semibold transition"
              >
                🐦 Share on Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition"
              >
                💼 Share on LinkedIn
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/newsletter">
              <a className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition">
                Subscribe to Skilling Newsletter 🚀
              </a>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .newsletter-content {
          /* Ensure content renders well */
        }
        
        @media print {
          .newsletter-content {
            box-shadow: none;
          }
        }
      `}</style>
    </>
  );
}

/**
 * Server-side data fetching
 */
export async function getServerSideProps({ params }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('newsletter_editions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return {
        props: {
          newsletter: null,
          error: 'Newsletter not found'
        }
      };
    }

    // Only show sent newsletters to public
    if (data.status !== 'sent') {
      return {
        props: {
          newsletter: null,
          error: 'This newsletter has not been published yet'
        }
      };
    }

    return {
      props: {
        newsletter: data,
        error: null
      }
    };

  } catch (error) {
    console.error('Server error:', error);
    return {
      props: {
        newsletter: null,
        error: 'An unexpected error occurred'
      }
    };
  }
}
