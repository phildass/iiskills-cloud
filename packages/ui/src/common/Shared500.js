import Link from "next/link";
import Head from "next/head";

/**
 * Shared 500 Error Page Component
 *
 * Reusable system-failure / server-error page for all iiskills apps.
 * Uses a lighthearted, humorous tone to soften the blow of a broken page
 * or site-wide outage, while still giving users clear recovery steps.
 *
 * @param {string} appName   - The name of the app (e.g., "Learn AI")
 * @param {string} appId     - The app identifier (e.g., "learn-ai")
 * @param {string} homeUrl   - URL for the "Go Home" link (defaults to "/")
 * @param {string} dashboardUrl - URL for the dashboard link (defaults to env-aware main site dashboard)
 */

const MAIN_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud";

export default function Shared500({
  appName = "iiskills",
  appId = "main",
  homeUrl = "/",
  dashboardUrl = `${MAIN_URL}/dashboard`,
}) {
  return (
    <>
      <Head>
        <title>500 - Something Went Wrong | {appName}</title>
        <meta
          name="description"
          content={`An unexpected error occurred on ${appName}. We're already on it!`}
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Robot illustration */}
          <div className="text-8xl mb-4 select-none" role="img" aria-label="Robot holding a wrench">
            🤖🔧
          </div>

          {/* Status code */}
          <div className="text-7xl font-bold text-indigo-600 mb-4 animate-pulse">500</div>

          {/* Headline */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Well, This is Awkward…</h1>

          {/* Sub-headline */}
          <p className="text-xl text-gray-600 mb-8">
            It seems a bug or an unforeseen technicality has decided to take a coffee break. We're
            sorry for the interruption!
          </p>

          {/* Quick Fixes */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-indigo-100 text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">⚡ Quick Fixes</h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Try <strong>refreshing the page</strong> — the classic &ldquo;turn it off and on
                  again&rdquo;.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Close this window, <strong>log back in</strong>, and try once more.
                </span>
              </li>
            </ol>
          </div>

          {/* Still Not Working */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-6 text-left">
            <h3 className="text-lg font-bold text-amber-900 mb-2">🚦 Still Not Working?</h3>
            <p className="text-amber-800 text-sm">
              If the site feels a bit sluggish or won&apos;t load, we might just be popular today!
              Heavy traffic can occasionally tire out our servers. Rest assured, we&apos;re on the
              case and will be back shortly. Your learning progress is safe with us — we promise you
              won&apos;t lose a beat.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
            >
              🔄 Refresh Page
            </button>
            <Link
              href={homeUrl}
              className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
            >
              🏠 Go Home
            </Link>
            <Link
              href={dashboardUrl}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition shadow-md hover:shadow-lg"
            >
              🎛️ Dashboard
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-gray-500 text-sm">
            If this keeps happening, please{" "}
            <Link
              href={`${MAIN_URL}/contact`}
              className="text-indigo-600 hover:underline font-semibold"
            >
              raise a support ticket
            </Link>{" "}
            and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </main>
    </>
  );
}
