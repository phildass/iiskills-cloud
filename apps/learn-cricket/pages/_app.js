import '../styles/globals.css'

import Head from 'next/head'
// import SiteHeader from '../../../components/shared/SiteHeader'
import Footer from '../components/Footer'


export default function App({ Component, pageProps }) {
  return (
    <>

      <Head>
        <link rel="icon" href="/images/favicon-learn-cricket.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-cricket.svg" />
      </Head>

      {/* <SiteHeader /> */}
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
