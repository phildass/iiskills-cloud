"use client"; // This page uses React hooks (useRef) for DOM manipulation - must run on client side

import Head from "next/head";
import { useRef } from "react";
import NewsletterSignup from "../components/shared/NewsletterSignup";

export default function NewsletterPage() {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <Head>
        <title>The Skilling Newsletter - iiskills.cloud</title>
        <meta
          name="description"
          content="Subscribe to The Skilling Newsletter for updates on new courses and important announcements. No spam, only what matters."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-neutral to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">📧 The Skilling Newsletter</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Stay informed about new courses and important updates—no unnecessary emails, just what matters to your learning journey.
            </p>
            
            {/* Policy Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-left max-w-2xl mx-auto rounded">
              <p className="text-sm text-blue-900 font-semibold">
                📬 Our Newsletter Policy:
              </p>
              <p className="text-sm text-blue-800 mt-2">
                The Skilling Newsletter will be sent <strong>ONLY</strong> when new courses are introduced, or important announcements/changes are made. You will <strong>NOT</strong> receive unnecessary or frequent emails.
              </p>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={scrollToForm}
              className="bg-primary hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              Subscribe Now →
            </button>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-lg mb-2">New Course Announcements</h3>
              <p className="text-gray-600 text-sm">
                Be the first to know when new learning opportunities become available
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">📢</div>
              <h3 className="font-bold text-lg mb-2">Important Updates</h3>
              <p className="text-gray-600 text-sm">
                Stay informed about platform changes and critical announcements
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-lg mb-2">Exclusive Access</h3>
              <p className="text-gray-600 text-sm">
                Early access to new courses and special opportunities for subscribers
              </p>
            </div>
          </div>

          {/* Newsletter Signup Form */}
          <div ref={formRef} className="mb-12">
            <NewsletterSignup mode="embedded" />
          </div>

          {/* Additional Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">📬 What to Expect</h3>
            <p className="text-gray-600 text-sm mb-4">
              We respect your inbox! You'll only receive emails when there's something truly important to share. 
              You can easily unsubscribe at any time with one click.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No Spam
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Only Important Updates
              </span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                One-Click Unsubscribe
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
