import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon-learn-leadership.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-leadership.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
