import Link from "next/link";
import { getCanonicalLinks } from "../../../components/shared/canonicalNavLinks";

export default function Navbar() {
  // Get canonical links for learn-govt-jobs (includes Opportunities, Daily Brief, Exam Alerts)
  const navLinks = getCanonicalLinks("learn-govt-jobs", false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            Learn Govt Jobs
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={link.className || "text-gray-700 hover:text-primary transition-colors"}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/curriculum" className="text-gray-700 hover:text-primary transition-colors">
              Curriculum
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-primary transition-colors">
              Jobs
            </Link>
            <Link href="/news" className="text-gray-700 hover:text-primary transition-colors">
              News
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-primary transition-colors">
              Admin
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
