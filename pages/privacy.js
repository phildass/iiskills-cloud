import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Head from 'next/head'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - iiskills.cloud</title>
        <meta name="description" content="Privacy Policy for iiskills.cloud and Indian Institute of Professional Skills Development" />
      </Head>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">Privacy Policy</h1>
        <p className="text-center text-gray-600 mb-8">Last Updated: 24 December 2025</p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">Introduction</h2>
            <p className="text-charcoal leading-relaxed">
              Welcome to iiskills.cloud, the digital learning platform of the Indian Institute of Professional Skills Development ("IISKILLS," "we," "us," or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By accessing or using iiskills.cloud, you agree to this Privacy Policy. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-primary mt-4 mb-2">1.1 Personal Information</h3>
            <p className="text-charcoal leading-relaxed mb-2">
              We may collect personally identifiable information that you voluntarily provide, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-charcoal space-y-1 ml-4">
              <li>Name, email address, phone number</li>
              <li>Billing information (processed securely through third-party payment processors)</li>
              <li>Profile information (education, organization, location)</li>
              <li>Course enrollment and progress data</li>
              <li>Certificates and assessments</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mt-4 mb-2">1.2 Automatically Collected Information</h3>
            <p className="text-charcoal leading-relaxed mb-2">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-charcoal space-y-1 ml-4">
              <li>IP address, browser type, device information</li>
              <li>Usage data (pages visited, time spent, clicks)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">2. How We Use Your Information</h2>
            <p className="text-charcoal leading-relaxed mb-2">We use your information to:</p>
            <ul className="list-disc list-inside text-charcoal space-y-1 ml-4">
              <li>Provide, maintain, and improve our educational services</li>
              <li>Process course enrollments and issue certificates</li>
              <li>Communicate with you regarding courses, updates, and support</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Send promotional materials (with your consent, and you may opt out at any time)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">3. Information Sharing and Disclosure</h2>
            <p className="text-charcoal leading-relaxed mb-2">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-charcoal space-y-1 ml-4">
              <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our platform (e.g., payment processors, hosting services, analytics providers). These providers are contractually obligated to protect your data.</li>
              <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process, or to protect our rights and safety.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">4. Data Security</h2>
            <p className="text-charcoal leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no internet-based service is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">5. Cookies and Tracking Technologies</h2>
            <p className="text-charcoal leading-relaxed">
              We use cookies and similar technologies to enhance your experience, analyze site usage, and deliver personalized content. You can control cookie settings through your browser, but disabling cookies may limit certain features of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">6. Your Rights</h2>
            <p className="text-charcoal leading-relaxed mb-2">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside text-charcoal space-y-1 ml-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
              <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request that we delete your personal information, subject to legal obligations.</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
            </ul>
            <p className="text-charcoal leading-relaxed mt-2">
              To exercise these rights, please contact us at <a href="mailto:info@iiskills.cloud" className="text-primary hover:underline">info@iiskills.cloud</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">7. Third-Party Links</h2>
            <p className="text-charcoal leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">8. Children's Privacy</h2>
            <p className="text-charcoal leading-relaxed">
              Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">9. International Data Transfers</h2>
            <p className="text-charcoal leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that appropriate safeguards are in place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">10. Changes to This Privacy Policy</h2>
            <p className="text-charcoal leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the updated policy on this page with a revised "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">11. Contact Us</h2>
            <p className="text-charcoal leading-relaxed mb-2">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-charcoal"><strong>Indian Institute of Professional Skills Development (IISKILLS)</strong></p>
              <p className="text-charcoal">Email: <a href="mailto:info@iiskills.cloud" className="text-primary hover:underline">info@iiskills.cloud</a></p>
              <p className="text-charcoal">Website: <a href="https://iiskills.cloud" className="text-primary hover:underline">https://iiskills.cloud</a></p>
              <p className="text-charcoal">Location: New Delhi, India</p>
            </div>
          </section>

          <section className="border-t pt-6 mt-6">
            <p className="text-charcoal leading-relaxed italic">
              By using iiskills.cloud, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
