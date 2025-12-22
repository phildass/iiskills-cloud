import { useState, useRef } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CertificateTemplate from '../components/CertificateTemplate'
import { generateCertificatePDF, downloadPDF, generateCertificateData } from '../utils/certificateGenerator'

export default function MyCertificates() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const certificateRef = useRef(null)

  // Sample user data - In production, this would come from your user authentication system
  const [userCertificates] = useState([
    {
      id: 1,
      userId: 1001,
      userName: "Rahul Sharma",
      courseId: 1,
      courseName: "Professional Communication Skills",
      score: 85,
      completionDate: new Date('2024-12-15').toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      certificateNo: "IIPS-202412-0011001",
      status: "passed"
    },
    {
      id: 2,
      userId: 1001,
      userName: "Rahul Sharma",
      courseId: 5,
      courseName: "Project Management Basics",
      score: 92,
      completionDate: new Date('2024-12-10').toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      certificateNo: "IIPS-202412-0051001",
      status: "passed"
    }
  ])

  const [selectedCertificate, setSelectedCertificate] = useState(userCertificates[0])

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const element = certificateRef.current
      if (!element) {
        throw new Error('Certificate template not found')
      }

      const pdf = await generateCertificatePDF(element, {
        userName: selectedCertificate.userName,
        courseName: selectedCertificate.courseName,
      })

      // Download the PDF
      const fileName = `certificate_${selectedCertificate.userName}_${selectedCertificate.courseName}`
      downloadPDF(pdf, fileName)
    } catch (err) {
      console.error('Error generating PDF:', err)
      setError('Failed to generate certificate. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      <Head>
        <title>My Certificates - iiskills.cloud</title>
        <meta name="description" content="View and download your earned certificates from iiskills.cloud" />
      </Head>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">My Certificates</h1>
        <p className="text-xl text-center text-charcoal mb-12">
          Congratulations on your achievements! Download your certificates below.
        </p>

        {/* Certificate List */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Earned Certificates</h2>
          <div className="space-y-4">
            {userCertificates.map((cert) => (
              <div 
                key={cert.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedCertificate.id === cert.id 
                    ? 'border-primary bg-blue-50' 
                    : 'border-gray-300 hover:border-primary'
                }`}
                onClick={() => setSelectedCertificate(cert)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{cert.courseName}</h3>
                    <p className="text-sm text-gray-600">
                      Completed: {cert.completionDate} | Score: {cert.score}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Certificate No: {cert.certificateNo}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Passed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {userCertificates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No certificates earned yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Complete a course with a passing score to earn your certificate.
              </p>
            </div>
          )}
        </div>

        {/* Certificate Preview */}
        {selectedCertificate && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Certificate Preview</h2>
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="bg-accent text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div 
                  ref={certificateRef}
                  className="transform scale-75 origin-top-left"
                  style={{ width: `${1056 / 0.75}px` }} // Certificate width divided by scale
                >
                  <CertificateTemplate
                    userName={selectedCertificate.userName}
                    courseName={selectedCertificate.courseName}
                    certificateNo={selectedCertificate.certificateNo}
                    completionDate={selectedCertificate.completionDate}
                    score={selectedCertificate.score}
                    issueDate={selectedCertificate.completionDate}
                    qrCodeData={`https://iiskills.cloud/verify/${selectedCertificate.certificateNo}`}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">📋 How to Use Your Certificate</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Download:</strong> Click the "Download PDF" button to save your certificate</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Print:</strong> Print the PDF for physical display or submission</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Share:</strong> Share your achievement on LinkedIn, social media, or with employers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Verify:</strong> Use the QR code on the certificate for instant verification</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span><strong>Portfolio:</strong> Add to your professional portfolio or resume</span>
            </li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
