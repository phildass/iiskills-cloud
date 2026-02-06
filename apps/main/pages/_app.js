import "../styles/globals.css";
import Head from "next/head";
import SiteHeader from "../../../components/shared/SiteHeader";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import AIAssistant from "../components/shared/AIAssistant";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import TestingModeBanner from "../components/TestingModeBanner";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";
import { UserProgressProvider } from "../contexts/UserProgressContext";

export default function App({ Component, pageProps }) {
  const { showPopup, closePopup, isClosing } = useNewsletterPopup(30); // Show for 30 seconds on each page load

  return (
    <ErrorBoundary>
      <UserProgressProvider>

      <Head>
        <link rel="icon" href="/images/favicon-iiskills.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-iiskills.svg" />
      </Head>

      <SiteHeader />
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
          isClosing={isClosing}
        />
      )}

      {/* Testing Mode Banner - shows when feature flags are enabled */}
      <TestingModeBanner />
      </UserProgressProvider>
    </ErrorBoundary>
  );
}
