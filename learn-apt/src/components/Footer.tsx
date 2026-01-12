"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral text-charcoal mt-12 py-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-3">Learn Your Aptitude</h3>
            <p className="text-sm text-gray-600 mb-2">
              Indian Institute of Professional Skills Development
            </p>
            <p className="text-sm text-gray-600">
              Discover your learning preferences and aptitude
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link href="https://iiskills.cloud" className="text-gray-600 hover:text-primary">Main Site</Link></li>
              <li><Link href="https://iiskills.cloud/about" className="text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link href="https://iiskills.cloud/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="https://iiskills.cloud/terms" className="text-gray-600 hover:text-primary">Terms and Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-3">Contact</h3>
            <p className="text-sm text-gray-600 mb-2">Email: info@iiskills.cloud</p>
            <p className="text-sm text-gray-600">Location: Indiranagar, Bengaluru</p>
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
            © {currentYear} AI Cloud Enterprises | Indian Institute of Professional Skills Development
          </p>
          <p className="text-gray-600 text-sm">
            Project by <a href="https://aienter.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">AI Cloud Enterprises (AIEnter. in)</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
