/**
 * /admin/admins
 *
 * Admin Management — superadmin only.
 * Create new admins, view existing admins, revoke admin privileges.
 */

import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

export default function AdminsPage() {
  // requireSuperadmin: the hook calls /api/admin/admins?self=1
  // which returns 403 if the caller is not in ADMIN_ALLOWLIST_EMAILS
  const { ready, denied } = useAdminProtectedPage({ requireSuperadmin: true });

  const [admins, setAdmins] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins", { credentials: "same-origin" });
      if (!res.ok) return;
      const data = await res.json();
      setAdmins(data.admins || []);
      setPendingInvites(data.pendingInvites || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) fetchAdmins();
  }, [ready, fetchAdmins]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: newEmail.trim(), name: newName.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to create admin" });
        return;
      }
      const method =
        data.method === "profile_updated"
          ? "Admin privileges granted to existing user."
          : "Admin invite created. On first login they will gain admin access.";
      setMessage({ type: "success", text: `✅ ${method}` });
      setNewEmail("");
      setNewName("");
      fetchAdmins();
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeUser = async (userId, email) => {
    if (!confirm(`Revoke admin privileges for ${email || userId}?`)) return;
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ user_id: userId }),
    });
    if (res.ok) {
      fetchAdmins();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to revoke admin" });
    }
  };

  const handleRevokeInvite = async (email) => {
    if (!confirm(`Cancel admin invite for ${email}?`)) return;
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      fetchAdmins();
    } else {
      const data = await res.json();
      setMessage({ type: "error", text: data.error || "Failed to revoke invite" });
    }
  };

  if (denied) return <AccessDenied />;
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Management — iiskills Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminNav />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Management</h1>
          <p className="text-gray-500 text-sm mb-8">
            Superadmin only. Grant or revoke admin access for team members.
          </p>

          {/* Create admin */}
          <section className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">➕ Add Admin</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (optional)
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              {message && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    message.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={creating || !newEmail}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-60 transition"
              >
                {creating ? "Adding…" : "Add Admin"}
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-3">
              If the user doesn&apos;t have an account yet, an invite is created. On their first
              login, admin access is granted automatically.
            </p>
          </section>

          {/* Current admins */}
          <section className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">👥 Current Admins</h2>
            {loading ? (
              <div className="py-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
              </div>
            ) : admins.length === 0 ? (
              <p className="text-gray-500">No admins found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-600">Name</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-600">Email</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-600">Since</th>
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium text-gray-800">
                          {[admin.first_name, admin.last_name].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="py-2 pr-4 text-gray-600">{admin.email || "—"}</td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">
                          {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => handleRevokeUser(admin.id, admin.email)}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Pending invites */}
          {pendingInvites.length > 0 && (
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold mb-4">📨 Pending Invites</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-600">Email</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-600">Name</th>
                      <th className="text-left py-2 pr-4 font-semibold text-gray-600">Invited</th>
                      <th className="py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {pendingInvites.map((invite) => (
                      <tr key={invite.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-700">{invite.email}</td>
                        <td className="py-2 pr-4 text-gray-500">{invite.name || "—"}</td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">
                          {new Date(invite.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => handleRevokeInvite(invite.email)}
                            className="text-red-600 hover:text-red-800 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
