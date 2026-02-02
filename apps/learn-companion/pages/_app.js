
import '../styles/globals.css';
import Head from 'next/head';

import '../styles/globals.css'
import SiteHeader from '../../../components/shared/SiteHeader'


export default function App({ Component, pageProps }) {
  return (
    <>

      <Head>
        <link rel="icon" href="/images/favicon-learn-companion.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-companion.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );

      <SiteHeader />
      <Component {...pageProps} />
    </>
  )

}
