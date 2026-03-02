import Head from "next/head";
import { EnhancedUniversalRegister } from "@iiskills/ui/authentication";

export default function Register() {
  return (
    <>
      <Head>
        <title>Register - Learn Apt</title>
        <meta name="description" content="Create your account to access aptitude tests" />
      </Head>

      <EnhancedUniversalRegister
        redirectAfterRegister="/"
        appName="Learn Apt"
        showGoogleAuth={true}
      />
    </>
  );
}
