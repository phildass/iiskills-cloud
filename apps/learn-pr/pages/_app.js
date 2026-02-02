import '../styles/globals.css'
import SiteHeader from '../../../components/shared/SiteHeader'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SiteHeader />
      <Component {...pageProps} />
    </>
  )
}
