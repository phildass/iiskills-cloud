import Link from "next/link";
import Head from "next/head";
import Footer from "../components/Footer";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | iiskills.cloud</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-neutral to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="text-9xl font-bold text-primary mb-6 animate-pulse">404</div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Helpful Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎓 Welcome to iiskills.cloud!</h2>
            <p className="text-gray-700 mb-4">
              We're the Indian Institute of Professional Skills Development, powered by AI Cloud
              Enterprises. We offer comprehensive learning programs across multiple domains:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700 mb-4">
              <div>🤖 Artificial Intelligence</div>
              <div>💻 Software Development</div>
              <div>📊 Management Skills</div>
              <div>📢 Public Relations</div>
              <div>🏛️ Government Jobs</div>
              <div>⚛️ Physics</div>
              <div>🧪 Chemistry</div>
              <div>📐 Mathematics</div>
              <div>🌍 Geography</div>
              <div>🧬 Biology</div>
              <div>🧠 Aptitude</div>
              <div>💎 Professional Finesse</div>
            </div>
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
                href="/courses"
                className="bg-accent hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                📚 View Courses
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
                🔐 Login
              </Link>
              <Link
                href="/about"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                ℹ️ About Us
              </Link>
              <Link
                href="/dashboard"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                🎛️ Dashboard
              </Link>
            </div>
          </div>

          {/* Learning Path Suggestion */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border-2 border-green-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🚀 New to iiskills?</h3>
            <p className="text-gray-700 mb-4">
              Start your learning journey with our Foundation Suite - completely free courses in
              Math, Physics, Chemistry, Biology, Geography, and Aptitude. Build a strong foundation
              before advancing to specialized professional programs.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all"
            >
              Explore Foundation Suite →
            </Link>
          </div>

          {/* Additional Info */}
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{" "}
            <Link href="/dashboard" className="text-primary hover:underline font-semibold">
              raise a support ticket
            </Link>{" "}
            via your dashboard.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
