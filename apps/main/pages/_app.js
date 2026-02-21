import "../styles/globals.css";
import Head from "next/head";
import { SiteHeader } from "@iiskills/ui/navigation";
import Footer from "../components/Footer";
import ErrorBoundary from "../components/ErrorBoundary";
import { AIAssistant } from "@iiskills/ui/ai";
import TestingModeBanner from "../components/TestingModeBanner";
import { UserProgressProvider } from "../contexts/UserProgressContext";

export default function App({ Component, pageProps }) {
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

      {/* Testing Mode Banner - shows when feature flags are enabled */}
      <TestingModeBanner />
      </UserProgressProvider>
    </ErrorBoundary>
  );
}
