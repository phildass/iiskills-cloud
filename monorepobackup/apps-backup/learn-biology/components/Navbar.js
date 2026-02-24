"use client";

export default function Navbar({ appName = "Learn Biology" }) {
  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3">
              <span className="text-3xl">🧬</span>
              <span className="font-bold text-xl">{appName}</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/curriculum"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Curriculum
            </a>
            <a
              href="/onboarding"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
            >
              Get Started
            </a>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
              🟢 FREE
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
