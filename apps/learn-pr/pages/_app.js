import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon-learn-pr.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-pr.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
