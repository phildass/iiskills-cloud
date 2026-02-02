import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon-learn-physics.svg" />
        <link rel="apple-touch-icon" href="/images/favicon-learn-physics.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
