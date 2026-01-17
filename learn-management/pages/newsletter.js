import Head from "next/head";
import { useRef, useState } from "react";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import newsletters from "../data/newsletters.json";

export default function NewsletterPage() {
  const formRef = useRef(null);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Sort newsletters by date (newest first)
  const sortedNewsletters = [...newsletters].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleViewPDF = (newsletter) => {
    setSelectedNewsletter(newsletter);
  };

  const handleClosePDF = () => {
    setSelectedNewsletter(null);
  };

  const handleDownloadPDF = (newsletter) => {
    const link = document.createElement("a");
    link.href = `/newsletters/${newsletter.filename}`;
    link.download = newsletter.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              Stay informed about new courses and important updates—no unnecessary emails, just what
              matters to your learning journey.
            </p>

            {/* Policy Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 text-left max-w-2xl mx-auto rounded">
              <p className="text-sm text-blue-900 font-semibold">📬 Our Newsletter Policy:</p>
              <p className="text-sm text-blue-800 mt-2">
                The Skilling Newsletter will be sent <strong>ONLY</strong> when new courses are
                introduced, or important announcements/changes are made. You will{" "}
                <strong>NOT</strong> receive unnecessary or frequent emails.
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

          {/* Newsletter Archive Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              📚 Newsletter Archive
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Browse and download past editions of The Skilling Newsletter
            </p>

            {sortedNewsletters.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  No newsletters available yet. Subscribe to be notified when we publish our first
                  issue!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {sortedNewsletters.map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{newsletter.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{newsletter.description}</p>
                        <p className="text-gray-500 text-xs">
                          Published:{" "}
                          {new Date(newsletter.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleViewPDF(newsletter)}
                          className="bg-primary hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(newsletter)}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">📬 What to Expect</h3>
            <p className="text-gray-600 text-sm mb-4">
              We respect your inbox! You'll only receive emails when there's something truly
              important to share. You can easily unsubscribe at any time with one click.
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

        {/* PDF Viewer Modal */}
        {selectedNewsletter && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-bold text-gray-800">{selectedNewsletter.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownloadPDF(selectedNewsletter)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition flex items-center gap-2"
                    title="Download PDF"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={handleClosePDF}
                    className="text-gray-500 hover:text-gray-700 transition p-2"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`/newsletters/${selectedNewsletter.filename}`}
                  className="w-full h-full border-0"
                  title={selectedNewsletter.title}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
