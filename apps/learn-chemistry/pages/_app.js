import '../styles/globals.css'

import Head from 'next/head'

import SiteHeader from '../../../components/shared/SiteHeader'


export default function App({ Component, pageProps }) {
  return (
    <>

      <Head>
        <link rel="icon" href="/images/favicon-learn-chemistry.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-chemistry.svg" />
      </Head>

      <SiteHeader />

      <Component {...pageProps} />
    </>
  )
}
