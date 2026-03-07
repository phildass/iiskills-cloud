import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const ISSUE_TYPES = [
  { value: "payment_auth_not_made", label: "Payment Made Authorization Not Made" },
  { value: "payment_wrongly_made_refund", label: "Payment Wrongly Made, Refund" },
  { value: "paid_course_not_satisfactory", label: "Paid Course Not Satisfactory" },
  { value: "other", label: "Other" },
];

const STATUS_LABELS = {
  not_seen_yet: "Not Seen Yet",
  under_review: "Under Review",
  resolved: "Resolved",
};

const STATUS_STYLES = {
  not_seen_yet: "bg-red-100 text-red-800",
  under_review: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
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

export default function TicketsPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState("loading"); // loading | authenticated | unauthenticated
  const [accessToken, setAccessToken] = useState(null);
  // profile and userEmail are available from useEffect but displayed via form prefill
  const [, setProfile] = useState(null);
  const [, setUserEmail] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    issue_type: "",
    other_text: "",
  });
  const [proofFile, setProofFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Tickets list state
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const { getCurrentUser, supabase } = await import("../../lib/supabaseClient");
        const user = await getCurrentUser();

        if (!mounted) return;

        if (!user) {
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

        setAccessToken(session.access_token);
        setUserEmail(user.email || "");
        setAuthState("authenticated");

        // Try to prefill from profile
        try {
          const profileRes = await fetch("/api/profile", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (profileRes.ok) {
            const { profile: p } = await profileRes.json();
            if (p) {
              setProfile(p);
              const fullName = [p.first_name, p.last_name].filter(Boolean).join(" ");
              setForm((prev) => ({
                ...prev,
                name: fullName || prev.name,
                phone: p.phone || prev.phone,
                email: user.email || prev.email,
              }));
            } else {
              setForm((prev) => ({ ...prev, email: user.email || "" }));
            }
          } else {
            setForm((prev) => ({ ...prev, email: user.email || "" }));
          }
        } catch {
          setForm((prev) => ({ ...prev, email: user.email || "" }));
        }

        // Load existing tickets
        await loadTickets(session.access_token, mounted);
      } catch (err) {
        console.error("[tickets] init error:", err);
        if (mounted) router.replace("/sign-in?next=/tickets");
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadTickets(token, mounted = true) {
    if (!token) return;
    setTicketsLoading(true);
    try {
      const res = await fetch("/api/tickets/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { tickets: list } = await res.json();
        if (mounted) setTickets(list || []);
      }
    } catch (err) {
      console.error("[tickets] load error:", err);
    } finally {
      if (mounted) setTicketsLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "issue_type" && value !== "other") {
      setForm((prev) => ({ ...prev, issue_type: value, other_text: "" }));
    }
  }

  function handleFileChange(e) {
    setProofFile(e.target.files?.[0] || null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    // Client-side validation
    if (!form.name.trim()) return setSubmitError("Name is required");
    if (!form.email.trim() || !form.email.includes("@"))
      return setSubmitError("Valid email is required");
    if (!form.issue_type) return setSubmitError("Please select an issue type");
    if (form.issue_type === "other" && !form.other_text.trim())
      return setSubmitError("Please describe your issue (required for 'Other')");
    if (form.issue_type === "other" && form.other_text.trim().length > 100)
      return setSubmitError("Description must be 100 characters or fewer");

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("phone", form.phone.trim());
      formData.append("email", form.email.trim());
      formData.append("issue_type", form.issue_type);
      if (form.issue_type === "other") {
        formData.append("other_text", form.other_text.trim());
      }
      if (proofFile) {
        formData.append("proof", proofFile);
      }

      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit ticket. Please try again.");
        return;
      }

      setSubmitSuccess(true);
      setForm((prev) => ({ ...prev, issue_type: "", other_text: "" }));
      setProofFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Reload tickets list
      await loadTickets(accessToken);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Tickets — iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎫 My Tickets</h1>
              <p className="text-gray-500 text-sm mt-1">
                Raise and track your support / payment issues here.
              </p>
            </div>
            <Link href="/profile" className="text-sm text-blue-600 hover:underline">
              ← Back to Profile
            </Link>
          </div>

          {/* Raise a Ticket Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Raise a Ticket</h2>

            {submitSuccess && (
              <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
                ✅ Ticket submitted. You can track updates here in your Tickets page.
              </div>
            )}

            {submitError && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your full name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91XXXXXXXXXX"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nature of Issue <span className="text-red-500">*</span>
                </label>
                <select
                  name="issue_type"
                  value={form.issue_type}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">— Select issue type —</option>
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
                    <span className="text-gray-400 font-normal ml-1">(max 100 characters)</span>
                  </label>
                  <textarea
                    name="other_text"
                    value={form.other_text}
                    onChange={handleChange}
                    maxLength={100}
                    rows={3}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Briefly describe your issue"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {form.other_text.length}/100
                  </p>
                </div>
              )}

              {/* Proof of payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach Proof of Payment{" "}
                  <span className="text-gray-400 font-normal">(image or PDF, optional)</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
            </form>
          </div>

          {/* Tickets list */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Previous Tickets</h2>

            {ticketsLoading ? (
              <p className="text-gray-500 text-sm">Loading tickets…</p>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No tickets yet. Raise one above if you need help.
              </p>
            ) : (
              <div className="space-y-4">
                {tickets.map((t) => (
                  <div key={t.id} className="border border-gray-200 rounded-xl p-5">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">
                          Submitted {formatDate(t.created_at)}
                        </p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {ISSUE_TYPES.find((i) => i.value === t.issue_type)?.label || t.issue_type}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[t.status] || "bg-gray-100 text-gray-800"}`}
                      >
                        {STATUS_LABELS[t.status] || t.status}
                      </span>
                    </div>

                    {t.other_text && (
                      <p className="text-sm text-gray-600 mb-2 italic">
                        &ldquo;{t.other_text}&rdquo;
                      </p>
                    )}

                    {t.proof_path && <p className="text-xs text-gray-400">📎 Proof attached</p>}

                    {t.status === "resolved" && t.resolved_at && (
                      <p className="text-xs text-green-600 mt-2">
                        Resolved on {formatDate(t.resolved_at)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
