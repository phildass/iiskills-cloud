import Head from "next/head";
import UniversalLogin from "@shared/UniversalLogin";

/**
 * Login Page for Learn Government Jobs
 *
 * Uses the universal login component. Users can sign in with
 * credentials from any iiskills.cloud app or subdomain.
 */
export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - Learn Government Jobs</title>
        <meta
          name="description"
          content="Sign in to Learn Government Jobs - Universal access with your iiskills.cloud account"
        />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/learn"
        appName="Learn Government Jobs"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
