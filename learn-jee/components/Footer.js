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
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-300 hover:text-white transition">
                  Start Learning
                </Link>
              </li>
              <li>
                <Link
                  href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://iiskills.cloud"}
                  className="text-gray-300 hover:text-white transition"
                >
                  iiskills.cloud
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:info@iiskills.cloud"
                  className="text-gray-300 hover:text-white transition"
                >
                  info@iiskills.cloud
                </a>
              </li>
              <li className="text-gray-300">Pricing: ₹99 + GST ₹17.82 = ₹116.82</li>
            </ul>
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
