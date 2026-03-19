import "../styles/globals.css";

import Head from "next/head";
import { SiteHeader, AppSecondaryNavbar } from "@iiskills/ui/navigation";
import { Footer } from "@iiskills/ui/common";
import { AdminModeProvider, AdminModeBanner } from "@iiskills/ui";

const ADMIN_API_BASE = process.env.NEXT_PUBLIC_MAIN_APP_URL || "";

export default function App({ Component, pageProps }) {
  return (
    <AdminModeProvider adminApiBase={ADMIN_API_BASE}>
      <>
        <Head>
          <link rel="icon" href="/images/favicon-iiskills.svg" />
          <link rel="apple-touch-icon" href="/images/iiskills-logo.png" />
        </Head>

        <AdminModeBanner />
        <SiteHeader appId="learn-chemistry" isFreeApp={true} />
        <AppSecondaryNavbar appId="learn-chemistry" appName="Chemistry" isFree={true} />
        <Component {...pageProps} />
        <Footer />
      </>
    </AdminModeProvider>
  );
}
