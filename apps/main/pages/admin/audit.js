/**
 * /admin/audit
 *
 * Audit Log — shows privileged admin action history.
 * Accessible to all admins (regular and superadmin).
 */

import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

const ACTION_LABELS = {
  grant_entitlement: "Grant Entitlement",
  revoke_entitlement: "Revoke Entitlement",
  create_admin: "Create Admin",
  revoke_admin: "Revoke Admin",
  ban_user: "Ban User",
  unban_user: "Unban User",
  update_ticket_status: "Update Ticket Status",
};

const ACTION_COLORS = {
  grant_entitlement: "bg-green-100 text-green-800",
  revoke_entitlement: "bg-red-100 text-red-800",
  create_admin: "bg-blue-100 text-blue-800",
  revoke_admin: "bg-orange-100 text-orange-800",
  ban_user: "bg-red-100 text-red-800",
  unban_user: "bg-green-100 text-green-800",
  update_ticket_status: "bg-yellow-100 text-yellow-800",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLog() {
  const { ready, denied } = useAdminProtectedPage();

  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    action: "",
    actor_email: "",
    target: "",
    app_id: "",
    date_from: "",
    date_to: "",
  });

  const fetchEvents = useCallback(
    async (currentPage = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: currentPage, per_page: 50 });
        Object.entries(filters).forEach(([k, v]) => {
          if (v) params.set(k, v);
        });

        const res = await fetch(`/api/admin/audit?${params.toString()}`, {
          credentials: "same-origin",
        });
        if (!res.ok) {
          console.error("Failed to fetch audit events");
          return;
        }
        const data = await res.json();
        setEvents(data.events || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || 1);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    if (ready) {
      fetchEvents(page);
    }
  }, [ready, page, fetchEvents]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents(1);
  };

  const handleFilterReset = () => {
    setFilters({ action: "", actor_email: "", target: "", app_id: "", date_from: "", date_to: "" });
    setPage(1);
  };

  const exportCsv = () => {
    if (events.length === 0) return;
    const header = [
      "id",
      "created_at",
      "actor_email",
      "actor_type",
      "action",
      "target_email_or_phone",
      "app_id",
      "course_title_snapshot",
    ];
    const rows = events.map((e) =>
      [
        e.id,
        e.created_at,
        e.actor_email || "",
        e.actor_type,
        e.action,
        e.target_email_or_phone || "",
        e.app_id || "",
        e.course_title_snapshot || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <title>Audit Log — iiskills Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminNav />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
              <p className="text-gray-500 text-sm mt-1">
                Track all privileged admin actions. Total: {total}
              </p>
            </div>
            <button
              onClick={exportCsv}
              disabled={events.length === 0}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
            >
              Export CSV
            </button>
          </div>

          {/* Filters */}
          <form
            onSubmit={handleFilterSubmit}
            className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              >
                <option value="">All</option>
                {Object.entries(ACTION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Actor Email</label>
              <input
                type="text"
                value={filters.actor_email}
                onChange={(e) => setFilters((f) => ({ ...f, actor_email: e.target.value }))}
                placeholder="admin@example.com"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Target Email/Phone
              </label>
              <input
                type="text"
                value={filters.target}
                onChange={(e) => setFilters((f) => ({ ...f, target: e.target.value }))}
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">App ID</label>
              <input
                type="text"
                value={filters.app_id}
                onChange={(e) => setFilters((f) => ({ ...f, app_id: e.target.value }))}
                placeholder="learn-ai"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">From Date</label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">To Date</label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div className="col-span-2 md:col-span-3 lg:col-span-6 flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleFilterReset}
                className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Events table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? (
              <div className="py-16 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
              </div>
            ) : events.length === 0 ? (
              <div className="py-16 text-center text-gray-500">No audit events found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Time</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Actor</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Target</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">App</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Course</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((ev) => (
                      <tr key={ev.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {formatDate(ev.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ACTION_COLORS[ev.action] || "bg-gray-100 text-gray-700"}`}
                          >
                            {ACTION_LABELS[ev.action] || ev.action}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {ev.actor_email || "(emergency)"}
                          </div>
                          <div className="text-xs text-gray-400">{ev.actor_type}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {ev.target_email_or_phone || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{ev.app_id || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {ev.course_title_snapshot || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedEvent(ev)}
                            className="text-purple-600 hover:text-purple-800 text-xs font-semibold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="px-4 py-4 flex items-center justify-between border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages} ({total} total)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Detail drawer */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Audit Event Detail</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">ID</dt>
                <dd className="font-mono text-gray-700 text-xs">{selectedEvent.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Time</dt>
                <dd className="text-gray-700">{formatDate(selectedEvent.created_at)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Action</dt>
                <dd>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ACTION_COLORS[selectedEvent.action] || "bg-gray-100 text-gray-700"}`}
                  >
                    {ACTION_LABELS[selectedEvent.action] || selectedEvent.action}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Actor</dt>
                <dd className="text-gray-700">{selectedEvent.actor_email || "(emergency)"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Actor Type</dt>
                <dd className="text-gray-700">{selectedEvent.actor_type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Actor User ID</dt>
                <dd className="font-mono text-xs text-gray-600">
                  {selectedEvent.actor_user_id || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Target</dt>
                <dd className="text-gray-700">{selectedEvent.target_email_or_phone || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Target User ID</dt>
                <dd className="font-mono text-xs text-gray-600">
                  {selectedEvent.target_user_id || "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">App</dt>
                <dd className="text-gray-700">{selectedEvent.app_id || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 font-medium">Course</dt>
                <dd className="text-gray-700">{selectedEvent.course_title_snapshot || "—"}</dd>
              </div>
            </dl>

            {selectedEvent.metadata && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Metadata</p>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(selectedEvent.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
