import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCurrentUser, isAdmin, supabase } from "../../lib/supabaseClient";

export default function Memberships() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminAccess, setAdminAccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, pending, expired
  const router = useRouter();

  // Mock data - in production, this would come from Supabase
  const mockUsers = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      subscription_status: "active",
      subscription_end: "2026-06-15",
      joined: "2024-06-15",
      progress: 45,
    },
    {
      id: 2,
      name: "Priya Patel",
      email: "priya@example.com",
      subscription_status: "active",
      subscription_end: "2026-08-20",
      joined: "2024-08-20",
      progress: 62,
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@example.com",
      subscription_status: "pending_payment",
      subscription_end: null,
      joined: "2025-01-02",
      progress: 0,
    },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      router.push("/login?redirect=/admin/memberships");
      return;
    }

    setUser(currentUser);
    const hasAdminAccess = await isAdmin(currentUser);
    setAdminAccess(hasAdminAccess);

    if (!hasAdminAccess) {
      alert("Admin access required");
      router.push("/learn");
      return;
    }

    setIsLoading(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-800",
      pending_payment: "bg-orange-100 text-orange-800",
      expired: "bg-red-100 text-red-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      active: "Active",
      pending_payment: "Pending Payment",
      expired: "Expired",
    };
    return texts[status] || status;
  };

  const handleActivateSubscription = (userId) => {
    // In production, this would update the user in Supabase
    alert(
      `Activating subscription for user ID: ${userId}\n\nThis would:\n1. Set subscription_status to 'active'\n2. Set subscription_end to 2 years from now\n3. Send confirmation email to user`
    );
  };

  const handleExtendSubscription = (userId) => {
    // In production, this would update the subscription end date
    alert(
      `Extending subscription for user ID: ${userId}\n\nThis would add time to their subscription period.`
    );
  };

  const handleRevokeAccess = (userId) => {
    if (confirm("Are you sure you want to revoke access for this user?")) {
      alert(
        `Revoking access for user ID: ${userId}\n\nThis would set their subscription status to 'expired'.`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.subscription_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <Head>
        <title>Membership Management - Learn NEET Admin</title>
        <meta name="description" content="Manage user subscriptions and memberships" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Membership Management</h1>
                <p className="text-sm text-gray-600">Manage user subscriptions and access</p>
              </div>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="pending_payment">Pending Payment</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Subscription End</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Progress</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-charcoal">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.subscription_status)}`}
                        >
                          {getStatusText(user.subscription_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.subscription_end
                          ? new Date(user.subscription_end).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${user.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-12">{user.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(user.joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user.subscription_status === "pending_payment" && (
                            <button
                              onClick={() => handleActivateSubscription(user.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition"
                            >
                              Activate
                            </button>
                          )}
                          {user.subscription_status === "active" && (
                            <>
                              <button
                                onClick={() => handleExtendSubscription(user.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition"
                              >
                                Extend
                              </button>
                              <button
                                onClick={() => handleRevokeAccess(user.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
                              >
                                Revoke
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-600">No users found matching your criteria</p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">📊 Database Integration Required</h4>
            <p className="text-blue-800">
              The data shown above is mock data for demonstration. In production, this would be
              connected to your Supabase database to display real user subscription data, allow
              activations, extensions, and revocations.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
