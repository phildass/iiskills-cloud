import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";

export default function App({ Component, pageProps }) {
  const { showPopup, closePopup, isClosing } = useNewsletterPopup(30); // Show every 7 days

  return (
    <ErrorBoundary>
      <Navbar />
      <Component {...pageProps} />
      <Footer />

      {/* Newsletter Popup - shows based on timing */}
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
