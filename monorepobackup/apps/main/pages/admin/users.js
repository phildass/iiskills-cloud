import Head from "next/head";
import { useState, useEffect } from "react";
// import ProtectedRoute from "../../components/ProtectedRoute";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAdmin, setFilterAdmin] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filterAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      
      if (filterAdmin === 'admin') {
        query = query.eq('is_admin', true);
      } else if (filterAdmin === 'regular') {
        query = query.eq('is_admin', false);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'remove' : 'grant'} admin access?`)) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      alert(`Admin status updated successfully!`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.first_name?.toLowerCase().includes(searchLower)) ||
      (user.last_name?.toLowerCase().includes(searchLower)) ||
      (user.full_name?.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <Head>
        <title>User Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">User Management</h1>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <select
                value={filterAdmin}
                onChange={(e) => setFilterAdmin(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins Only</option>
                <option value="regular">Regular Users</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No users found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Education
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Newsletter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A'}
                        </div>
                        {user.gender && (
                          <div className="text-xs text-gray-500">{user.gender}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.district && user.state ? `${user.district}, ${user.state}` : user.state || user.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.qualification || user.education || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          user.is_admin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          user.subscribed_to_newsletter ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.subscribed_to_newsletter ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          className={`${
                            user.is_admin ? 'text-orange-600 hover:text-orange-800' : 'text-blue-600 hover:text-blue-800'
                          } font-medium`}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-primary">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Admins</h3>
            <p className="text-4xl font-bold text-accent">{users.filter(u => u.is_admin).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Newsletter Subscribers</h3>
            <p className="text-4xl font-bold text-primary">{users.filter(u => u.subscribed_to_newsletter).length}</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
