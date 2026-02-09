import Link from "next/link";
import Head from "next/head";

/**
 * Shared 404 Error Page Component
 * 
 * Reusable 404 page for all iiskills apps with app-specific content
 * 
 * @param {string} appName - The name of the app (e.g., "Learn AI")
 * @param {string} appId - The app identifier (e.g., "learn-ai")
 * @param {string} emoji - App-specific emoji
 * @param {string} description - Brief description of what the app offers
 */
export default function Shared404({
  appName = "iiskills",
  appId = "main",
  emoji = "🎓",
  description = "Professional skills development platform"
}) {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | {appName}</title>
        <meta name="description" content={`The page you're looking for doesn't exist on ${appName}.`} />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="text-9xl font-bold text-primary mb-6 animate-pulse">404</div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist on {appName}.
          </p>

          {/* App Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-200">
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to {appName}
            </h2>
            <p className="text-gray-700 mb-4">
              {description}
            </p>
            <p className="text-sm text-gray-600">
              Part of the iiskills.cloud platform - Indian Institute of Professional Skills Development
            </p>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Where would you like to go?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/"
                className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                🏠 Home
              </Link>
              <Link
                href="/curriculum"
                className="bg-accent hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                📚 View Curriculum
              </Link>
              <Link
                href="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                📝 Register Free
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                🔐 Sign In
              </Link>
              <Link
                href="https://iiskills.cloud"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg col-span-2"
              >
                🌐 Back to Main Site
              </Link>
            </div>
          </div>

          {/* Learning Path Suggestion */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              🚀 Ready to Start Learning?
            </h3>
            <p className="text-gray-700 mb-4">
              Choose your learning path: Basic (beginner-friendly), Intermediate (real-world applications), 
              or Advanced (expert mastery). Not sure? Take our diagnostic quiz to find your perfect starting point!
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Start Learning →
            </Link>
          </div>

          {/* Additional Info */}
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{" "}
            <Link href="https://iiskills.cloud/contact" className="text-primary hover:underline font-semibold">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>
    </>
  );
}
