import "../styles/globals.css";
import Head from "next/head";
import SiteHeader from "../../../components/shared/SiteHeader";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon-iiskills.svg" />
        <link rel="apple-touch-icon" href="/images/iiskills-logo.png" />
        <title>MPA - My Personal Assistant | iiskills.cloud</title>
        <meta name="description" content="MPA - Your Personal Digital Butler. An AI-powered personal assistant app." />
      </Head>

      <SiteHeader appId="mpa" isFreeApp={false} showAuthButtons={true} />
      <Component {...pageProps} />
    </>
  );
}
