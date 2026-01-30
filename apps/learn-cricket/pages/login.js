import Head from "next/head";
import UniversalLogin from "@shared/UniversalLogin";

/**
 * Login Page for Learn-Cricket
 *
 * Uses the universal login component. Users can sign in with
 * credentials from any iiskills.cloud app or subdomain.
 */
export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - Cricket Know-All</title>
        <meta
          name="description"
          content="Sign in to Cricket Know-All - Universal access with your iiskills.cloud account"
        />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/learn"
        appName="Cricket Know-All"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
