import { useRouter } from "next/router";
import Head from "next/head";
import Footer from "../../components/Footer";

export default function VerifyCertificate() {
  const router = useRouter();
  const { certificateNo } = router.query;

  // IMPORTANT: This is a placeholder verification system
  // In production, replace this with actual database lookup
  // See INTEGRATION_EXAMPLES.md for production implementation
  const mockCertificateData = certificateNo
    ? {
        certificateNo: certificateNo,
        userName: "Rahul Sharma",
        courseName: "Professional Communication Skills",
        completionDate: "15 December, 2024",
        score: 85,
        isValid: true,
        issueDate: "15 December, 2024",
      }
    : null;

  return (
    <>
      <Head>
        <title>Verify Certificate - iiskills.cloud</title>
        <meta
          name="description"
          content="Verify the authenticity of an iiskills.cloud certificate"
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">
          Certificate Verification
        </h1>

        {!certificateNo ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-center text-gray-600 mb-6">
              Enter a certificate number to verify its authenticity
            </p>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter certificate number (e.g., IIPS-202412-0011001)"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const value = e.target.value.trim();
                    if (value) {
                      router.push(`/verify/${value}`);
                    }
                  }
                }}
              />
              <p className="text-sm text-gray-500 text-center">
                You can find the certificate number on the certificate document
              </p>
            </div>
          </div>
        ) : mockCertificateData && mockCertificateData.isValid ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">Certificate Verified ✓</h2>
              <p className="text-gray-600">This is a valid certificate issued by iiskills.cloud</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-charcoal mb-4">Certificate Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Certificate Number:</span>
                  <span className="text-primary font-bold">
                    {mockCertificateData.certificateNo}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Recipient:</span>
                  <span className="text-charcoal">{mockCertificateData.userName}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Course:</span>
                  <span className="text-charcoal">{mockCertificateData.courseName}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Score:</span>
                  <span className="text-green-600 font-bold">{mockCertificateData.score}%</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="font-semibold text-gray-700">Completion Date:</span>
                  <span className="text-charcoal">{mockCertificateData.completionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Issue Date:</span>
                  <span className="text-charcoal">{mockCertificateData.issueDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This certificate has been verified as authentic and was
                issued by the Indian Institute of Professional Skills Development (IIPSD) through
                iiskills.cloud.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-2">Certificate Not Found</h2>
              <p className="text-gray-600 mb-4">
                We could not verify the certificate with number: <strong>{certificateNo}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Please check the certificate number and try again. If you believe this is an error,
                please contact us at{" "}
                <a href="mailto:info@iiskills.cloud" className="text-primary hover:underline">
                  info@iiskills.cloud
                </a>
              </p>
            </div>
          </div>
        )}

        {/* How to Verify Section */}
        <div className="mt-8 bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">🔍 How to Verify a Certificate</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Scan the QR code on the certificate using your smartphone</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Or enter the certificate number manually in the verification form</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>View the certificate details to confirm authenticity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Valid certificates will show a green verification checkmark</span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </>
  );
}
