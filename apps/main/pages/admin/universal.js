import Head from 'next/head';
import UniversalAdminDashboard from '../../components/UniversalAdminDashboard';
import { useAdminProtectedPage, AccessDenied } from '../../components/AdminProtectedPage';

export default function AdminPage() {
  const { ready, denied } = useAdminProtectedPage();

  if (denied) return <AccessDenied />;
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Universal Admin Dashboard - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <UniversalAdminDashboard />
    </>
  );
}
