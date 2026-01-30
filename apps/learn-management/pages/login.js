import Head from "next/head";
import UniversalLogin from "@shared/UniversalLogin";

/**
 * Login Page for Learn-Management
 *
 * Uses the universal login component. Users can sign in with
 * credentials from any iiskills.cloud app or subdomain.
 */
export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - Learn-Management</title>
        <meta
          name="description"
          content="Sign in to Learn-Management - Universal access with your iiskills.cloud account"
        />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/learn"
        appName="Learn-Management"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
