import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-4">Learn JEE</h3>
            <p className="text-gray-300 text-sm">
              Master JEE preparation with AI-generated lessons, comprehensive coverage of Physics,
              Chemistry, and Mathematics.
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Part of the Indian Institute of Professional Skills Development initiative.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link href="/learn" className="block text-gray-300 hover:text-white transition">
                Start Learning
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://iiskills.cloud"}
                className="block text-gray-300 hover:text-white transition"
              >
                iiskills.cloud
              </Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white transition">
                Terms & Conditions
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:info@iiskills.cloud"
                className="block text-gray-300 hover:text-white transition"
              >
                Email: info@iiskills.cloud
              </a>
              <p className="text-gray-300">Powered by AI Cloud Enterprises</p>
              <p className="text-gray-300">Pricing: ₹99 + GST ₹17.82 = ₹116.82</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} iiskills.cloud - Indian Institute of Professional Skills
            Development. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
