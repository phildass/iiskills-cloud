import Head from "next/head";
import EnhancedUniversalRegister from "../components/shared/EnhancedUniversalRegister";

/**
 * Registration Page - Re-enabled per Product Requirements 14.2
 * 
 * Comprehensive registration form with:
 * - First Name, Last Name
 * - Age
 * - Stage (Student, Employed, Other)
 * - Father's Occupation
 * - Mother's Occupation  
 * - Location (Taluk, District, State for India; Other for non-India)
 * - Phone Number
 * - Purpose (Just Browsing, Intend to take a course)
 * - CAPTCHA (I'm not a robot)
 * - User status display
 * - Automated welcome email for verification
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

      <EnhancedUniversalRegister
        redirectAfterRegister="/login"
        appName="iiskills.cloud"
        showGoogleAuth={true}
      />
    </>
  );
}

/*
// ORIGINAL REGISTRATION PAGE - DISABLED
import Head from "next/head";
import UniversalRegister from "../components/shared/UniversalRegister";

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
*/
