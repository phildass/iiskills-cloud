import "../styles/globals.css";

import Head from "next/head";
import { SiteHeader } from "@iiskills/ui/navigation";
import { Footer } from "@iiskills/ui/common";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon-iiskills.svg" />
        <link rel="apple-touch-icon" href="/images/iiskills-logo.png" />
      </Head>

      <SiteHeader appId="learn-management" isFreeApp={false} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
