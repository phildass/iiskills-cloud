import "../styles/globals.css";
import SiteHeader from "../components/shared/SiteHeader";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import AIAssistant from "../components/shared/AIAssistant";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";

export default function App({ Component, pageProps }) {
  const { showPopup, closePopup, isClosing } = useNewsletterPopup(30); // Show for 30 seconds

  return (
    <ErrorBoundary>
      <SiteHeader />
      <Component {...pageProps} />
      <Footer />

      {/* AI Assistant - always visible */}
      <AIAssistant />

      {/* Newsletter Popup - shows for 30s to unauthenticated users and auth status */}
      {showPopup && (
        <NewsletterSignup
          mode="modal"
          onClose={() => closePopup(false)}
          onSuccess={() => closePopup(true)}
          isClosing={isClosing}
        />
      )}
    </ErrorBoundary>
  );
}
