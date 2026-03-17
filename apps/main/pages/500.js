import Link from "next/link";
import Head from "next/head";
import Footer from "../components/Footer";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Something Went Wrong | iiskills.cloud</title>
        <meta
          name="description"
          content="An unexpected error occurred. We're already on it — your learning progress is safe."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Robot illustration */}
          <div className="text-8xl mb-4 select-none" role="img" aria-label="Robot holding a wrench">
            🤖🔧
          </div>

          {/* Status code */}
          <div className="text-9xl font-bold text-indigo-600 mb-6 animate-pulse">500</div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Well, This is Awkward…</h1>
          <p className="text-xl text-gray-600 mb-8">
            It seems a bug or an unforeseen technicality has decided to take a coffee break.
            We&apos;re sorry for the interruption!
          </p>

          {/* Quick Fixes */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">⚡ Quick Fixes</h2>
            <ol className="text-left space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Try <strong>refreshing the page</strong> — the classic &ldquo;turn it off and on
                  again&rdquo;.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Close this window, <strong>log back in</strong>, and try once more.
                </span>
              </li>
            </ol>
          </div>

          {/* Still Not Working */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-xl font-bold text-amber-900 mb-2">🚦 Still Not Working?</h3>
            <p className="text-amber-800">
              If the site feels a bit sluggish or won&apos;t load, we might just be popular today!
              Heavy traffic can occasionally tire out our servers. Rest assured, we&apos;re on the
              case and will be back shortly. Your learning progress is safe with us — we promise you
              won&apos;t lose a beat.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
            >
              🔄 Refresh Page
            </button>
            <Link
              href="/"
              className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
            >
              🏠 Home
            </Link>
            <Link
              href="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md hover:shadow-lg"
            >
              🎛️ Dashboard
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-gray-500 text-sm">
            If this keeps happening, please{" "}
            <Link href="/dashboard" className="text-primary hover:underline font-semibold">
              raise a support ticket
            </Link>{" "}
            via your dashboard and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
