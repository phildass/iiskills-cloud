import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { handleUnsubscribe } from '../../lib/email-sender';

/**
 * Newsletter Unsubscribe Page
 */

export default function Unsubscribe() {
  const router = useRouter();
  const { email } = router.query;
  const [status, setStatus] = useState('pending'); // pending, processing, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (email && status === 'pending') {
      processUnsubscribe();
    }
  }, [email]);

  async function processUnsubscribe() {
    setStatus('processing');

    try {
      const result = await handleUnsubscribe(email);

      if (result.success) {
        setStatus('success');
        setMessage('You have been successfully unsubscribed from the Skilling newsletter.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to unsubscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  }

  return (
    <>
      <Head>
        <title>Unsubscribe - Skilling Newsletter</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {status === 'processing' && (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Processing...
              </h1>
              <p className="text-gray-600">
                Please wait while we unsubscribe you.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Unsubscribed Successfully
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <p className="text-gray-600 mb-6">
                We're sorry to see you go! You will no longer receive Skilling newsletters.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Changed your mind?
                </p>
                <Link href="/newsletter">
                  <a className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition">
                    Re-subscribe to Skilling
                  </a>
                </Link>
                <div className="pt-4">
                  <Link href="/">
                    <a className="text-gray-600 hover:text-gray-800">
                      Return to Homepage
                    </a>
                  </Link>
                </div>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Something Went Wrong
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={processUnsubscribe}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition"
                >
                  Try Again
                </button>
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Need help?
                  </p>
                  <a
                    href="mailto:info@iiskills.cloud"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </>
          )}

          {status === 'pending' && !email && (
            <>
              <div className="text-6xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Unsubscribe from Skilling
              </h1>
              <p className="text-gray-600 mb-6">
                This page is accessed via the unsubscribe link in newsletter emails.
              </p>
              <Link href="/newsletter">
                <a className="text-purple-600 hover:text-purple-700 font-semibold">
                  View Newsletter Page
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
