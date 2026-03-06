import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const SUPPORT_MESSAGE =
  "If you have any issues, go to your dashboard and raise a ticket. We will revert as soon as possible.";

const ISSUE_TYPES = [
  { value: "payment_auth_not_made", label: "Payment Made Authorization Not Made" },
  { value: "payment_wrongly_made_refund", label: "Payment Wrongly Made, Refund" },
  { value: "paid_course_not_satisfactory", label: "Paid Course Not Satisfactory" },
  { value: "other", label: "Other" },
];

const STATUS_LABELS = {
  open: { text: "Open", cls: "bg-yellow-100 text-yellow-800" },
  in_progress: { text: "In Progress", cls: "bg-blue-100 text-blue-800" },
  resolved: { text: "Resolved", cls: "bg-green-100 text-green-800" },
  closed: { text: "Closed", cls: "bg-gray-100 text-gray-700" },
};

const ISSUE_LABELS = Object.fromEntries(ISSUE_TYPES.map((t) => [t.value, t.label]));

export default function TicketsPage() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [authState, setAuthState] = useState("loading"); // loading | authed | unauthed
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    issue_type: "payment_auth_not_made",
    other_text: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tickets list state
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);

  // ── Auth check ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      try {
        const { supabase, getCurrentUser } = await import("../../lib/supabaseClient");
        const currentUser = await getCurrentUser();
        if (!mounted) return;
        if (!currentUser) {
          router.replace("/sign-in?next=/tickets");
          return;
        }
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          router.replace("/sign-in?next=/tickets");
          return;
        }
        setUser(currentUser);
        setAccessToken(session.access_token);
        // Pre-fill email
        setForm((f) => ({ ...f, email: currentUser.email || "" }));
        setAuthState("authed");
      } catch {
        if (mounted) router.replace("/sign-in?next=/tickets");
      }
    }
    checkAuth();
    return () => {
      mounted = false;
    };
  }, [router]);

  // ── Load tickets ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (authState !== "authed" || !accessToken) return;
    async function loadTickets() {
      setTicketsLoading(true);
      try {
        const res = await fetch("/api/tickets", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        if (res.ok) setTickets(data.tickets || []);
      } catch {
        // non-fatal
      } finally {
        setTicketsLoading(false);
      }
    }
    loadTickets();
  }, [authState, accessToken, submitSuccess]);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // ── Upload proof file ────────────────────────────────────────────────────────
  async function uploadProof(file) {
    const uploadRes = await fetch("/api/tickets/upload-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    if (!uploadRes.ok) throw new Error("Failed to get upload URL");
    const { uploadUrl, filePath } = await uploadRes.json();

    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error("Failed to upload file");
    return filePath;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      let proof_file_path = null;
      if (proofFile) {
        proof_file_path = await uploadProof(proofFile);
      }

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ...form, proof_file_path }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit ticket. Please try again.");
        return;
      }

      // Reset form on success
      setForm({
        name: "",
        phone: "",
        email: user?.email || "",
        issue_type: "payment_auth_not_made",
        other_text: "",
      });
      setProofFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setSubmitSuccess((s) => !s); // toggle to trigger re-fetch
    } catch (err) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / auth states ────────────────────────────────────────────────────
  if (authState === "loading") {
    return (
      <>
        <Head>
          <title>Tickets — iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Tickets — iiskills.cloud</title>
        <meta name="description" content="Raise and track support tickets" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎫 Tickets</h1>
            <p className="text-gray-600 text-sm">{SUPPORT_MESSAGE}</p>
          </div>

          {/* ── Raise a Ticket Form ─────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Raise a Ticket</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9999999999"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="issue_type"
                  value={form.issue_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {ISSUE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Other text (conditional) */}
              {form.issue_type === "other" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe your issue <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="other_text"
                    value={form.other_text}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    rows={3}
                    placeholder="Briefly describe your issue (max 100 characters)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.other_text.length}/100
                  </p>
                </div>
              )}

              {/* Proof upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proof of Payment (optional)
                </label>
                <input
                  type="file"
                  ref={fileRef}
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Accepted: JPG, PNG, WEBP, GIF, PDF — max 10 MB
                </p>
              </div>

              {/* Error */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {submitError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
            </form>
          </div>

          {/* ── Ticket History ──────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Tickets</h2>

            {ticketsLoading ? (
              <div className="text-center py-6">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No tickets yet. Raise a ticket above if you need help.
              </p>
            ) : (
              <div className="space-y-4">
                {tickets.map((t) => {
                  const statusInfo = STATUS_LABELS[t.status] || STATUS_LABELS.open;
                  return (
                    <div
                      key={t.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-gray-900 text-sm">
                          {ISSUE_LABELS[t.issue_type] || t.issue_type}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${statusInfo.cls}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                      {t.other_text && (
                        <p className="text-gray-600 text-sm mb-2 italic">
                          &ldquo;{t.other_text}&rdquo;
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Raised on{" "}
                        {new Date(t.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Back link */}
          <div className="text-center">
            <Link href="/profile" className="text-sm text-blue-600 hover:underline">
              ← Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
