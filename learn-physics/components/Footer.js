import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-charcoal text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Learn Physics</h3>
            <p className="text-gray-300">
              Master physics concepts with AI-driven lessons and comprehensive testing.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-300 hover:text-white transition">
                  Learning Platform
                </Link>
              </li>
              <li>
                <a href="https://iiskills.cloud" className="text-gray-300 hover:text-white transition">
                  Main Site
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://iiskills.cloud/terms" className="text-gray-300 hover:text-white transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="https://iiskills.cloud/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-6 text-center text-gray-300">
          <p>&copy; {currentYear} iiskills.cloud. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
