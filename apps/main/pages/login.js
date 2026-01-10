import Head from 'next/head'
import UniversalLogin from '../components/shared/UniversalLogin'

/**
 * Login Page for Main iiskills.cloud App
 * 
 * Uses the universal login component. Users can sign in with
 * credentials from any iiskills.cloud app or subdomain.
 */
export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - iiskills.cloud</title>
        <meta name="description" content="Sign in to iiskills.cloud - Universal access to all apps and learning modules" />
      </Head>
      
      <UniversalLogin 
        redirectAfterLogin="/dashboard"
        appName="iiskills.cloud"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  )
}
