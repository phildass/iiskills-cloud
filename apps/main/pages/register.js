import Head from "next/head";
import UniversalRegister from "../components/shared/UniversalRegister";

/**
 * Registration Page for Main iiskills.cloud App
 *
 * Uses the universal registration component with full form fields.
 * This is the primary registration point for the entire platform.
 * Users registered here can access all iiskills.cloud apps and subdomains.
 */
export default function Register() {
  return (
    <>
      <Head>
        <title>Register - iiskills.cloud</title>
        <meta
          name="description"
          content="Create your account - Access all iiskills.cloud apps and learning modules"
        />
      </Head>

      <UniversalRegister
        simplified={false}
        redirectAfterRegister="/login"
        appName="iiskills.cloud"
        showGoogleAuth={true}
      />
    </>
  );
}
