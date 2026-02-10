export default function Contact() {
  return (
    <>
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-accent mb-6">Contact AI Cloud Enterprises</h1>
        <p className="text-gray-700 mb-6">
          Get in touch to learn more about our corporate solutions and how we can help transform your organization.
        </p>
        <form className="bg-white rounded shadow p-6 mb-8">
          <label className="block mb-2 font-semibold">Name</label>
          <input
            className="border p-2 rounded w-full mb-4"
            type="text"
            placeholder="Your Name"
            required
          />
          <label className="block mb-2 font-semibold">Email</label>
          <input
            className="border p-2 rounded w-full mb-4"
            type="email"
            placeholder="Your Email"
            required
          />
          <label className="block mb-2 font-semibold">Organization</label>
          <input
            className="border p-2 rounded w-full mb-4"
            type="text"
            placeholder="Your Organization"
          />
          <label className="block mb-2 font-semibold">Message</label>
          <textarea
            className="border p-2 rounded w-full mb-4"
            rows={5}
            placeholder="Tell us about your needs"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded font-bold w-full"
          >
            Send Message
          </button>
        </form>
        <div>
          <h2 className="text-lg font-bold mb-2">Company Info</h2>
          <p>Email: info@iiskills.cloud</p>
          <p>Address: Indiranagar, Bengaluru</p>
        </div>
      </main>
    </>
  );
}
