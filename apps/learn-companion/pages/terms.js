import Head from "next/head";
import Link from "next/link";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Learn Companion</title>
        <meta
          name="description"
          content="Terms and Conditions for Learn Companion - iiskills.cloud"
        />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">Terms and Conditions</h1>
        <p className="text-center text-gray-600 mb-8">Last Updated: January 2026</p>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">Introduction</h2>
            <p className="text-charcoal leading-relaxed">
              These Terms and Conditions ("Terms") govern your use of Learn Companion, a free
              AI-powered life advisor service provided by iiskills.cloud, a digital learning
              platform of the Indian Institute of Professional Skills Development ("IISKILLS,"
              "we," "us," or "our"). By accessing or using Learn Companion, you agree to be bound
              by these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">1. Free Service</h2>
            <p className="text-charcoal leading-relaxed">
              Learn Companion is provided as a free service. There are no subscription fees,
              payment requirements, or hidden costs. We reserve the right to modify or discontinue
              the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">2. Service Description</h2>
            <p className="text-charcoal leading-relaxed">
              Learn Companion is an AI-powered chatbot that provides life advice in response to
              questions that begin with "What should I do...". The service uses artificial
              intelligence to generate responses and should be used for informational and
              motivational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">3. No Professional Advice</h2>
            <p className="text-charcoal leading-relaxed">
              The advice provided by Learn Companion is AI-generated and should not be considered
              as professional medical, legal, financial, or therapeutic advice. For serious matters,
              please consult qualified professionals. We are not liable for any decisions made based
              on advice from Learn Companion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">4. User Conduct</h2>
            <p className="text-charcoal leading-relaxed">
              You agree to use Learn Companion responsibly and not to:
            </p>
            <ul className="list-disc ml-6 mt-2 text-charcoal space-y-1">
              <li>Use the service for illegal purposes</li>
              <li>Attempt to bypass or manipulate the service's limitations</li>
              <li>Use the service to harass, abuse, or harm others</li>
              <li>Attempt to extract, scrape, or reverse-engineer the AI system</li>
              <li>Share harmful, offensive, or inappropriate content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">5. Privacy</h2>
            <p className="text-charcoal leading-relaxed">
              Your conversations with Learn Companion may be stored and analyzed to improve the
              service. We do not share your personal conversations with third parties. For more
              information, please see our <Link href="/privacy" className="text-accent underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">6. Intellectual Property</h2>
            <p className="text-charcoal leading-relaxed">
              All content, features, and functionality of Learn Companion are owned by IISKILLS and
              are protected by intellectual property laws. You may not copy, modify, distribute, or
              create derivative works without our permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">7. Disclaimer of Warranties</h2>
            <p className="text-charcoal leading-relaxed">
              Learn Companion is provided "as is" without warranties of any kind. We do not
              guarantee that the service will be uninterrupted, error-free, or completely accurate.
              AI-generated responses may contain errors or inaccuracies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">8. Limitation of Liability</h2>
            <p className="text-charcoal leading-relaxed">
              IISKILLS shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of Learn Companion. Our total liability shall
              not exceed the amount you paid for the service (which is zero for this free service).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">9. Changes to Terms</h2>
            <p className="text-charcoal leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective
              immediately upon posting. Your continued use of Learn Companion after changes
              constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">10. Contact Information</h2>
            <p className="text-charcoal leading-relaxed">
              If you have questions about these Terms, please contact us through the main
              iiskills.cloud website.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Back to Learn Companion
          </Link>
        </div>
      </main>
    </>
  );
}
