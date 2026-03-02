/**
 * Admin Access Control Dashboard
 * 
 * Displays and manages user app access, bundles, and payment status.
 * Shows clear paid/bundle status and allows manual overrides.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { 
  getAccessStats, 
  grantAppAccess, 
  revokeAppAccess,
  APPS,
  BUNDLES,
  getFreeApps,
  getPaidApps,
} from '../../../../packages/access-control';
import { useAdminProtectedPage, AccessDenied } from '../../components/AdminProtectedPage';

// Initialize Supabase client (client-side only)
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default function AccessControlDashboard() {
  const router = useRouter();
  const { ready, denied } = useAdminProtectedPage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAccess, setUserAccess] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    if (ready) {
      fetchStats();
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const fetchStats = async () => {
    try {
      const data = await getAccessStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchEmail) return;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .ilike('email', `%${searchEmail}%`)
      .limit(10);

    if (error) {
      console.error('Error searching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const loadUserAccess = async (userId) => {
    const supabase = getSupabaseClient();
    
    // Get user's app access records
    const { data: access, error } = await supabase
      .from('user_app_access')
      .select('*, payments(payment_id, amount, status, bundle_apps, created_at)')
      .eq('user_id', userId)
      .order('access_granted_at', { ascending: false });

    if (error) {
      console.error('Error loading user access:', error);
      return;
    }

    setUserAccess(access || []);
    setSelectedUser(userId);
  };

  const grantAccess = async (userId, appId) => {
    try {
      await grantAppAccess({
        userId,
        appId,
        grantedVia: 'admin',
        paymentId: null,
        expiresAt: null,
      });
      
      alert(`✅ Access granted to ${appId}`);
      loadUserAccess(userId);
      fetchStats();
    } catch (error) {
      console.error('Error granting access:', error);
      alert('Error granting access: ' + error.message);
    }
  };

  const revokeAccess = async (userId, appId) => {
    if (!confirm(`Are you sure you want to revoke access to ${appId}?`)) {
      return;
    }

    try {
      await revokeAppAccess(userId, appId, 'admin');
      alert(`🚫 Access revoked for ${appId}`);
      loadUserAccess(userId);
      fetchStats();
    } catch (error) {
      console.error('Error revoking access:', error);
      alert('Error revoking access: ' + error.message);
    }
  };

  if (denied) return <AccessDenied />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Access Control Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage user access, bundles, and payments</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Total Active Access</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Via Payment</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats?.byGrantType?.payment || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Via Bundle</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{stats?.byGrantType?.bundle || 0}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase">Admin Grants</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{stats?.byGrantType?.admin || 0}</p>
          </div>
        </div>

        {/* Bundle Information */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Bundles</h2>
          {Object.values(BUNDLES).map(bundle => (
            <div key={bundle.id} className="border-l-4 border-purple-500 bg-purple-50 p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-900">{bundle.name}</h3>
                  <p className="text-purple-700 mt-1">{bundle.description}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-purple-800">Apps in bundle:</span>
                    <div className="flex gap-2 mt-1">
                      {bundle.apps.map(appId => (
                        <span key={appId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-200 text-purple-800">
                          {APPS[appId]?.name || appId}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 mt-2">{bundle.highlight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* App Access by App */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Access by App</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(APPS).map(app => {
              const count = stats?.byApp?.[app.id] || 0;
              const isFree = getFreeApps().includes(app.id);
              const isBundle = Object.values(BUNDLES).some(b => b.apps.includes(app.id));
              
              return (
                <div key={app.id} className={`border rounded-lg p-4 ${isFree ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${isFree ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                          {isFree ? 'FREE' : 'PAID'}
                        </span>
                        {isBundle && (
                          <span className="text-xs px-2 py-1 rounded bg-purple-500 text-white">
                            BUNDLE
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500">users</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Search and Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Access Management</h2>
          
          {/* Search */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Search by email..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={searchUsers}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* User List */}
          {users.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Search Results</h3>
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => loadUserAccess(user.id)}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedUser === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Access →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Access Details */}
          {selectedUser && (
            <div>
              <h3 className="text-lg font-semibold mb-3">User Access Details</h3>
              
              {/* Current Access */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Access:</h4>
                {userAccess.filter(a => a.is_active).length === 0 ? (
                  <p className="text-gray-500 italic">No active access records</p>
                ) : (
                  <div className="space-y-2">
                    {userAccess.filter(a => a.is_active).map(access => (
                      <div key={access.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{APPS[access.app_id]?.name || access.app_id}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              access.granted_via === 'payment' ? 'bg-green-100 text-green-800' :
                              access.granted_via === 'bundle' ? 'bg-purple-100 text-purple-800' :
                              access.granted_via === 'admin' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {access.granted_via.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Granted: {new Date(access.access_granted_at).toLocaleDateString()}
                          </p>
                          {access.payments && (
                            <p className="text-sm text-gray-600">
                              Payment: ₹{(access.payments.amount / 100).toFixed(2)} 
                              {access.payments.bundle_apps && access.payments.bundle_apps.length > 1 && 
                                ` (Bundle: ${access.payments.bundle_apps.join(', ')})`
                              }
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => revokeAccess(selectedUser, access.app_id)}
                          className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grant Access */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Grant Manual Access:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {getPaidApps().map(appId => {
                    const hasAccess = userAccess.some(a => a.app_id === appId && a.is_active);
                    return (
                      <button
                        key={appId}
                        onClick={() => !hasAccess && grantAccess(selectedUser, appId)}
                        disabled={hasAccess}
                        className={`px-3 py-2 text-sm rounded font-medium ${
                          hasAccess 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {APPS[appId]?.name || appId}
                        {hasAccess && ' ✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
