import Head from "next/head";
import Link from "next/link";

/**
 * 403 — Access Forbidden
 *
 * Rendered when an authenticated user attempts to access a resource for
 * which they do not have permission (e.g. admin pages without admin role).
 */
export default function Forbidden() {
  return (
    <>
      <Head>
        <title>403 – Access Forbidden | iiskills.cloud</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">403</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
          <p className="text-gray-500 text-sm mb-6">
            You do not have permission to access this page. If you believe this is a mistake, please
            contact your administrator.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}
