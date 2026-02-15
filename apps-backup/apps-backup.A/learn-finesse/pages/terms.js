import Head from "next/head";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Learn Finesse | iiskills.cloud</title>
        <meta name="description" content="Terms and Conditions for Learn Finesse" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Terms and Conditions
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Learn Finesse, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Permission is granted to access Learn Finesse for personal, non-commercial use only.
              This license shall automatically terminate if you violate any of these restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">3. Educational Content</h2>
            <p className="text-gray-700 leading-relaxed">
              The content provided in Learn Finesse is for educational purposes. While we strive
              for cultural accuracy across Western, Indian, and Eastern contexts, cultural norms
              can vary within regions. We recommend adapting lessons to your specific context.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">4. No Formal Certification</h2>
            <p className="text-gray-700 leading-relaxed">
              Learn Finesse provides skill badges and confidence scores for internal tracking.
              These do not constitute formal certification or professional credentials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">5. User Conduct</h2>
            <p className="text-gray-700 leading-relaxed">
              Users agree to use the platform respectfully and not to share course content without
              permission. Cultural sensitivity is expected in all interactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">6. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your progress data and learning activities are stored securely. We do not share
              personal information with third parties without consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">7. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              Learn Finesse reserves the right to revise these terms at any time. Continued use
              of the platform constitutes acceptance of revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-charcoal mb-3">8. Contact</h2>
            <p className="text-gray-700 leading-relaxed">
              Questions about these Terms should be directed to iiskills.cloud support.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
