export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Learn NEET</h3>
            <p className="text-gray-300 mb-4">
              Comprehensive NEET preparation platform with AI-powered content for Physics, Chemistry, and Biology.
            </p>
            <p className="text-sm text-gray-400">
              Part of iiskills.cloud
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/learn" className="hover:text-white transition">Dashboard</a></li>
              <li><a href="/premium-resources" className="hover:text-white transition">Premium Resources</a></li>
              <li><a href="/" className="hover:text-white transition">About NEET Program</a></li>
              <li><a href="/admin" className="hover:text-white transition">Admin Panel</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Subjects</h4>
            <ul className="space-y-2 text-gray-300">
              <li>⚛️ Physics (12 Modules)</li>
              <li>🧪 Chemistry (12 Modules)</li>
              <li>🧬 Biology (10 Modules)</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-6 text-center text-gray-400 text-sm">
          <p>© 2024 iiskills.cloud - Indian Institute of Professional Skills Development. All rights reserved.</p>
          <p className="mt-2">Learn NEET - 2-Year Premium NEET Preparation Program</p>
        </div>
      </div>
    </footer>
  )
}
