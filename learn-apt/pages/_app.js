import '../styles/globals.css'
import { AdminProvider } from '../contexts/AdminContext'

export default function App({ Component, pageProps }) {
  return (
    <AdminProvider>
      <Component {...pageProps} />
    </AdminProvider>
  )
}
