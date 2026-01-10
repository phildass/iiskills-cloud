import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ErrorBoundary from '../components/ErrorBoundary'

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </ErrorBoundary>
  )
}