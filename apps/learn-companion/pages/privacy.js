import Head from "next/head";
import Link from "next/link";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Learn Companion</title>
        <meta
          name="description"
          content="Privacy Policy for Learn Companion - iiskills.cloud"
        />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">Privacy Policy</h1>
        <p className="text-center text-gray-600 mb-8">Last Updated: January 2026</p>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">Introduction</h2>
            <p className="text-charcoal leading-relaxed">
              This Privacy Policy explains how Learn Companion, a service of iiskills.cloud and the
              Indian Institute of Professional Skills Development ("IISKILLS," "we," "us," or
              "our"), collects, uses, and protects your information when you use our AI-powered life
              advisor service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">1. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-primary mb-2">Conversation Data</h3>
            <p className="text-charcoal leading-relaxed mb-4">
              We collect and store the questions you ask and the responses provided by the AI. This
              includes:
            </p>
            <ul className="list-disc ml-6 text-charcoal space-y-1 mb-4">
              <li>Your questions and messages</li>
              <li>AI-generated responses</li>
              <li>Timestamps of conversations</li>
            </ul>

            <h3 className="text-xl font-semibold text-primary mb-2">Technical Data</h3>
            <p className="text-charcoal leading-relaxed mb-4">
              We automatically collect certain technical information:
            </p>
            <ul className="list-disc ml-6 text-charcoal space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage patterns and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">2. How We Use Your Information</h2>
            <p className="text-charcoal leading-relaxed mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc ml-6 text-charcoal space-y-1">
              <li>Provide and improve the Learn Companion service</li>
              <li>Analyze usage patterns to enhance AI responses</li>
              <li>Monitor and prevent misuse of the service</li>
              <li>Improve our AI algorithms and training data</li>
              <li>Ensure compliance with our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">3. Data Sharing</h2>
            <p className="text-charcoal leading-relaxed mb-4">
              We do not sell your personal information. However, we may share data in the following
              circumstances:
            </p>
            <ul className="list-disc ml-6 text-charcoal space-y-1">
              <li>
                <strong>OpenAI API:</strong> Your questions are sent to OpenAI's API to generate
                responses. OpenAI's privacy policy applies to this data processing.
              </li>
              <li>
                <strong>Service Providers:</strong> We may share data with trusted service providers
                who help us operate the platform.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information if required by law
                or to protect our rights.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">4. Data Security</h2>
            <p className="text-charcoal leading-relaxed">
              We implement reasonable security measures to protect your information. However, no
              internet transmission is completely secure. We use HTTPS encryption for all
              communications and store API keys securely on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">5. Data Retention</h2>
            <p className="text-charcoal leading-relaxed">
              We retain conversation data for as long as necessary to provide and improve the
              service. You may request deletion of your data by contacting us through the main
              iiskills.cloud website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">6. Cookies and Tracking</h2>
            <p className="text-charcoal leading-relaxed">
              We may use cookies and similar technologies to improve user experience and analyze
              usage. You can control cookies through your browser settings, though this may affect
              service functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">7. Third-Party Services</h2>
            <p className="text-charcoal leading-relaxed">
              Learn Companion uses OpenAI's API to generate responses. OpenAI's privacy policy and
              terms of service apply to the processing of your questions. We recommend reviewing
              OpenAI's privacy policy at{" "}
              <a
                href="https://openai.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline"
              >
                openai.com/privacy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">8. Children's Privacy</h2>
            <p className="text-charcoal leading-relaxed">
              Learn Companion is not intended for children under 13. We do not knowingly collect
              information from children. If you believe a child has provided us with information,
              please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">9. Your Rights</h2>
            <p className="text-charcoal leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc ml-6 text-charcoal space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of certain data processing activities</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">10. Changes to Privacy Policy</h2>
            <p className="text-charcoal leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated "Last Updated" date. Your continued use of Learn Companion after
              changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-accent mb-3">11. Contact Us</h2>
            <p className="text-charcoal leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your privacy
              rights, please contact us through the main iiskills.cloud website.
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
