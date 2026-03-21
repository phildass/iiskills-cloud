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
        if (list?.length > 0) setSelectedCourse(list[0].app_id);
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

// ── Education options ─────────────────────────────────────────────────────────
const EDUCATION_OPTIONS = ["", "SSLC", "Graduate", "Post Graduate", "Phd", "Other"];

// ── Profile Tab Component ─────────────────────────────────────────────────────

function ProfileTab({ dashboardData, accessToken, onProfileUpdated }) {
  const { profile, email, isGoogleUser } = dashboardData;
  const isSubmitted = !!profile?.profile_submitted_at;
  const nameChangesLeft = isSubmitted ? Math.max(0, 1 - (profile?.name_change_count || 0)) : null;

  const [editing, setEditing] = useState(!isSubmitted);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveWarning, setSaveWarning] = useState("");

  const [form, setForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    gender: profile?.gender || "",
    date_of_birth: profile?.date_of_birth || "",
    education: profile?.education || "",
    education_self: profile?.education_self || "",
    education_father: profile?.education_father || "",
    education_mother: profile?.education_mother || "",
  });

  const canEditName = !isSubmitted || nameChangesLeft > 0;
  const isFieldLocked = (field) => {
    if (!isSubmitted) return false;
    const alwaysEditable = [
      "location",
      "education",
      "education_self",
      "education_father",
      "education_mother",
    ];
    if (alwaysEditable.includes(field)) return false;
    if (["first_name", "last_name"].includes(field)) return !canEditName;
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaveWarning("");
    setSaving(true);

    // Build payload — only include non-locked or changed fields
    const payload = {};
    Object.keys(form).forEach((key) => {
      if (!isFieldLocked(key)) payload[key] = form[key];
    });

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        // Build a precise, actionable error message
        let msg = data.error || "Failed to save profile";
        if (data.lockedFields && data.lockedFields.length > 0) {
          msg = `These fields cannot be changed after profile submission: ${data.lockedFields.join(", ")}. Contact support if a correction is needed.`;
        } else if (data.details) {
          msg = `${msg} — ${data.details}`;
        }
        setSaveError(msg);
        return;
      }
      if (data.warnings) {
        const locked = data.warnings.lockedFields?.join(", ");
        setSaveWarning(
          `Note: ${locked} could not be changed after submission. Contact support if a correction is needed.`
        );
      }
      onProfileUpdated(data.profile);
      setEditing(false);
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isFieldLocked(field) ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
    }`;

  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">My Profile</h2>
        <div className="flex items-center gap-3">
          {isGoogleUser && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full font-medium">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google Account
            </span>
          )}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Profile incomplete prompt */}
      {!isSubmitted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 text-sm text-blue-800">
          <strong>Complete your profile</strong> — Please fill in your name, phone number, and email
          to get the most out of your iiskills experience.
        </div>
      )}

      {isSubmitted && (
        <div className="text-xs text-gray-500 mb-4">
          Profile submitted on {new Date(profile.profile_submitted_at).toLocaleDateString("en-IN")}.
          {isSubmitted && nameChangesLeft > 0 && (
            <span className="ml-2 text-amber-600">
              You can change your name {nameChangesLeft} more time.
            </span>
          )}
          {isSubmitted && nameChangesLeft === 0 && (
            <span className="ml-2 text-gray-400">Name cannot be changed further.</span>
          )}
        </div>
      )}

      {/* Email (read-only, always) */}
      <div className="mb-3">
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={email || ""}
          readOnly
          className="border rounded-lg px-3 py-2 text-sm w-full bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                First Name{" "}
                {!isFieldLocked("first_name") ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-400 text-xs">(locked)</span>
                )}
              </label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                readOnly={isFieldLocked("first_name")}
                required={!isFieldLocked("first_name")}
                className={inputClass("first_name")}
              />
            </div>
            <div>
              <label className={labelClass}>
                Last Name{" "}
                {isFieldLocked("last_name") && (
                  <span className="text-gray-400 text-xs">(locked)</span>
                )}
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                readOnly={isFieldLocked("last_name")}
                className={inputClass("last_name")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Phone{" "}
                {!isFieldLocked("phone") ? (
                  <span className="text-red-500">*</span>
                ) : (
                  <span className="text-gray-400 text-xs">(locked)</span>
                )}
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                readOnly={isFieldLocked("phone")}
                required={!isFieldLocked("phone")}
                className={inputClass("phone")}
              />
            </div>
            <div>
              <label className={labelClass}>Location (always editable)</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={inputClass("location")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Gender{" "}
                {isFieldLocked("gender") && <span className="text-gray-400 text-xs">(locked)</span>}
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={isFieldLocked("gender")}
                className={inputClass("gender")}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                Date of Birth{" "}
                {isFieldLocked("date_of_birth") && (
                  <span className="text-gray-400 text-xs">(locked)</span>
                )}
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handleChange}
                readOnly={isFieldLocked("date_of_birth")}
                className={inputClass("date_of_birth")}
              />
            </div>
          </div>

          {/* Education fields (always editable) */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Education (always editable)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Your Education</label>
                <select
                  name="education_self"
                  value={form.education_self}
                  onChange={handleChange}
                  className={inputClass("education_self")}
                >
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt || "Select"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Father&apos;s Education</label>
                <select
                  name="education_father"
                  value={form.education_father}
                  onChange={handleChange}
                  className={inputClass("education_father")}
                >
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt || "Select"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Mother&apos;s Education</label>
                <select
                  name="education_mother"
                  value={form.education_mother}
                  onChange={handleChange}
                  className={inputClass("education_mother")}
                >
                  {EDUCATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt || "Select"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {saveError && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{saveError}</div>
          )}
          {saveWarning && (
            <div className="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2">
              {saveWarning}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : isSubmitted ? "Save Changes" : "Submit Profile"}
            </button>
            {isSubmitted && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setSaveError("");
                  setSaveWarning("");
                }}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {[
            ["Name", [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—"],
            ["Phone", profile?.phone || "—"],
            ["Location", profile?.location || "—"],
            ["Gender", profile?.gender || "—"],
            ["Date of Birth", profile?.date_of_birth || "—"],
            ["Your Education", profile?.education_self || profile?.education || "—"],
            ["Father's Education", profile?.education_father || "—"],
            ["Mother's Education", profile?.education_mother || "—"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-gray-500 text-xs font-medium">{label}</dt>
              <dd className="text-gray-800 font-medium mt-0.5">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

// ── Progress & Achievements Tab ──────────────────────────────────────────────

function formatCurrency(paise) {
  if (!paise) return "₹0";
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function AchievementsTab({ dashboardData, accessToken }) {
  const {
    badges,
    badgeCount,
    honourStudent,
    certificates,
    certificateCount,
    purchases,
    purchasesTotal,
    entitlements,
    appAccess,
    progress,
  } = dashboardData;

  // Use the shared helper to get active certified paid access records as an array
  const certifiedPaidAccess = Object.values(buildCertifiedAccessMap(appAccess));

  return (
    <div className="space-y-6">
      {/* My Accomplishments (AI) */}
      <AccomplishmentsSection accessToken={accessToken} />

      {/* Honour Student Badge */}
      {honourStudent && (
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 rounded-xl p-6 text-center shadow-lg">
          <div className="text-5xl mb-2">🏆</div>
          <h3 className="text-xl font-bold text-yellow-900">Honour Student</h3>
          <p className="text-yellow-800 text-sm mt-1">
            Congratulations! You have earned {badgeCount} badges.
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Badges Earned", value: badgeCount, icon: "🎖️" },
          { label: "Certificates", value: certificateCount, icon: "📜" },
          { label: "Lessons Passed", value: progress?.totalLessonsPassed ?? 0, icon: "✅" },
          { label: "Amount Paid", value: formatCurrency(purchasesTotal), icon: "💳" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Badges list */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">🎖️ Badges Earned</h3>
        {badges.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No badges yet. Pass a quiz to earn your first badge!
          </p>
        ) : (
          <div className="space-y-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
              >
                <div>
                  <span className="font-medium text-gray-800">{badge.app_id}</span>
                  <span className="text-gray-500 ml-2">
                    Module {badge.module_id} · Lesson {badge.lesson_id}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {badge.score != null && (
                    <span className="text-gray-600">Score: {badge.score}</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(badge.earned_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates list */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">📜 Certificates</h3>
        {certificates.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No certificates yet. Complete a course to earn your certificate.
          </p>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <div className="font-medium text-gray-800 text-sm">
                    {cert.course_name || cert.app_id}
                  </div>
                  {cert.certificate_no && (
                    <div className="text-xs text-gray-500">No: {cert.certificate_no}</div>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(cert.issued_at).toLocaleDateString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entitlements */}
      {(entitlements?.length > 0 || certifiedPaidAccess.length > 0) && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">🎓 Active Enrollments</h3>
          <div className="space-y-2">
            {certifiedPaidAccess.length > 0
              ? certifiedPaidAccess.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <span className="font-medium text-gray-800">{record.app_id}</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                          Paid User
                        </span>
                        {record.entitlement_type === "annual_paid" && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            Annual
                          </span>
                        )}
                      </div>
                    </div>
                    {record.expires_at && (
                      <span className="text-xs text-gray-500 ml-2 shrink-0">
                        Expires{" "}
                        {new Date(record.expires_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                ))
              : (entitlements || []).map((ent) => (
                  <div key={ent.id} className="flex items-center justify-between text-sm py-1">
                    <span className="font-medium text-gray-800">{ent.app_id}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                ))}
          </div>
        </div>
      )}

      {/* Payments list */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">💳 Payments</h3>
        {purchases.length === 0 ? (
          <p className="text-gray-500 text-sm">No payment records found.</p>
        ) : (
          <div className="space-y-2">
            {purchases.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
              >
                <div>
                  <span className="font-medium text-gray-800">{p.course_slug}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-IN") : "—"}
                  </span>
                </div>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(p.amount_paise)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-sm font-bold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(purchasesTotal)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── My Courses Tab ────────────────────────────────────────────────────────────

/**
 * Free courses shown in the "My Courses" tab — always visible to all users.
 * These match exactly: Chemistry | Geography | Math | Physics.
 */
const FREE_COURSES = [
  {
    id: "learn-chemistry",
    name: "Learn Chemistry",
    emoji: "⚗️",
    homeUrl: "https://learn-chemistry.iiskills.cloud/",
  },
  {
    id: "learn-geography",
    name: "Learn Geography",
    emoji: "🌍",
    homeUrl: "https://learn-geography.iiskills.cloud/",
  },
  {
    id: "learn-math",
    name: "Learn Math",
    emoji: "➗",
    homeUrl: "https://learn-math.iiskills.cloud/",
  },
  {
    id: "learn-physics",
    name: "Learn Physics",
    emoji: "⚛️",
    homeUrl: "https://learn-physics.iiskills.cloud/",
  },
];

/** Display names for paid course slugs */
const PAID_COURSE_NAMES = {
  "learn-ai": "Learn AI",
  "learn-developer": "Learn Developer",
  "learn-management": "Learn Management",
  "learn-pr": "Learn PR",
  "ai-developer-bundle": "AI + Developer Bundle",
};

function getCourseName(slug) {
  return PAID_COURSE_NAMES[slug] || slug;
}

function getCourseEmoji(slug) {
  const map = {
    "learn-ai": "🤖",
    "learn-developer": "💻",
    "learn-management": "📊",
    "learn-pr": "📣",
    "ai-developer-bundle": "🎁",
  };
  return map[slug] || "📚";
}

/**
 * Build a lookup map of certified paid app access records keyed by app_id.
 * Only includes records that are active, certified paid, and not yet expired.
 *
 * @param {Array} appAccess - Array of user_app_access records from the dashboard API
 * @returns {Object} Map of app_id -> access record
 */
function buildCertifiedAccessMap(appAccess) {
  const now = new Date();
  const map = {};
  for (const record of appAccess || []) {
    if (record.is_certified_paid_user && record.is_active) {
      const expiresAt = record.expires_at ? new Date(record.expires_at) : null;
      if (!expiresAt || expiresAt > now) {
        map[record.app_id] = record;
      }
    }
  }
  return map;
}

/** Returns display info for an entitlement's status */
function getEntitlementStatusInfo(entitlement) {
  const now = new Date();
  const isExpiredByDate = entitlement.expires_at && new Date(entitlement.expires_at) <= now;

  if (entitlement.status === "revoked") {
    return { label: "Revoked", colorClass: "bg-red-100 text-red-700" };
  }
  if (entitlement.status === "expired" || isExpiredByDate) {
    return { label: "Expired", colorClass: "bg-orange-100 text-orange-700" };
  }
  if (entitlement.status === "active") {
    if (entitlement.entitlement_type === "annual_paid") {
      return { label: "Paid (Annual)", colorClass: "bg-blue-100 text-blue-700" };
    }
    return { label: "Active", colorClass: "bg-green-100 text-green-700" };
  }
  return { label: entitlement.status, colorClass: "bg-gray-100 text-gray-600" };
}

/** Returns whether an entitlement currently grants course access */
function isEntitlementAccessible(entitlement) {
  if (entitlement.status !== "active") return false;
  if (entitlement.expires_at && new Date(entitlement.expires_at) <= new Date()) return false;
  return true;
}

function MyCourseTab({ dashboardData }) {
  const paidCourseSlugs = dashboardData?.paidCourseSlugs || [];
  const lastLessonByApp = dashboardData?.lastLessonByApp || {};
  const progressByApp = dashboardData?.progress?.byApp || {};
  const allEntitlements = dashboardData?.entitlements || [];

  // Build a lookup of certified paid app access records by app_id
  const certifiedAccessByAppId = buildCertifiedAccessMap(dashboardData?.appAccess);

  // Separate entitlements into active-accessible and inactive (expired/revoked)
  const inactiveEntitlements = allEntitlements.filter((e) => !isEntitlementAccessible(e));

  return (
    <div className="space-y-8">
      {/* ── My Free Courses ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">📗 My Free Courses</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FREE_COURSES.map((course) => (
            <a
              key={course.id}
              href={course.homeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl shadow p-5 flex flex-col items-center text-center hover:shadow-md transition group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {course.emoji}
              </span>
              <p className="font-semibold text-gray-800 text-sm">{course.name}</p>
              <span className="mt-3 inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                Free
              </span>
              <span className="mt-2 text-blue-600 text-xs font-medium group-hover:underline">
                Go to Course →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ── My Paid Courses ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-1">🔒 My Paid Courses</h2>
        <p className="text-sm text-gray-500 mb-4">Courses you currently have active access to.</p>
        {paidCourseSlugs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
            <p className="text-3xl mb-3">🎓</p>
            <p className="font-semibold text-gray-700 mb-1">No paid courses yet</p>
            <p className="text-sm">
              Explore our{" "}
              <a href="/courses" className="text-blue-600 hover:underline">
                course catalogue
              </a>{" "}
              to get started.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paidCourseSlugs.map((slug) => {
              const courseHome = `https://${slug}.iiskills.cloud/`;
              const lastLesson = lastLessonByApp[slug];
              const appProgress = progressByApp[slug];
              const hasProgress = !!lastLesson || (appProgress && appProgress.total > 0);
              const certifiedAccess = certifiedAccessByAppId[slug];

              // Deep-link to last lesson when progress exists, otherwise /learn
              let ctaUrl = courseHome;
              if (lastLesson?.module_id && lastLesson?.lesson_id) {
                ctaUrl = `https://${slug}.iiskills.cloud/learn/${lastLesson.module_id}/${lastLesson.lesson_id}`;
              } else if (hasProgress) {
                ctaUrl = `https://${slug}.iiskills.cloud/learn`;
              }

              const ctaLabel = hasProgress ? "Continue My Session" : "Start Course";

              const completionPct =
                appProgress && appProgress.total > 0
                  ? Math.round((appProgress.passed / appProgress.total) * 100)
                  : null;

              return (
                <div key={slug} className="bg-white rounded-xl shadow p-5 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{getCourseEmoji(slug)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 truncate">{getCourseName(slug)}</p>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          Enrolled
                        </span>
                        {certifiedAccess?.entitlement_type === "annual_paid" && (
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            Paid (Annual)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {certifiedAccess?.expires_at && (
                    <p className="text-xs text-gray-500 mb-3">
                      Access valid until{" "}
                      <span className="font-medium text-gray-700">
                        {new Date(certifiedAccess.expires_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  )}

                  {completionPct !== null && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{completionPct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${completionPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-auto">
                    <a
                      href={ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      {ctaLabel}
                    </a>
                    <a
                      href={courseHome}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      Go to Course Home
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Entitlement History ─────────────────────────────────────────── */}
      {allEntitlements.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-1">🎟️ Entitlement History</h2>
          <p className="text-sm text-gray-500 mb-4">
            Complete record of all courses and bundles you have been entitled to.
          </p>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">
                    Course / Bundle
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                    Purchased
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                    Expires
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allEntitlements.map((ent) => {
                  const statusInfo = getEntitlementStatusInfo(ent);
                  const isBundle = ent.app_id === "ai-developer-bundle";
                  return (
                    <tr key={ent.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getCourseEmoji(ent.app_id)}</span>
                          <div>
                            <p className="font-medium text-gray-800">{getCourseName(ent.app_id)}</p>
                            {isBundle && (
                              <p className="text-xs text-gray-500">
                                Includes: Learn AI + Learn Developer
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${statusInfo.colorClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {ent.purchased_at ? formatDate(ent.purchased_at) : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                        {ent.expires_at ? formatDate(ent.expires_at) : "Never"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize hidden md:table-cell">
                        {ent.source || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {inactiveEntitlements.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              ℹ️ Expired or revoked entitlements are shown for your records. Contact support to
              renew access.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

// ── My Accomplishments section (used inside AchievementsTab) ─────────────────

function AccomplishmentsSection({ accessToken }) {
  const [analysis, setAnalysis] = useState(undefined); // undefined = loading, null = no activity
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    fetch("/api/accomplishments", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setAnalysis(data?.analysis ?? null);
      })
      .catch(() => setAnalysis(null))
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">✨ My Accomplishments</h3>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Generating your learning summary…
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">✨ My Accomplishments</h3>
        <p className="text-gray-500 text-sm">
          No activity recorded yet. Start a lesson to see your personalized learning summary here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow p-6">
      <h3 className="text-base font-bold text-gray-900 mb-3">✨ My Accomplishments</h3>
      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{analysis}</p>
      <p className="text-xs text-gray-400 mt-3">
        AI-generated summary based on your activity data.
      </p>
    </div>
  );
}

// ── Credits Tab ───────────────────────────────────────────────────────────────

function CreditsTab({ dashboardData, accessToken }) {
  const purchases = dashboardData?.purchases || [];
  const purchasesTotal = dashboardData?.purchasesTotal || 0;
  const existingRefundRequests = dashboardData?.refundRequests || [];

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refundRequests, setRefundRequests] = useState(existingRefundRequests);

  function openRefundModal(purchase) {
    setSelectedPurchase(purchase);
    setRefundReason("");
    setSubmitError("");
    setSubmitSuccess(false);
    setShowRefundModal(true);
  }

  function closeRefundModal() {
    setShowRefundModal(false);
    setSelectedPurchase(null);
    setRefundReason("");
    setSubmitError("");
  }

  async function submitRefundRequest(e) {
    e.preventDefault();
    if (!selectedPurchase || !refundReason.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/refund-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          purchase_id: selectedPurchase.id,
          course_slug: selectedPurchase.course_slug,
          amount_paise: selectedPurchase.amount_paise,
          reason: refundReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit refund request");
        return;
      }
      setSubmitSuccess(true);
      setRefundRequests((prev) => [data.refundRequest, ...prev]);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function getRefundStatusForPurchase(purchaseId) {
    return refundRequests.find((r) => r.purchase_id === purchaseId);
  }

  const REFUND_STATUS_STYLES = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };
  const REFUND_STATUS_LABELS = {
    pending: "Refund Pending",
    approved: "Refund Approved",
    rejected: "Refund Rejected",
  };

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow p-6 text-white">
        <h2 className="text-lg font-bold mb-1">💳 Credits &amp; Payments</h2>
        <p className="text-blue-100 text-sm mb-4">Summary of all your payments and transactions.</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold">{formatCurrency(purchasesTotal)}</span>
          <span className="text-blue-200 text-sm mb-1">total paid</span>
        </div>
        {purchases.length > 0 && (
          <p className="text-blue-200 text-xs mt-2">
            {purchases.length} transaction{purchases.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Payments list */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">📋 Payment History</h3>
        {purchases.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-3xl mb-2">💳</p>
            <p className="text-sm">No payment records found.</p>
            <p className="text-xs mt-1">Enrol in a paid course to see your transactions here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((p) => {
              const existing = getRefundStatusForPurchase(p.id);
              return (
                <div
                  key={p.id}
                  className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0 gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-800 text-sm">{p.course_slug}</span>
                      {existing && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${REFUND_STATUS_STYLES[existing.status]}`}
                        >
                          {REFUND_STATUS_LABELS[existing.status]}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {p.paid_at ? formatDate(p.paid_at) : "—"}
                      {p.currency && ` · ${p.currency}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-gray-800 text-sm">
                      {formatCurrency(p.amount_paise)}
                    </span>
                    {!existing && (
                      <button
                        onClick={() => openRefundModal(p)}
                        className="text-xs text-red-600 hover:text-red-800 underline whitespace-nowrap"
                      >
                        Request Refund
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            <div className="flex justify-between pt-2 text-sm font-bold text-gray-900 border-t border-gray-200">
              <span>Total Paid</span>
              <span>{formatCurrency(purchasesTotal)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Refund Requests history */}
      {refundRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">🔄 Refund Requests</h3>
          <div className="space-y-3">
            {refundRequests.map((r) => (
              <div key={r.id} className="py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">{r.course_slug}</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${REFUND_STATUS_STYLES[r.status]}`}
                      >
                        {REFUND_STATUS_LABELS[r.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{r.reason}</p>
                    {r.admin_note && (
                      <p className="text-xs text-blue-600 mt-1">Admin: {r.admin_note}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      Submitted {formatDate(r.created_at)}
                    </p>
                  </div>
                  <span className="font-bold text-gray-700 text-sm shrink-0">
                    {formatCurrency(r.amount_paise)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">💸 Request Refund</h3>
              <button
                onClick={closeRefundModal}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Course</span>
                <span className="font-semibold text-gray-800">{selectedPurchase.course_slug}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(selectedPurchase.amount_paise)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-600">
                  {selectedPurchase.paid_at ? formatDate(selectedPurchase.paid_at) : "—"}
                </span>
              </div>
            </div>

            {submitSuccess ? (
              <div className="text-center py-4">
                <p className="text-3xl mb-2">✅</p>
                <p className="font-semibold text-green-700 mb-1">Refund request submitted!</p>
                <p className="text-sm text-gray-500">
                  Our team will review your request and get back to you.
                </p>
                <button
                  onClick={closeRefundModal}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitRefundRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for refund <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    minLength={5}
                    maxLength={1000}
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Please describe why you are requesting a refund..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <p className="text-xs text-gray-400 mt-1">{refundReason.length}/1000</p>
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeRefundModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || refundReason.trim().length < 5}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {submitting ? "Submitting…" : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────

/**
 * Dashboard Page — Protected entry page for authenticated users.
 *
 * Features:
 * - Redirects unauthenticated users to /sign-in
 * - "My Courses" tab: free courses (always) + paid courses with CTAs
 * - "My Profile" tab: profile editing with field-locking rules
 * - "Achievements" tab: badges, certificates, credits, honour student, AI accomplishments
 * - "Course Messages" tab: per-course threaded messaging with coordinators
 * - "Tickets" tab: support/billing ticketing with monthly creation limits
 */
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-profile");

  const loadDashboardData = async () => {
    // Track whether we are navigating away so the finally block does not
    // clear the loading state and briefly expose the empty dashboard UI
    // before the redirect completes.
    let redirecting = false;
    try {
      const { supabase } = await import("../lib/supabaseClient");
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        redirecting = true;
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
        // Use /api/dashboard which works for ALL authenticated users (not paid-only)
        const res = await fetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
          setProfile(data.profile || null);
        }
      }
    } catch (err) {
      console.error("[dashboard] load error:", err);
    } finally {
      // Only clear the loading spinner when we are NOT redirecting.
      // Clearing it while a redirect is in-flight causes a brief flash of
      // the dashboard UI (with null user/data) before the browser navigates.
      if (!redirecting) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    dashboardData?.email ||
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
              {profile?.is_paid_user && (
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  ⭐ Paid User
                </span>
              )}
              {dashboardData?.isGoogleUser && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded-full font-medium">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
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
                    <p className="font-semibold text-amber-900 mb-1">Complete your profile</p>
                    <p className="text-sm text-amber-800 mb-3">
                      Personalise your profile to get the most out of your iiskills subscription.
                    </p>
                    <a
                      href="/profile"
                      className="inline-block bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                    >
                      Complete Profile →
                    </a>
                  </div>
                </div>
              )}

              {/* Honour Student badge (top level, always visible) */}
              {dashboardData?.honourStudent && (
                <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 rounded-xl p-4 mb-6 flex items-center gap-4 shadow-lg">
                  <span className="text-4xl">🏆</span>
                  <div>
                    <p className="font-bold text-yellow-900 text-lg">Honour Student</p>
                    <p className="text-yellow-800 text-sm">
                      You have earned {dashboardData.badgeCount} badges!
                    </p>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: "my-courses", label: "📚 My Courses" },
                  { id: "my-profile", label: "👤 My Profile" },
                  { id: "achievements", label: "🏅 Achievements" },
                  { id: "credits", label: "💳 Credits" },
                  { id: "course-messages", label: "💬 Course Messages" },
                  { id: "tickets", label: "🎫 Tickets" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                      activeTab === id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === "my-courses" && dashboardData && (
                <MyCourseTab dashboardData={dashboardData} />
              )}
              {activeTab === "my-profile" && dashboardData && (
                <ProfileTab
                  dashboardData={dashboardData}
                  accessToken={accessToken}
                  onProfileUpdated={(updatedProfile) => {
                    setProfile(updatedProfile);
                    setDashboardData((prev) => ({ ...prev, profile: updatedProfile }));
                  }}
                />
              )}
              {activeTab === "achievements" && dashboardData && (
                <AchievementsTab dashboardData={dashboardData} accessToken={accessToken} />
              )}
              {activeTab === "credits" && dashboardData && accessToken && (
                <CreditsTab dashboardData={dashboardData} accessToken={accessToken} />
              )}
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
