import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";

export default function App({ Component, pageProps }) {
  const { showPopup, closePopup, isClosing } = useNewsletterPopup(10); // Show for 10 seconds, once per session

  return (
    <ErrorBoundary>
      <Navbar />
      <Component {...pageProps} />
      <Footer />

      {/* Newsletter Popup - shows once per session for 10s to unauthenticated users */}
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
