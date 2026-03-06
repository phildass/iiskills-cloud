import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/supabaseClient";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const ISSUE_TYPE_LABELS = {
  payment_auth_not_made: "Payment Made, Auth Not Made",
  payment_wrongly_made_refund: "Payment Wrongly Made, Refund",
  paid_course_not_satisfactory: "Paid Course Not Satisfactory",
  other: "Other",
};

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

// ── Course Messages Tab ───────────────────────────────────────────────────────

function CourseMessagesTab({ accessToken }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCourse) fetchMessages(selectedCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchCourses() {
    setLoading(true);
    try {
      const res = await fetch("/api/course-messages/enrolled-courses", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const { courses: list } = await res.json();
        setCourses(list || []);
        if (list?.length > 0) {
          setSelectedCourse(list[0].app_id);
        } else {
          setSelectedCourse(null);
        }
      } else {
        let message = "Failed to load courses.";
        try {
          const payload = await res.json();
          if (payload && typeof payload === "object") {
            message = payload.message || payload.error || message;
          }
        } catch {
          // Ignore JSON parse errors; fall back to generic message.
        }
        setCourses([]);
        setSelectedCourse(null);
        setError(message);
      }
    } catch {
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMessages(courseAppId) {
    try {
      const res = await fetch(
        `/api/course-messages?course_app_id=${encodeURIComponent(courseAppId)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        const { messages: list } = await res.json();
        setMessages(list || []);
      }
    } catch {
      setError("Failed to load messages.");
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newMsg.trim() || !selectedCourse) return;
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/course-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ course_app_id: selectedCourse, message: newMsg.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send message.");
        return;
      }
      setNewMsg("");
      await fetchMessages(selectedCourse);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return <div className="text-gray-500 text-sm py-8 text-center">Loading courses…</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        <p className="text-4xl mb-3">📚</p>
        <p className="font-semibold text-gray-700 mb-1">No enrolled courses</p>
        <p className="text-sm">
          Course Messages are available for paid courses. Enrol to start a conversation with your
          course coordinator.
        </p>
      </div>
    );
  }

  const selectedCourseName =
    courses.find((c) => c.app_id === selectedCourse)?.name || selectedCourse;

  return (
    <div className="grid md:grid-cols-4 gap-6">
      {/* Course selector */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Your Courses
          </h3>
          <ul className="space-y-2">
            {courses.map((c) => (
              <li key={c.app_id}>
                <button
                  onClick={() => setSelectedCourse(c.app_id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCourse === c.app_id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Message thread */}
      <div className="md:col-span-3 flex flex-col">
        <div className="bg-white rounded-xl shadow flex flex-col" style={{ minHeight: 400 }}>
          <div className="border-b border-gray-200 px-5 py-3">
            <h3 className="font-bold text-gray-900">💬 {selectedCourseName} — Course Messages</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Your messages to the course coordinator. Replies appear below your message.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-80">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No messages yet. Start a conversation below.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.is_admin_reply ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-sm rounded-xl px-4 py-2.5 text-sm ${
                      m.is_admin_reply ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                    }`}
                  >
                    {m.is_admin_reply && (
                      <p className="text-xs font-bold mb-1 text-blue-700">Course Coordinator</p>
                    )}
                    <p>{m.message}</p>
                    <p
                      className={`text-xs mt-1 ${m.is_admin_reply ? "text-gray-400" : "text-blue-200"}`}
                    >
                      {formatDate(m.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send form */}
          <div className="border-t border-gray-200 p-4">
            {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message…"
                maxLength={2000}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={sending || !newMsg.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tickets Tab ───────────────────────────────────────────────────────────────

const ISSUE_TYPES = [
  { value: "payment_auth_not_made", label: "Payment Made, Auth Not Made" },
  { value: "payment_wrongly_made_refund", label: "Payment Wrongly Made, Refund" },
  { value: "paid_course_not_satisfactory", label: "Paid Course Not Satisfactory" },
  { value: "other", label: "Other" },
];

function TicketsTab({ accessToken, userEmail, userName, userPhone }) {
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyMsg, setReplyMsg] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [form, setForm] = useState({
    name: userName || "",
    phone: userPhone || "",
    email: userEmail || "",
    issue_type: "",
    other_text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [replyError, setReplyError] = useState("");
  const fileInputRef = useRef(null);
  const [proofFile, setProofFile] = useState(null);

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefill form when user data loads
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: userName || prev.name,
      phone: userPhone || prev.phone,
      email: userEmail || prev.email,
    }));
  }, [userName, userPhone, userEmail]);

  async function loadTickets() {
    setTicketsLoading(true);
    try {
      const res = await fetch("/api/tickets/list", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const { tickets: list } = await res.json();
        setTickets(list || []);
      }
    } catch {
      // fail silently
    } finally {
      setTicketsLoading(false);
    }
  }

  async function loadReplies(ticketId) {
    try {
      const res = await fetch(`/api/tickets/replies?ticket_id=${ticketId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        const { replies: list } = await res.json();
        setReplies(list || []);
      }
    } catch {
      // fail silently
    }
  }

  function handleTicketSelect(ticket) {
    setSelectedTicket(ticket);
    setReplies([]);
    setReplyMsg("");
    setReplyError("");
    loadReplies(ticket.id);
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!replyMsg.trim() || !selectedTicket) return;
    setReplyError("");
    setSendingReply(true);
    try {
      const res = await fetch("/api/tickets/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ticket_id: selectedTicket.id, message: replyMsg.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReplyError(data.error || "Failed to send reply.");
        return;
      }
      setReplyMsg("");
      await loadReplies(selectedTicket.id);
    } catch {
      setReplyError("Network error. Please try again.");
    } finally {
      setSendingReply(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "issue_type" && value !== "other") {
      setForm((prev) => ({ ...prev, issue_type: value, other_text: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

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
      if (form.issue_type === "other") formData.append("other_text", form.other_text.trim());
      if (proofFile) formData.append("proof", proofFile);

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
      await loadTickets();
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid md:grid-cols-5 gap-6">
      {/* Ticket list */}
      <div className="md:col-span-2 space-y-4">
        {/* Raise ticket form */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-gray-900 mb-4">🎫 Raise a Ticket</h3>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              ✅ Ticket submitted. Track updates in the list.
            </div>
          )}
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name *"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email address *"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="issue_type"
              value={form.issue_type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Select issue type —</option>
              {ISSUE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {form.issue_type === "other" && (
              <textarea
                name="other_text"
                value={form.other_text}
                onChange={handleChange}
                maxLength={100}
                rows={2}
                placeholder="Describe your issue (max 100 chars)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="w-full text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100 cursor-pointer"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? "Submitting…" : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Previous tickets */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-gray-900 mb-3">My Tickets</h3>
          {ticketsLoading ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : tickets.length === 0 ? (
            <p className="text-gray-400 text-sm">No tickets yet.</p>
          ) : (
            <ul className="space-y-2">
              {tickets.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => handleTicketSelect(t)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                      selectedTicket?.id === t.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="font-semibold truncate">
                      {ISSUE_TYPE_LABELS[t.issue_type] || t.issue_type}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${selectedTicket?.id === t.id ? "text-blue-200" : "text-gray-400"}`}
                    >
                      {formatDate(t.created_at)}
                    </p>
                    <span
                      className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                        selectedTicket?.id === t.id
                          ? "bg-white/20 text-white"
                          : STATUS_STYLES[t.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_LABELS[t.status] || t.status}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Ticket detail / conversation */}
      <div className="md:col-span-3">
        {!selectedTicket ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🎫</p>
            <p className="text-sm">Select a ticket from the list to view the conversation.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow flex flex-col" style={{ minHeight: 420 }}>
            {/* Ticket header */}
            <div className="border-b border-gray-200 px-5 py-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {ISSUE_TYPE_LABELS[selectedTicket.issue_type] || selectedTicket.issue_type}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted {formatDate(selectedTicket.created_at)}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLES[selectedTicket.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {STATUS_LABELS[selectedTicket.status] || selectedTicket.status}
                </span>
              </div>
              {selectedTicket.other_text && (
                <p className="text-xs text-gray-600 mt-2 italic">
                  &ldquo;{selectedTicket.other_text}&rdquo;
                </p>
              )}
            </div>

            {/* Replies */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-64">
              {replies.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No replies yet.{" "}
                  {selectedTicket.status !== "resolved"
                    ? "Add a message below to provide more details."
                    : "This ticket has been resolved."}
                </p>
              ) : (
                replies.map((r) => (
                  <div
                    key={r.id}
                    className={`flex ${r.is_admin ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-sm rounded-xl px-4 py-2.5 text-sm ${
                        r.is_admin ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                      }`}
                    >
                      {r.is_admin && (
                        <p className="text-xs font-bold mb-1 text-blue-700">Support Team</p>
                      )}
                      <p>{r.message}</p>
                      <p
                        className={`text-xs mt-1 ${r.is_admin ? "text-gray-400" : "text-blue-200"}`}
                      >
                        {formatDate(r.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply form */}
            {selectedTicket.status !== "resolved" && (
              <div className="border-t border-gray-200 p-4">
                {replyError && <p className="text-red-600 text-xs mb-2">{replyError}</p>}
                <form onSubmit={handleReply} className="flex gap-3">
                  <input
                    type="text"
                    value={replyMsg}
                    onChange={(e) => setReplyMsg(e.target.value)}
                    placeholder="Add a message…"
                    maxLength={2000}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingReply || !replyMsg.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {sendingReply ? "Sending…" : "Send"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────

/**
 * Dashboard Page — Protected entry page for authenticated users.
 *
 * Features:
 * - Redirects unauthenticated users to /sign-in
 * - "Course Messages" tab: per-course threaded messaging with coordinators
 * - "Tickets" tab: support/billing ticketing with monthly creation limits
 */
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("course-messages");

  const loadDashboardData = async () => {
    try {
      const { supabase } = await import("../lib/supabaseClient");
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        const next = encodeURIComponent("/dashboard");
        router.replace(`/sign-in?next=${next}`);
        return;
      }

      setUser(currentUser);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        setAccessToken(session.access_token);
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile || null);
        }
      }
    } catch (err) {
      console.error("[dashboard] load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user?.email;

  const userName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");
  const userPhone = profile?.phone || "";

  return (
    <>
      <Head>
        <title>My Dashboard - iiskills.cloud</title>
        <meta name="description" content="Your personal dashboard" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              {!isLoading && displayName && (
                <p className="text-gray-500 mt-1">
                  Welcome back,{" "}
                  <span className="font-semibold text-gray-700">
                    {displayName.trim().split(/\s+/)[0]}
                  </span>
                  ! 👋
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a href="/profile" className="text-sm text-blue-600 hover:underline">
                Edit Profile
              </a>
              {profile?.is_paid_user && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  ⭐ Paid
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white p-8 rounded-xl shadow text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading your dashboard…</p>
            </div>
          ) : (
            <>
              {/* Onboarding banner */}
              {profile?.is_paid_user && !profile?.registration_completed && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 mb-6 flex items-start gap-4">
                  <span className="text-2xl">🎉</span>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-900 mb-1">Complete your account setup</p>
                    <p className="text-sm text-amber-800 mb-3">
                      Set a password and personalise your profile to get the most out of your
                      iiskills subscription.
                    </p>
                    <a
                      href="/complete-registration"
                      className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Complete setup →
                    </a>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab("course-messages")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "course-messages"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  💬 Course Messages
                </button>
                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                    activeTab === "tickets"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  🎫 Tickets
                </button>
              </div>

              {/* Tab content */}
              {activeTab === "course-messages" && accessToken && (
                <CourseMessagesTab accessToken={accessToken} />
              )}
              {activeTab === "tickets" && accessToken && (
                <TicketsTab
                  accessToken={accessToken}
                  userEmail={user?.email || ""}
                  userName={userName}
                  userPhone={userPhone}
                />
              )}
              {!accessToken && (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                  <p>
                    Session expired.{" "}
                    <a href="/sign-in?next=/dashboard" className="text-blue-600 hover:underline">
                      Sign in again
                    </a>
                    .
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
