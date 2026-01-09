import '../styles/globals.css'
import AuthenticationChecker from '../../components/shared/AuthenticationChecker'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthenticationChecker />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
