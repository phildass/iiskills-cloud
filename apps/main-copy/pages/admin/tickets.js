import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

const ISSUE_TYPE_LABELS = {
  payment_auth_not_made: "Payment Made Authorization Not Made",
  payment_wrongly_made_refund: "Payment Wrongly Made, Refund",
  paid_course_not_satisfactory: "Paid Course Not Satisfactory",
  other: "Other",
};

const STATUS_LABELS = {
  not_seen_yet: "Not Seen Yet",
  under_review: "Under Review",
  resolved: "Resolved",
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

function getAdminCookie() {
  if (typeof document === "undefined") return {};
  const cookies = {};
  document.cookie.split(";").forEach((c) => {
    const [k, v] = c.trim().split("=");
    if (k) cookies[k] = decodeURIComponent(v || "");
  });
  return cookies;
}

async function adminFetch(url, options = {}) {
  const cookies = getAdminCookie();
  const headers = { ...(options.headers || {}) };
  if (cookies.admin_session) {
    // Cookie is automatically sent; no extra header needed.
  }
  return fetch(url, { ...options, credentials: "same-origin", headers });
}

export default function AdminTickets() {
  const { ready, denied } = useAdminProtectedPage();
  const [activeTab, setActiveTab] = useState("not_seen_yet");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTickets = useCallback(
    async (statusFilter) => {
      if (!ready) return;
      setLoading(true);
      setError("");
      try {
        const url = `/api/admin/tickets/list${statusFilter ? `?status=${statusFilter}` : ""}`;
        const res = await adminFetch(url);
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Failed to load tickets");
          setTickets([]);
          return;
        }
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch {
        setError("Network error loading tickets");
      } finally {
        setLoading(false);
      }
    },
    [ready]
  );

  useEffect(() => {
    if (ready) fetchTickets(activeTab);
  }, [ready, activeTab, fetchTickets]);

  async function handleProofUrl(proofPath) {
    try {
      const res = await adminFetch(
        `/api/admin/tickets/proof-url?path=${encodeURIComponent(proofPath)}`
      );
      if (!res.ok) {
        alert("Failed to generate proof URL");
        return;
      }
      const { url } = await res.json();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      alert("Error fetching proof URL");
    }
  }

  async function updateStatus(ticketId, newStatus) {
    setUpdatingId(ticketId);
    try {
      const res = await adminFetch("/api/admin/tickets/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to update status");
        return;
      }
      // Refresh current tab
      await fetchTickets(activeTab);
    } catch {
      alert("Network error updating status");
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
        <title>Admin — Tickets</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminNav />

      <main className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🎫 Support Tickets</h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["not_seen_yet", "under_review", "resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  activeTab === tab
                    ? tab === "not_seen_yet"
                      ? "bg-red-600 text-white"
                      : tab === "under_review"
                        ? "bg-blue-600 text-white"
                        : "bg-green-600 text-white"
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
            <p className="text-gray-500">Loading tickets…</p>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              No tickets in &ldquo;{STATUS_LABELS[activeTab]}&rdquo;
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className={`bg-white rounded-xl border p-6 ${
                    t.status === "not_seen_yet"
                      ? "border-red-300"
                      : t.status === "under_review"
                        ? "border-blue-300"
                        : "border-green-300"
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        #{t.id.slice(0, 8)} · Created {formatDate(t.created_at)}
                      </p>
                      <p className="font-bold text-gray-900">
                        {ISSUE_TYPE_LABELS[t.issue_type] || t.issue_type}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        t.status === "not_seen_yet"
                          ? "bg-red-100 text-red-800"
                          : t.status === "under_review"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {STATUS_LABELS[t.status]}
                    </span>
                  </div>

                  {/* User snapshot */}
                  <div className="grid sm:grid-cols-3 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Name</p>
                      <p className="text-gray-800">{t.name || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                      <p className="text-gray-800 break-all">{t.email || "—"}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Phone</p>
                      <p className="text-gray-800">{t.phone || "—"}</p>
                    </div>
                  </div>

                  {t.other_text && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
                      <strong>Details:</strong> {t.other_text}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Proof link */}
                    {t.proof_path && (
                      <button
                        onClick={() => handleProofUrl(t.proof_path)}
                        className="text-xs text-blue-600 underline hover:text-blue-800"
                      >
                        📎 View Proof
                      </button>
                    )}

                    {/* Status action buttons */}
                    {t.status !== "not_seen_yet" && (
                      <button
                        onClick={() => updateStatus(t.id, "not_seen_yet")}
                        disabled={updatingId === t.id}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50 transition"
                      >
                        Mark: Not Seen Yet
                      </button>
                    )}
                    {t.status !== "under_review" && (
                      <button
                        onClick={() => updateStatus(t.id, "under_review")}
                        disabled={updatingId === t.id}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50 transition"
                      >
                        Mark: Under Review
                      </button>
                    )}
                    {t.status !== "resolved" && (
                      <button
                        onClick={() => updateStatus(t.id, "resolved")}
                        disabled={updatingId === t.id}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50 transition"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}

                    {t.status === "resolved" && t.resolved_at && (
                      <p className="text-xs text-green-600 ml-auto">
                        Resolved {formatDate(t.resolved_at)}
                      </p>
                    )}
                  </div>
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
