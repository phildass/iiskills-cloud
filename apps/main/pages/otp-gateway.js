import Head from "next/head";
import Link from "next/link";

/**
 * OTP Gateway — Removed
 *
 * OTP-based access activation has been discontinued.
 * All authentication and access now flows through standard sign-in.
 *
 * Route: /otp-gateway  (kept for URL stability; redirects users to sign-in)
 */
export default function OtpGatewayRemoved() {
  return (
    <>
      <Head>
        <title>Access Activation — iiskills.cloud</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">OTP Activation Removed</h1>
          <p className="text-gray-600 mb-6">
            OTP-based access activation is no longer available. Your course access is granted
            automatically after payment — simply sign in with your account.
          </p>

          <Link
            href="/sign-in"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg mb-4"
          >
            Sign In to Access Your Course
          </Link>

          <p className="text-sm text-gray-500">
            If you have any issues, go to your dashboard and raise a ticket. We will revert as soon
            as possible.
          </p>

          <Link href="/tickets" className="block mt-2 text-sm text-blue-600 hover:text-blue-800">
            Go to Tickets
          </Link>

          <Link href="/" className="block mt-2 text-sm text-gray-400 hover:text-gray-600">
            Return to iiskills.cloud
          </Link>
        </div>
      </main>
    </>
  );
}
