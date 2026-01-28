import Head from "next/head";
import UniversalLogin from "../../components/shared/UniversalLogin";

/**
 * Login Page for Learn-Math
 *
 * Uses the universal login component. Users can sign in with
 * credentials from any iiskills.cloud app or subdomain.
 */
export default function Login() {
  return (
    <>
      <Head>
        <title>Sign In - Learn-Math</title>
        <meta
          name="description"
          content="Sign in to Learn-Math - Universal access with your iiskills.cloud account"
        />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/learn"
        appName="Learn-Math"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
