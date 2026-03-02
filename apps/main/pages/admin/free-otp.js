import Head from "next/head";
import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminGate } from "../../components/AdminGate";

/**
 * Free OTP Generation Page - Admin Panel
 *
 * Allows admins to generate a free OTP for a lead using only
 * their Name + Phone (email is optional).
 *
 * SMS is always sent; email is sent only when provided.
 */
export default function AdminFreeOTP() {
  const { ready } = useAdminGate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "learn-ai",
    email: "",
    reason: "admin_free_access",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const courses = [
    { id: "learn-ai", name: "Learn AI" },
    { id: "learn-developer", name: "Learn Developer" },
    { id: "learn-management", name: "Learn Management" },
    { id: "learn-pr", name: "Learn PR" },
  ];

  const reasons = [
    { value: "admin_free_access", label: "Free Access (Admin Grant)" },
    { value: "free_access", label: "Free Access (Promotional)" },
    { value: "error_compensation", label: "Error Compensation" },
    { value: "admin_override", label: "Admin Override" },
    { value: "testing", label: "Testing/QA" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/admin/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          course: formData.course,
          email: formData.email || null,
          reason: formData.reason,
          adminGenerated: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate OTP");
      }

      setResult(data);

      // Reset name/phone/email; keep course and reason
      setFormData((prev) => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
      }));
    } catch (err) {
      setError(err.message || "Failed to generate OTP");
      console.error("Free OTP generation error:", err);
    } finally {
      setLoading(false);
    }
  };

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
        <title>Free OTP Generation - Admin - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminNav />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Free OTP Generation</h1>
        <p className="text-gray-600 mb-8">
          Generate a free course OTP for a lead using their name and phone number.
          Email is optional — if provided, the OTP will also be sent via email.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+919876543210 or 9876543210"
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g. +91) or enter a 10-digit Indian number.
              </p>
            </div>

            {/* Course */}
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Course / App <span className="text-red-500">*</span>
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email (optional) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="user@example.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                If provided, OTP will also be sent via email.
              </p>
            </div>

            {/* Reason / Notes */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason / Notes <span className="text-gray-400">(optional)</span>
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {reasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Success Result */}
            {result && (
              <div className="bg-green-50 border border-green-400 rounded p-4">
                <p className="font-bold text-green-800 mb-2">✅ OTP generated successfully!</p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    <span className="font-semibold">Course:</span> {result.appName}
                  </li>
                  <li>
                    <span className="font-semibold">Delivery:</span>{" "}
                    {result.deliveryChannel === "both"
                      ? "SMS + Email"
                      : result.deliveryChannel === "sms"
                      ? "SMS"
                      : "Email"}
                  </li>
                  {result.smsSent && (
                    <li>
                      <span className="font-semibold">SMS:</span>{" "}
                      <span className="text-green-600">Sent ✓</span>
                    </li>
                  )}
                  {result.emailSent && (
                    <li>
                      <span className="font-semibold">Email:</span>{" "}
                      <span className="text-green-600">Sent ✓</span>
                    </li>
                  )}
                  <li>
                    <span className="font-semibold">Expires at:</span>{" "}
                    {new Date(result.expiresAt).toLocaleString()}
                  </li>
                </ul>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Generating OTP…" : "Generate & Send OTP"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>OTP is valid for 10 minutes</li>
              <li>SMS is always sent; email is sent only if provided</li>
              <li>Each OTP is course-specific and cannot be reused</li>
              <li>The OTP value is never shown here — it is delivered directly to the recipient</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
