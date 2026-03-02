/**
 * Admin Entitlements Management Page
 *
 * /admin/entitlements
 *
 * Allows admins to:
 * - Search users by email
 * - View a user's existing entitlements
 * - Grant a new entitlement (after verifying Razorpay payment reference)
 * - Revoke an entitlement
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminNav from '../../components/AdminNav';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabaseClient';
import { useAdminProtectedPage, AccessDenied } from '../../components/AdminProtectedPage';

const PAID_APPS = [
  { id: 'learn-ai', label: 'Learn AI' },
  { id: 'learn-developer', label: 'Learn Developer' },
  { id: 'learn-management', label: 'Learn Management' },
  { id: 'learn-pr', label: 'Learn PR' },
  { id: 'ai-developer-bundle', label: 'AI + Developer Bundle (both apps)' },
];

export default function AdminEntitlements() {
  const router = useRouter();
  const { ready, denied } = useAdminProtectedPage();

  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [entitlements, setEntitlements] = useState([]);
  const [searching, setSearching] = useState(false);

  const [grantAppId, setGrantAppId] = useState('learn-ai');
  const [paymentRef, setPaymentRef] = useState('');
  const [granting, setGranting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;
    setSearching(true);
    setFoundUser(null);
    setEntitlements([]);
    setMessage(null);
    try {
      // Look up user in profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', searchEmail.trim().toLowerCase())
        .maybeSingle();

      if (error || !profile) {
        setMessage({ type: 'error', text: 'User not found. Check the email address.' });
        return;
      }
      setFoundUser(profile);

      // Load entitlements
      const { data: ents } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', profile.id)
        .order('purchased_at', { ascending: false });
      setEntitlements(ents || []);
    } finally {
      setSearching(false);
    }
  };

  const handleGrant = async (e) => {
    e.preventDefault();
    if (!foundUser) return;
    setGranting(true);
    setMessage(null);
    try {
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error } = await supabase.from('entitlements').insert({
        user_id: foundUser.id,
        app_id: grantAppId,
        status: 'active',
        source: 'admin',
        payment_reference: paymentRef.trim() || null,
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      setMessage({ type: 'success', text: `✅ Entitlement granted for ${grantAppId} to ${foundUser.email}` });
      setPaymentRef('');
      // Refresh entitlements
      const { data: ents } = await supabase
        .from('entitlements')
        .select('*')
        .eq('user_id', foundUser.id)
        .order('purchased_at', { ascending: false });
      setEntitlements(ents || []);
    } catch (err) {
      setMessage({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async (entitlementId) => {
    if (!confirm('Revoke this entitlement?')) return;
    const { error } = await supabase
      .from('entitlements')
      .update({ status: 'revoked' })
      .eq('id', entitlementId);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }
    setEntitlements(prev => prev.map(e => e.id === entitlementId ? { ...e, status: 'revoked' } : e));
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
        <title>Entitlements — iiskills Admin</title>
      </Head>
      <AdminNav />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Entitlements Management</h1>
          <p className="text-gray-600 mb-8">
            Search a user by email, verify their Razorpay payment reference, then grant or revoke course access.
          </p>

          {/* Search */}
          <section className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">🔍 Find User</h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="email"
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <button
                type="submit"
                disabled={searching}
                className="px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-60 transition"
              >
                {searching ? 'Searching…' : 'Search'}
              </button>
            </form>
          </section>

          {/* Message */}
          {message && (
            <div className={`rounded-lg p-4 mb-6 font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {/* User Found */}
          {foundUser && (
            <>
              <section className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-1">👤 User</h2>
                <p className="text-gray-700">{foundUser.first_name} {foundUser.last_name} — <strong>{foundUser.email}</strong></p>
                <p className="text-xs text-gray-400 mt-1">ID: {foundUser.id}</p>
              </section>

              {/* Grant Entitlement */}
              <section className="bg-white rounded-xl shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">➕ Grant Entitlement</h2>
                <form onSubmit={handleGrant} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">App / Course</label>
                    <select
                      value={grantAppId}
                      onChange={e => setGrantAppId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {PAID_APPS.map(app => (
                        <option key={app.id} value={app.id}>{app.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Payment Reference (optional but recommended)</label>
                    <input
                      type="text"
                      value={paymentRef}
                      onChange={e => setPaymentRef(e.target.value)}
                      placeholder="pay_XXXXXXXXXXXX or order_XXXXXXXXXXXX"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={granting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60 transition"
                  >
                    {granting ? 'Granting…' : 'Grant 1-Year Access'}
                  </button>
                </form>
              </section>

              {/* Existing Entitlements */}
              <section className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold mb-4">📋 Existing Entitlements</h2>
                {entitlements.length === 0 ? (
                  <p className="text-gray-500">No entitlements found for this user.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-200">
                          <th className="py-2 pr-4 font-semibold text-gray-700">App</th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">Status</th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">Expires</th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">Source</th>
                          <th className="py-2 font-semibold text-gray-700">Payment Ref</th>
                          <th className="py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {entitlements.map(ent => (
                          <tr key={ent.id} className="border-b border-gray-100">
                            <td className="py-2 pr-4 font-medium">{ent.app_id}</td>
                            <td className="py-2 pr-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                ent.status === 'active' ? 'bg-green-100 text-green-800' :
                                ent.status === 'revoked' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>{ent.status}</span>
                            </td>
                            <td className="py-2 pr-4 text-gray-600">{ent.expires_at ? new Date(ent.expires_at).toLocaleDateString() : 'Permanent'}</td>
                            <td className="py-2 pr-4 text-gray-600">{ent.source}</td>
                            <td className="py-2 text-gray-500 font-mono text-xs">{ent.payment_reference || '—'}</td>
                            <td className="py-2">
                              {ent.status === 'active' && (
                                <button
                                  onClick={() => handleRevoke(ent.id)}
                                  className="text-red-600 hover:text-red-800 text-xs font-semibold"
                                >
                                  Revoke
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
