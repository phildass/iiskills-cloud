import Head from "next/head";
import { useRouter } from "next/router";
import UniversalLogin from "@shared/UniversalLogin";

/**
 * Sign-in page for this app.
 *
 * Login is handled via the shared UniversalLogin component which routes
 * Google OAuth and magic-link flows through the centralized Supabase
 * callback at https://iiskills.cloud/auth/callback.
 */
export default function SignIn() {
  const router = useRouter();
  const { next } = router.query;

  return (
    <>
      <Head>
        <title>Sign In — iiskills.cloud</title>
        <meta
          name="description"
          content="Sign in to your iiskills.cloud account to access your courses."
        />
      </Head>

      <UniversalLogin
        redirectAfterLogin={next || "/"}
        appName="iiskills.cloud"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
