/**
 * /admin/login — redirects to the main Supabase login page.
 * 
 * Admin authentication is handled by Supabase. After login, users who are
 * authorized admins are allowed access to /admin/*.
 */
export async function getServerSideProps(context) {
  const redirect = context.query.redirect || '/admin';
  return {
    redirect: {
      destination: `/login?redirect=${encodeURIComponent(redirect)}`,
      permanent: false,
    },
  };
}

export default function AdminLogin() {
  return null;
}
