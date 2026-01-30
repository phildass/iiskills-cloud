import Head from "next/head";
import { useRef } from "react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

export default function NewsletterPage() {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <Head>
        <title>Cricket Newsletter - Cricket Know-All</title>
        <meta
          name="description"
          content="Subscribe to the Cricket Know-All Newsletter for updates on new cricket lessons and important announcements."
        />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-neutral to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">🏏 Cricket Newsletter</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Stay informed about new cricket lessons, match analysis, and important updates—delivered right to your inbox.
            </p>
            
            {/* Policy Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-left max-w-2xl mx-auto rounded">
              <p className="text-sm text-blue-900 font-semibold">
                📬 Our Newsletter Policy:
              </p>
              <p className="text-sm text-blue-800 mt-2">
                The Cricket Newsletter will be sent <strong>ONLY</strong> when new lessons are introduced, or important announcements/changes are made. You will <strong>NOT</strong> receive unnecessary or frequent emails.
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
              <div className="text-4xl mb-3">🏏</div>
              <h3 className="font-bold text-lg mb-2">New Cricket Lessons</h3>
              <p className="text-gray-600 text-sm">
                Be the first to know when new cricket lessons and modules become available
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-2">Match Analysis</h3>
              <p className="text-gray-600 text-sm">
                Get insights on major cricket matches and strategic analysis
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-lg mb-2">Exclusive Updates</h3>
              <p className="text-gray-600 text-sm">
                Early access to new content and special opportunities for subscribers
              </p>
            </div>
          </div>

          {/* Newsletter Signup Form */}
          <div ref={formRef} className="mb-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Subscribe to Updates</h2>
              <p className="text-gray-600 text-center mb-6">
                Enter your email below to receive cricket news and lesson updates
              </p>
              <form className="max-w-md mx-auto">
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              More cricket content and features are being added regularly. Subscribe to stay updated!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
