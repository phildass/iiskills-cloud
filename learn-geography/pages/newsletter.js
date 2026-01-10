import Head from 'next/head'
import { useRef } from 'react'

// Import from shared-ui package
// Note: In the actual implementation, this will be imported from @iiskills/shared-ui
// For now, we'll create a local version until workspace is set up
const NewsletterSignup = ({ mode = 'embedded', onClose = null, onSuccess = null }) => {
  // This is a placeholder - the actual component will come from shared-ui package
  return (
    <div className="text-center p-8">
      <p className="text-gray-600">
        Newsletter signup component will be loaded from shared-ui package
      </p>
    </div>
  )
}

export default function NewsletterPage() {
  const formRef = useRef(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <>
      <Head>
        <title>Newsletter - iiskills.cloud</title>
        <meta name="description" content="Subscribe to the iiskills.cloud newsletter for updates, learning resources, and exclusive content." />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-neutral to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📧 Stay Connected
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Get the latest updates, learning resources, career tips, and exclusive content delivered straight to your inbox.
            </p>
            
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
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-lg mb-2">Learning Resources</h3>
              <p className="text-gray-600 text-sm">
                Curated content and study materials to accelerate your learning journey
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">Career Guidance</h3>
              <p className="text-gray-600 text-sm">
                Expert tips and strategies for exam preparation and career growth
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-bold text-lg mb-2">Exclusive Offers</h3>
              <p className="text-gray-600 text-sm">
                Early access to new courses and special discounts for subscribers
              </p>
            </div>
          </div>

          {/* Newsletter Signup Form */}
          <div ref={formRef} className="mb-12">
            <NewsletterSignup mode="embedded" />
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-2">📬 What to Expect</h3>
            <p className="text-gray-600 text-sm mb-4">
              We respect your inbox! Our newsletter is sent weekly with valuable content, no spam.
              You can unsubscribe at any time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No Spam
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Weekly Updates
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Easy Unsubscribe
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
