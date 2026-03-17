import Head from "next/head";
import Link from "next/link";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Support - iiskills.cloud</title>
        <meta name="description" content="Get support for iiskills.cloud via your dashboard." />
      </Head>
      <main className="max-w-xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-accent mb-6">Need Support?</h1>
        <p className="text-gray-700 mb-6">
          For all queries, assistance, and support requests, please raise a ticket directly from
          your Dashboard. Our team will respond within 24 business hours.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Go to Dashboard & Raise a Ticket
        </Link>
      </main>
    </>
  );
}
