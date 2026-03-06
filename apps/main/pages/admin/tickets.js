import Head from "next/head";
import { useState, useEffect } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

const ISSUE_LABELS = {
  payment_auth_not_made: "Payment Made Authorization Not Made",
  payment_wrongly_made_refund: "Payment Wrongly Made, Refund",
  paid_course_not_satisfactory: "Paid Course Not Satisfactory",
  other: "Other",
};

const STATUS_OPTIONS = ["open", "in_progress", "resolved", "closed"];

const STATUS_LABELS = {
  open: { text: "Open", cls: "bg-yellow-100 text-yellow-800" },
  in_progress: { text: "In Progress", cls: "bg-blue-100 text-blue-800" },
  resolved: { text: "Resolved", cls: "bg-green-100 text-green-800" },
  closed: { text: "Closed", cls: "bg-gray-100 text-gray-700" },
};

export default function AdminTickets() {
  const { ready, denied } = useAdminProtectedPage();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (ready) fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, filterStatus]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === "all" ? "/api/admin/tickets" : `/api/admin/tickets?status=${filterStatus}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (ticket) => {
    setSelectedTicket(ticket);
    setAdminNote(ticket.admin_note || "");
    setUpdateError("");
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;
    setUpdating(true);
    setUpdateError("");
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTicket.id,
          status: selectedTicket.status,
          admin_note: adminNote,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setUpdateError(data.error || "Update failed");
        return;
      }
      const data = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === data.ticket.id ? data.ticket : t)));
      setSelectedTicket(data.ticket);
    } catch {
      setUpdateError("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (denied) return <AccessDenied />;

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <>
      <Head>
        <title>Tickets — Admin — iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-neutral flex flex-col">
        <AdminNav />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">🎫 Support Tickets</h1>
            {openCount > 0 && (
              <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {openCount} open
              </span>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  filterStatus === s
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {s === "all" ? "All" : STATUS_LABELS[s]?.text || s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Ticket list */}
              <div className="space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tickets found.</p>
                ) : (
                  tickets.map((t) => {
                    const statusInfo = STATUS_LABELS[t.status] || STATUS_LABELS.open;
                    return (
                      <button
                        key={t.id}
                        onClick={() => openDetail(t)}
                        className={`w-full text-left border rounded-xl p-4 transition ${
                          selectedTicket?.id === t.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-sm">
                            {t.name} — {t.email}
                          </p>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusInfo.cls}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {ISSUE_LABELS[t.issue_type] || t.issue_type}
                        </p>
                        {t.other_text && (
                          <p className="text-xs text-gray-500 italic mt-0.5">
                            &ldquo;{t.other_text}&rdquo;
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(t.created_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Detail panel */}
              {selectedTicket && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Ticket Detail</h2>

                  <dl className="space-y-2 mb-6 text-sm">
                    <div className="flex gap-2">
                      <dt className="font-semibold text-gray-500 w-24 shrink-0">Name</dt>
                      <dd className="text-gray-900">{selectedTicket.name}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-semibold text-gray-500 w-24 shrink-0">Email</dt>
                      <dd className="text-gray-900">{selectedTicket.email}</dd>
                    </div>
                    {selectedTicket.phone && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-500 w-24 shrink-0">Phone</dt>
                        <dd className="text-gray-900">{selectedTicket.phone}</dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="font-semibold text-gray-500 w-24 shrink-0">Issue</dt>
                      <dd className="text-gray-900">
                        {ISSUE_LABELS[selectedTicket.issue_type] || selectedTicket.issue_type}
                      </dd>
                    </div>
                    {selectedTicket.other_text && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-500 w-24 shrink-0">Details</dt>
                        <dd className="text-gray-900 italic">
                          &ldquo;{selectedTicket.other_text}&rdquo;
                        </dd>
                      </div>
                    )}
                    {selectedTicket.proof_file_path && (
                      <div className="flex gap-2">
                        <dt className="font-semibold text-gray-500 w-24 shrink-0">Proof</dt>
                        <dd className="text-blue-600 text-xs break-all">
                          {selectedTicket.proof_file_path}
                        </dd>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <dt className="font-semibold text-gray-500 w-24 shrink-0">Raised</dt>
                      <dd className="text-gray-900">
                        {new Date(selectedTicket.created_at).toLocaleString("en-IN")}
                      </dd>
                    </div>
                  </dl>

                  {/* Status selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => setSelectedTicket((t) => ({ ...t, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]?.text || s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Admin note */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Note (internal)
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      placeholder="Internal notes about this ticket…"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {updateError && <p className="text-red-600 text-sm mb-3">{updateError}</p>}

                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {updating ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
