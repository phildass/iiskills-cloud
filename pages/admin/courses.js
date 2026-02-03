import Head from "next/head";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";

export default function AdminCourses() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Course Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Course Management</h1>
          <button className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition">
            + Add New Course
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Course management interface coming soon. Currently displaying 20 courses on the
                  courses page.
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
