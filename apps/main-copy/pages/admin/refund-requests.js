import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
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

function formatCurrency(paise) {
  if (!paise) return "₹0";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

async function adminFetch(url, options = {}) {
  return fetch(url, { ...options, credentials: "same-origin" });
}

export default function AdminRefundRequests() {
  const { ready, denied } = useAdminProtectedPage();
  const [activeTab, setActiveTab] = useState("pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [noteInputs, setNoteInputs] = useState({});
  const [actionError, setActionError] = useState({});

  const fetchRequests = useCallback(
    async (statusFilter) => {
      if (!ready) return;
      setLoading(true);
      setError("");
      try {
        const url = `/api/admin/refund-requests${statusFilter ? `?status=${statusFilter}` : ""}`;
        const res = await adminFetch(url);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load refund requests");
          setRequests([]);
          return;
        }
        const data = await res.json();
        setRequests(data.refundRequests || []);
      } catch {
        setError("Network error loading refund requests");
      } finally {
        setLoading(false);
      }
    },
    [ready]
  );

  useEffect(() => {
    if (ready) fetchRequests(activeTab);
  }, [ready, activeTab, fetchRequests]);

  async function handleAction(id, status) {
    setUpdatingId(id);
    setActionError((prev) => ({ ...prev, [id]: "" }));
    try {
      const res = await adminFetch("/api/admin/refund-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          admin_note: noteInputs[id] || "",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setActionError((prev) => ({ ...prev, [id]: data.error || "Failed to update" }));
        return;
      }
      await fetchRequests(activeTab);
    } catch {
      setActionError((prev) => ({ ...prev, [id]: "Network error" }));
    } finally {
      setUpdatingId(null);
    }
  }

  if (denied) return <AccessDenied />;

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin — Refund Requests</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminNav />

      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">💸 Refund Requests</h1>
            <Link href="/admin" className="text-sm text-blue-600 hover:underline">
              ← Back to Dashboard
            </Link>
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab
                    ? tab === "pending"
                      ? "bg-amber-500 text-white"
                      : tab === "approved"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {STATUS_LABELS[tab]}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-gray-500">Loading refund requests…</p>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No {STATUS_LABELS[activeTab].toLowerCase()} refund requests.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className={`bg-white rounded-xl border p-6 ${
                    r.status === "pending"
                      ? "border-amber-300"
                      : r.status === "approved"
                        ? "border-green-300"
                        : "border-red-300"
                  }`}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        #{r.id.slice(0, 8)} · Submitted {formatDate(r.created_at)}
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {r.course_slug}{" "}
                        <span className="text-base font-semibold text-gray-600">
                          — {formatCurrency(r.amount_paise)}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        r.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : r.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>

                  {/* User info */}
                  <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Name</p>
                      <p className="text-gray-800">{r.user_name || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                      <p className="text-gray-800 break-all">{r.user_email || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Phone</p>
                      <p className="text-gray-800">{r.user_phone || "—"}</p>
                    </div>
                  </div>

                  {/* Purchase reference */}
                  {r.purchase_id && (
                    <p className="text-xs text-gray-400 mb-3">
                      Purchase ID: <span className="font-mono">{r.purchase_id}</span>
                    </p>
                  )}

                  {/* Reason */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-gray-700">
                    <strong>Reason:</strong> {r.reason}
                  </div>

                  {/* Admin note (existing) */}
                  {r.admin_note && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
                      <strong>Admin note:</strong> {r.admin_note}
                    </div>
                  )}

                  {/* Acted info */}
                  {r.acted_at && (
                    <p className="text-xs text-gray-400 mb-4">
                      {r.status === "approved" ? "Approved" : "Rejected"} by {r.acted_by || "admin"}{" "}
                      on {formatDate(r.acted_at)}
                    </p>
                  )}

                  {/* Action area — only for pending */}
                  {r.status === "pending" && (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        placeholder="Admin note (optional)"
                        value={noteInputs[r.id] || ""}
                        onChange={(e) =>
                          setNoteInputs((prev) => ({ ...prev, [r.id]: e.target.value }))
                        }
                        maxLength={500}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                      {actionError[r.id] && (
                        <p className="text-xs text-red-600">{actionError[r.id]}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleAction(r.id, "approved")}
                          disabled={updatingId === r.id}
                          className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50 transition"
                        >
                          ✓ Approve Refund
                        </button>
                        <button
                          onClick={() => handleAction(r.id, "rejected")}
                          disabled={updatingId === r.id}
                          className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50 transition"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
