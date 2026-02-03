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
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="text-9xl font-bold text-primary mb-6 animate-pulse">404</div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Helpful Links */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
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
                href="/about"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                ℹ️ About Us
              </Link>
              <Link
                href="/contact"
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
              >
                📧 Contact
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{" "}
            <Link href="/contact" className="text-primary hover:underline font-semibold">
              contact us
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
