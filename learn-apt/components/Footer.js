import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-4">Learn Your Aptitude</h3>
            <p className="text-gray-300 text-sm">
              Part of the Indian Institute of Professional Skills Development initiative
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-300 hover:text-white transition">Home</Link>
              <Link href="https://iiskills.cloud" className="block text-gray-300 hover:text-white transition">Main Site</Link>
              <Link href="https://iiskills.cloud/about" className="block text-gray-300 hover:text-white transition">About</Link>
              <Link href="https://iiskills.cloud/terms" className="block text-gray-300 hover:text-white transition">Terms &amp; Conditions</Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">Email: info@iiskills.cloud</p>
              <p className="text-gray-300">Powered by AI Cloud Enterprises</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} iiskills.cloud - Indian Institute of Professional Skills Development. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
