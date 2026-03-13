import Head from "next/head";
import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabaseClient";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

// Fields that the admin can manually override for a user
const OVERRIDE_FIELDS = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "phone", label: "Phone" },
  { key: "gender", label: "Gender" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "qualification", label: "Qualification" },
  { key: "state", label: "State" },
  { key: "district", label: "District" },
  { key: "country", label: "Country" },
  { key: "specify_country", label: "Specify Country" },
  { key: "location", label: "Location" },
  { key: "education", label: "Education" },
  { key: "education_self", label: "Your Education" },
  { key: "education_father", label: "Father's Education" },
  { key: "education_mother", label: "Mother's Education" },
];

/**
 * ProfileOverrideModal — allows an admin to override locked profile fields for a user.
 */
function ProfileOverrideModal({ user, onClose, onSuccess, getAuthHeaders }) {
  const [form, setForm] = useState(() => {
    const initial = {};
    for (const { key } of OVERRIDE_FIELDS) {
      initial[key] = user[key] ?? "";
    }
    return initial;
  });
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Only send fields that actually changed
    const changed = {};
    for (const { key } of OVERRIDE_FIELDS) {
      const current = user[key] ?? "";
      if (form[key] !== current) {
        changed[key] = form[key];
      }
    }

    if (Object.keys(changed).length === 0) {
      setError("No fields have been changed.");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for the override (required for audit log).");
      return;
    }

    try {
      setSaving(true);
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/profile-override", {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: user.id, fields: changed, reason: reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }
      onSuccess(data.profile);
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Override Profile Fields</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              User:{" "}
              {user.full_name ||
                `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                user.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <strong>Admin override:</strong> Changes bypass the normal field-locking rules and are
            permanently recorded in the audit log. Only make corrections on behalf of the user.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {OVERRIDE_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Reason for override <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="e.g. User reported data entry mistake in first submission"
              className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : "Save Override"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { ready, denied } = useAdminProtectedPage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [overrideTarget, setOverrideTarget] = useState(null);

  useEffect(() => {
    if (ready) fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, filterAdmin]);

  const getAuthHeaders = async () => {
    const headers = { "Content-Type": "application/json" };
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
    } catch {
      // Proceed without Bearer token — admin_session cookie will be used
    }
    return headers;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const params = filterAdmin !== "all" ? `?filter=${filterAdmin}` : "";
      const res = await fetch(`/api/admin/users${params}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "remove" : "grant"} admin access?`))
      return;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ userId, isAdmin: !currentStatus }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update admin status");
      }
      alert("Admin status updated successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error updating admin status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleOverrideSuccess = (updatedProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedProfile.id ? updatedProfile : u)));
    setOverrideTarget(null);
    alert("Profile override saved and recorded in audit log.");
  };

  if (denied) return <AccessDenied />;
  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower)
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
              {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
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
                          {user.full_name ||
                            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                            "N/A"}
                        </div>
                        {user.gender && <div className="text-xs text-gray-500">{user.gender}</div>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.district && user.state
                          ? `${user.district}, ${user.state}`
                          : user.state || user.location || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.qualification || user.education || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            user.is_admin ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.is_admin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            user.subscribed_to_newsletter
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.subscribed_to_newsletter ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          className={`${
                            user.is_admin
                              ? "text-orange-600 hover:text-orange-800"
                              : "text-blue-600 hover:text-blue-800"
                          } font-medium`}
                        >
                          {user.is_admin ? "Remove Admin" : "Make Admin"}
                        </button>
                        {user.profile_submitted_at && (
                          <button
                            onClick={() => setOverrideTarget(user)}
                            className="text-purple-600 hover:text-purple-800 font-medium"
                          >
                            Edit Profile
                          </button>
                        )}
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
            <p className="text-4xl font-bold text-accent">
              {users.filter((u) => u.is_admin).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Newsletter Subscribers</h3>
            <p className="text-4xl font-bold text-primary">
              {users.filter((u) => u.subscribed_to_newsletter).length}
            </p>
          </div>
        </div>
      </main>

      {overrideTarget && (
        <ProfileOverrideModal
          user={overrideTarget}
          onClose={() => setOverrideTarget(null)}
          onSuccess={handleOverrideSuccess}
          getAuthHeaders={getAuthHeaders}
        />
      )}

      <Footer />
    </>
  );
}

