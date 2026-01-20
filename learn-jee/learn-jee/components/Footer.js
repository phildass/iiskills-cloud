export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Learn JEE</h3>
            <p className="text-gray-300 mb-4">
              Master JEE preparation with AI-generated lessons, comprehensive coverage of Physics,
              Chemistry, and Mathematics.
            </p>
            <p className="text-sm text-gray-400">Part of iiskills.cloud</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/learn" className="hover:text-white transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/premium-resources" className="hover:text-white transition">
                  Premium Resources
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  About JEE Program
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@iiskills.cloud</li>
              <li>Powered by AI Cloud Enterprises</li>
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
  )
}
