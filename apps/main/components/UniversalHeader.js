/**
 * UniversalHeader Component
 *
 * A reusable header component that displays both iiskills and AI Cloud Enterprise branding.
 * This component serves as a universal branding feature across all subdomains.
 *
 * Features:
 * - Displays iiskills logo with "Indian Institute of Professional Skills Development" legend
 * - Displays AI Cloud logo with "AI Cloud Enterprises" legend
 * - Responsive design using CSS flexbox
 * - Accessible with appropriate alt text
 * - Horizontally aligned and visually balanced layout
 *
 * Note: This component is also available in components/shared/UniversalHeader.js for
 * easy import from subdomains (learn-management, learn-neet, etc.)
 *
 * Usage in main domain:
 * import UniversalHeader from '../components/UniversalHeader'
 *
 * // In your page or layout component:
 * export default function MyPage() {
 *   return (
 *     <div>
 *       <UniversalHeader />
 *       // Rest of your page content
 *     </div>
 *   )
 * }
 *
 * Usage in subdomains:
 * import UniversalHeader from '../../components/shared/UniversalHeader'
 */
 * 
 * Example - Including in _app.js for site-wide usage:
 * ```jsx
 * import UniversalHeader from '../components/UniversalHeader'
 * import Navbar from '../components/Navbar'
 * import Footer from '../components/Footer'
 * 
 * export default function App({ Component, pageProps }) {
 *   return (
 *     <>
 *       <UniversalHeader />
 *       <Navbar />
 *       <Component {...pageProps} />
 *       <Footer />
 *     </>
 *   )
 * }
 * ```
 */

import Image from 'next/image'

export default function UniversalHeader() {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
        {/* iiskills Logo and Legend */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="/images/iiskills-logo.png"
              alt="Indian Institute of Professional Skills Development Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-base sm:text-lg leading-tight">
              Indian Institute of
            </span>
            <span className="text-gray-800 font-semibold text-base sm:text-lg leading-tight">
              Professional Skills Development
            </span>
          </div>
        </div>

        {/* AI Cloud Logo and Legend */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src="/images/ai-cloud-logo.png"
              alt="AI Cloud Enterprises Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-800 font-semibold text-base sm:text-lg leading-tight">
              AI Cloud Enterprises
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
