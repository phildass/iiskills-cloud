import Link from "next/link";
import Image from "next/image";
import { DASHBOARD_URL } from "@iiskills/access-control/src";

/**
 * Shared Footer Component
 *
 * Centralized footer for all iiskills.cloud apps
 * Features:
 * - About section
 * - Quick links
 * - Contact information
 * - AI Cloud branding
 *
 * NOTE: Google Translate widget is mounted once in Header (navbar).
 * The footer only shows a static label pointing users to the header widget.
 */
export default function Footer() {
  return (
    <footer className="bg-neutral text-charcoal mt-12 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-3">iiskills.cloud</h3>
            <p className="text-sm text-gray-600 mb-2">
              Indian Institute of Professional Skills Development
            </p>
            <p className="text-sm text-gray-600">Education for All, Online and Affordable</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-600 hover:text-primary">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/certification" className="text-gray-600 hover:text-primary">
                  Certification
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-3">Support</h3>
            <p className="text-sm text-gray-600 mb-2">
              For any queries or assistance, please raise a ticket via your{" "}
              <a href={DASHBOARD_URL} className="text-primary hover:underline">
                Dashboard
              </a>
              .
            </p>
          </div>
        </div>

        {/* Bottom Bar with AI Cloud Logo */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <div className="flex justify-center items-center mb-3">
            <Image
              src="/images/ai-cloud-logo.png"
              alt="AI Cloud Enterprises"
              width={80}
              height={80}
              className="opacity-90"
            />
          </div>
          <p className="text-gray-600 text-sm mb-2">
            © {new Date().getFullYear()} AI Cloud Enterprises | Indian Institute of Professional
            Skills Development
          </p>
          <p className="text-gray-600 text-sm">
            Project by{" "}
            <a
              href="https://aienter.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              AI Cloud Enterprises (AIEnter. in)
            </a>
          </p>
          {/* Language / Translation - widget lives in the navbar (Header) */}
          <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              🌐 Use the language selector in the navigation bar above to translate this page.
            </span>
          </div>
          {/* Mobile Access */}
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-500">
              📱 No app download required —{" "}
              <a href="/" className="text-primary hover:underline">
                open in your mobile browser
              </a>{" "}
              for the full experience.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
