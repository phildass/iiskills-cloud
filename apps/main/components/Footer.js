export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-charcoal to-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Brand Section */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-2">iiskills Learning Suite</h3>
          <p className="text-xl text-gray-300 italic">
            "Master Professional Skills - Learn, Grow, Excel"
          </p>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-lg mb-3 text-accent">Learning Portals</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://app8.learn-math.iiskills.cloud" className="hover:text-white transition">Mathematics</a></li>
              <li><a href="https://app6.learn-physics.iiskills.cloud" className="hover:text-white transition">Physics</a></li>
              <li><a href="https://app7.learn-chemistry.iiskills.cloud" className="hover:text-white transition">Chemistry</a></li>
              <li><a href="https://app9.learn-geography.iiskills.cloud" className="hover:text-white transition">Geography</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-accent">About</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-white transition">Our Mission</a></li>
              <li><a href="/courses" className="hover:text-white transition">All Courses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-accent">The iiskills Way</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>🔗 Monorepo Powered</li>
              <li>⚡ The Power Hour</li>
              <li>🎯 Tri-Level Logic</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-6">
          © 2026 iiskills.cloud - Indian Institute of Professional Skills Development
        </div>
      </div>
    </footer>
  );
}
