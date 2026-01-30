import Head from "next/head";
import UniversalRegister from "@shared/UniversalRegister";

/**
 * Registration Page for Learn-Management
 *
 * Uses the universal registration component with simplified fields.
 * Users registered here can access all iiskills.cloud apps and subdomains.
 */
export default function Register() {
  return (
    <>
      <Head>
        <title>Register - Learn-Management</title>
        <meta
          name="description"
          content="Create your account - Access Learn-Management and all iiskills.cloud apps"
        />
      </Head>

      <UniversalRegister
        simplified={true}
        redirectAfterRegister="/login"
        appName="Learn-Management"
        showGoogleAuth={true}
      />
    </>
  );
}
