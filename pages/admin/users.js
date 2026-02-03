import Head from "next/head";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";

export default function AdminUsers() {
  return (
    <ProtectedRoute>
      <Head>
        <title>User Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">User Management</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Enrolled Users</h2>
              <div className="space-x-2">
                <button className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition">
                  Export Data
                </button>
              </div>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No users enrolled yet. User data will appear here once students start enrolling.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}
