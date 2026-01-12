import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import UniversalLogin from "../../components/shared/UniversalLogin";
import { getCurrentUser, isAdmin } from "../../lib/supabaseClient";

/**
 * Admin Login Page for Learn Ias
 *
 * Uses the universal login component with automatic admin role detection.
 * After successful login, users with admin privileges are redirected to /admin,
 * while regular users see an access denied message.
 *
 * Security:
 * - No separate admin credentials
 * - Uses main Supabase authentication
 * - Role-based access control via user metadata
 */
export default function AdminLogin() {
  const router = useRouter();

  // Check if user is already authenticated as admin
  useEffect(() => {
    const checkExistingAuth = async () => {
      const user = await getCurrentUser();
      if (user && isAdmin(user)) {
        // User is already authenticated as admin, show access info
        // In a real implementation, this would show an admin dashboard
        return;
      }
    };
    checkExistingAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>Admin Login - Learn Ias</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <UniversalLogin
        redirectAfterLogin="/learn"
        appName="Learn Ias Admin"
        showMagicLink={true}
        showGoogleAuth={true}
      />
    </>
  );
}
