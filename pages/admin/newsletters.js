import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

/**
 * Admin Newsletter Dashboard
 * 
 * View, preview, and manage newsletters
 * Manually trigger generation and sending
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminNewsletters() {
  const router = useRouter();
  const [newsletters, setNewsletters] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    
    // Load newsletters
    const { data: newsletterData } = await supabase
      .from('newsletter_editions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    setNewsletters(newsletterData || []);

    // Load queue
    const { data: queueData } = await supabase
      .from('newsletter_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    setQueue(queueData || []);
    
    setLoading(false);
  }

  async function processQueue() {
    setProcessing(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter/process-queue', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `✅ Processed ${data.processed} task(s)`
        });
        loadData(); // Reload data
      } else {
        setMessage({
          type: 'error',
          text: `❌ Error: ${data.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Failed to process queue: ${error.message}`
      });
    }

    setProcessing(false);
  }

  async function resendNewsletter(newsletterId) {
    if (!confirm('Are you sure you want to resend this newsletter to all subscribers?')) {
      return;
    }

    try {
      // Queue a resend task
      const { error } = await supabase
        .from('newsletter_queue')
        .insert([{
          newsletter_id: newsletterId,
          task_type: 'resend',
          status: 'pending'
        }]);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: '✅ Newsletter queued for resending'
      });
      
      loadData();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ Error: ${error.message}`
      });
    }
  }

  return (
    <>
      <Head>
        <title>Newsletter Management - Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📧 Newsletter Management
            </h1>
            <p className="text-gray-600">
              View, preview, and manage Skilling newsletters
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Queue Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                ⚡ Queue Status
              </h2>
              <button
                onClick={processQueue}
                disabled={processing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? '⏳ Processing...' : '▶️ Process Queue'}
              </button>
            </div>

            {queue.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks in queue</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Task Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Attempts</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((task) => (
                      <tr key={task.id} className="border-t">
                        <td className="px-4 py-3 text-sm">{task.task_type}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'failed' ? 'bg-red-100 text-red-800' :
                            task.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{task.attempts} / {task.max_attempts}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(task.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Newsletters List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📰 Recent Newsletters
            </h2>

            {loading ? (
              <p className="text-center py-8 text-gray-500">Loading...</p>
            ) : newsletters.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No newsletters yet</p>
            ) : (
              <div className="space-y-4">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-purple-600">
                            #{newsletter.edition_number}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            newsletter.status === 'sent' ? 'bg-green-100 text-green-800' :
                            newsletter.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {newsletter.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-1">
                          {newsletter.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {newsletter.intro_text?.substring(0, 150)}...
                        </p>
                        <div className="text-xs text-gray-500">
                          {newsletter.sent_at ? (
                            <span>📧 Sent: {new Date(newsletter.sent_at).toLocaleString()} • {newsletter.sent_count} recipients</span>
                          ) : (
                            <span>Created: {new Date(newsletter.created_at).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/newsletter/view/${newsletter.id}`}>
                          <a className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                            👁️ Preview
                          </a>
                        </Link>
                        {newsletter.status === 'sent' && (
                          <button
                            onClick={() => resendNewsletter(newsletter.id)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            🔄 Resend
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
