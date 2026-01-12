import Head from 'next/head'
import UniversalRegister from '../../components/shared/UniversalRegister'

/**
 * Registration Page for Learn-IAS
 * 
 * Uses the universal registration component. Users can register once
 * and gain access to all iiskills.cloud apps and subdomains.
 */
export default function Register() {
  return (
    <>
      <Head>
        <title>Register - Learn-IAS</title>
        <meta name="description" content="Register for Learn-IAS - Get universal access to all iiskills.cloud apps" />
      </Head>
      
      <UniversalRegister 
        simplified={true}
        redirectAfterRegister="/learn"
        appName="Learn-IAS"
        showGoogleAuth={true}
      />
    </>
  )
}
