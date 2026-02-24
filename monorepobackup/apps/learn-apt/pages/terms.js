import Head from "next/head";
import Link from "next/link";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - Learn Apt</title>
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            
            <div className="prose prose-blue max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Learn Apt, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">2. Use License</h2>
              <p className="text-gray-700 mb-4">
                Permission is granted to use Learn Apt for personal, non-commercial aptitude testing and skill development.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3. User Account</h2>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept 
                responsibility for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">4. Free Service</h2>
              <p className="text-gray-700 mb-4">
                Learn Apt is provided as a free service. We reserve the right to modify or discontinue the service at any time.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">5. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                The materials on Learn Apt are provided on an 'as is' basis. We make no warranties, expressed or implied, 
                and hereby disclaim all other warranties.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6. Limitations</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Learn Apt or its suppliers be liable for any damages arising out of the use or inability 
                to use the materials on Learn Apt.
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link href="/" className="text-primary hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
