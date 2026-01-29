import Head from "next/head";
import UniversalRegister from "../../components/shared/UniversalRegister";

/**
 * Registration Page for Learn-Chemistry
 *
 * Uses the universal registration component with simplified fields.
 * Users registered here can access all iiskills.cloud apps and subdomains.
 */
export default function Register() {
  return (
    <>
      <Head>
        <title>Register - Learn-Chemistry</title>
        <meta
          name="description"
          content="Create your account - Access Learn-Chemistry and all iiskills.cloud apps"
        />
      </Head>

      <UniversalRegister
        simplified={true}
        redirectAfterRegister="/login"
        appName="Learn-Chemistry"
        showGoogleAuth={true}
      />
    </>
  );
}
