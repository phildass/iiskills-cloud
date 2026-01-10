import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ErrorBoundary from '../components/ErrorBoundary'
import AIAssistant from '../components/shared/AIAssistant'
import NewsletterSignup from '../components/shared/NewsletterSignup'
import { useNewsletterPopup } from '../utils/useNewsletterPopup'

export default function App({ Component, pageProps }) {
  const { showPopup, closePopup } = useNewsletterPopup(7) // Show every 7 days

  return (
    <ErrorBoundary>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      
      {/* AI Assistant - always visible */}
      <AIAssistant />
      
      {/* Newsletter Popup - shows based on timing */}
      {showPopup && (
        <NewsletterSignup 
          mode="modal"
          onClose={() => closePopup(false)}
          onSuccess={() => closePopup(true)}
        />
      )}
    </ErrorBoundary>
  )
}