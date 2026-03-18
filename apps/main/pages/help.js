import Head from "next/head";
import Link from "next/link";

const faqs = [
  {
    q: "How do I register on iiskills.cloud?",
    a: 'Click the "Register" button in the top navigation bar. Fill in your name, email address, and password, then follow the on-screen instructions. You can also sign up instantly using your Google account.',
  },
  {
    q: "What courses are available?",
    a: "We offer a wide range of professional skill-building courses including AI & Machine Learning, Software Development, Management, Public Relations, Aptitude & Reasoning, Mathematics, Chemistry, Geography, and Physics. Visit our Courses page for the full catalogue.",
  },
  {
    q: "How much does a course cost?",
    a: "Please visit our Courses page for current pricing. We periodically run introductory offers, so check back often.",
  },
  {
    q: "How do I access a paid course after purchasing?",
    a: "After completing your payment, log in to your account and navigate to My Dashboard. Your enrolled courses will appear there with direct access links.",
  },
  {
    q: "Can I get a certificate after completing a course?",
    a: 'Yes! Upon successfully completing a course, you will receive a verified digital certificate. You can view and download your certificates from the "My Certificates" section of your dashboard.',
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major UPI apps (GPay, PhonePe, Paytm), debit/credit cards, and net banking through our secure payment gateway.",
  },
  {
    q: "I forgot my password. How do I reset it?",
    a: 'Click "Login" in the navigation bar, then select "Forgot Password?" Enter your registered email address and we will send you a reset link.',
  },
  {
    q: "Is my personal data safe?",
    a: "Absolutely. We use industry-standard encryption (HTTPS) and follow strict data-protection practices. We never sell your personal information to third parties. Please read our Terms and Conditions for full details.",
  },
  {
    q: "Can I access the courses on my mobile phone?",
    a: "Yes. iiskills.cloud is fully responsive and works on all modern smartphones, tablets, and desktop browsers — no app download required.",
  },
  {
    q: "How do I contact support?",
    a: "Raise a ticket on your dashboard and we will revert if your request is valid. No queries will be entertained if they are not legit.",
  },
  {
    q: "Are the free courses really free?",
    a: "Yes! Our free learning apps (Mathematics, Chemistry, Geography, Physics, and Aptitude) are completely free to access. Note: Registration is required.",
  },
  {
    q: "How do I cancel a subscription or request a refund?",
    a: "To cancel a subscription or request a refund, please raise a ticket in your dashboard. We will check whether your refund is valid and if it is, you will be refunded within 7 working days. No email requests.",
  },
];

export default function Help() {
  return (
    <>
      <Head>
        <title>Help &amp; FAQ - iiskills.cloud</title>
        <meta
          name="description"
          content="Frequently asked questions and help documentation for iiskills.cloud — the online learning platform of the Indian Institute of Professional Skills Development."
        />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-2 text-center">Help &amp; FAQ</h1>
        <p className="text-center text-gray-500 mb-10">
          Frequently asked questions about iiskills.cloud
        </p>

        <div className="space-y-5">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-accent mb-2">
                {idx + 1}. {item.q}
              </h2>
              <p className="text-charcoal leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">Still have questions? We&apos;re here to help.</p>
          <Link
            href="/dashboard"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            Raise a Support Ticket
          </Link>
        </div>
      </main>
    </>
  );
}
