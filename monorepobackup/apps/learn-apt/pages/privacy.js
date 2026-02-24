import Head from "next/head";
import Link from "next/link";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Learn Apt</title>
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <div className="prose prose-blue max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, including your name, email address, and test results.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Track your progress and test results</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not share your personal information with third parties except as described in this policy.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We use reasonable measures to help protect your personal information from loss, theft, misuse, 
                and unauthorized access.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">5. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to access, update, or delete your personal information at any time.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">6. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by posting 
                the new policy on this page.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-4">7. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this privacy policy, please contact us.
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
