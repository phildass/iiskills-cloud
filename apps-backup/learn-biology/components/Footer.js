"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Learn Biology</h3>
            <p className="text-sm">
              Part of the iiskills Foundation Suite. Master biology from cells
              to ecosystems—free forever.
            </p>
            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-900 rounded-lg">
              <span className="text-xl">🟢</span>
              <span className="text-xs font-bold text-green-300">
                Free Forever
              </span>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-white font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/curriculum" className="hover:text-white transition-colors">
                  Curriculum
                </a>
              </li>
              <li>
                <a href="/modules/1/lesson/1" className="hover:text-white transition-colors">
                  Sample Lesson
                </a>
              </li>
              <li>
                <a href="/onboarding" className="hover:text-white transition-colors">
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Foundation Courses */}
          <div>
            <h4 className="text-white font-semibold mb-4">Foundation Suite</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://app8.learn-math.iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  Learn Math
                </a>
              </li>
              <li>
                <a
                  href="https://app6.learn-physics.iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  Learn Physics
                </a>
              </li>
              <li>
                <a
                  href="https://app7.learn-chemistry.iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  Learn Chemistry
                </a>
              </li>
              <li>
                <a
                  href="https://app9.learn-geography.iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  Learn Geography
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore More</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  All iiskills Courses
                </a>
              </li>
              <li>
                <a
                  href="https://app1.learn-ai.iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  Learn AI (Premium)
                </a>
              </li>
              <li>
                <a
                  href="https://app4.learn-developer.iiskills.cloud"
                  className="hover:text-white transition-colors"
                >
                  Learn Developer (Premium)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2026 iiskills.cloud - All Rights Reserved</p>
          <p className="mt-2 text-gray-500">
            The 12th app in the iiskills ecosystem 🧬
          </p>
        </div>
      </div>
    </footer>
  );
}
