import Head from "next/head";
import { useState } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

/**
 * OTP Management Page - Admin Panel
 * 
 * Per Product Requirements: Admin must be able to generate any number 
 * of OTP codes for any course (in the admin panel).
 * 
 * Features:
 * - Generate OTPs for specific courses
 * - Specify recipient email and phone
 * - View generated OTPs
 * - Send OTPs via email/SMS
 */
export default function AdminOTP() {
  const { ready, denied } = useAdminProtectedPage();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    course: "learn-pr",
    reason: "free_access",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [generatedOTPs, setGeneratedOTPs] = useState([]);

  const courses = [
    { id: "learn-pr", name: "Learn PR" },
    { id: "learn-ai", name: "Learn AI" },
    { id: "learn-developer", name: "Learn Developer" },
    { id: "learn-management", name: "Learn Management" },
    { id: "learn-chemistry", name: "Learn Chemistry" },
    { id: "learn-geography", name: "Learn Geography" },
    { id: "learn-math", name: "Learn Math" },
    { id: "learn-physics", name: "Learn Physics" },
    { id: "learn-apt", name: "Learn Aptitude" },
  ];

  const reasons = [
    { value: "free_access", label: "Free Access (Promotional)" },
    { value: "error_compensation", label: "Error Compensation" },
    { value: "admin_override", label: "Admin Override" },
    { value: "testing", label: "Testing/QA" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Validate inputs
      if (!formData.email || !formData.phone) {
        throw new Error("Email and phone number are required");
      }

      // Call the appropriate course's send-otp API
      const apiEndpoint = `/api/admin/generate-otp`;
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          course: formData.course,
          reason: formData.reason,
          adminGenerated: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate OTP");
      }

      // Success message without exposing OTP
      const deliveryStatus = [];
      if (data.emailSent) deliveryStatus.push("email");
      if (data.smsSent) deliveryStatus.push("SMS");
      
      setMessage(
        `✅ OTP generated and sent successfully via ${deliveryStatus.join(" and ")}!`
      );
      
      // Add to generated OTPs list (without actual OTP value for security)
      setGeneratedOTPs((prev) => [
        {
          email: formData.email,
          phone: formData.phone,
          course: formData.course,
          timestamp: new Date().toISOString(),
          reason: formData.reason,
          emailSent: data.emailSent,
          smsSent: data.smsSent,
        },
        ...prev.slice(0, 19), // Keep last 20 OTPs
      ]);

      // Reset form (except course)
      setFormData({
        email: "",
        phone: "",
        course: formData.course,
        reason: "free_access",
      });
    } catch (err) {
      setError(err.message || "Failed to generate OTP");
      console.error("OTP generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (denied) return <AccessDenied />;
  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>;

  return (
    <>
      <Head>
        <title>OTP Management - Admin - iiskills.cloud</title>
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">OTP Management</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* OTP Generation Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Generate New OTP
            </h2>

            <form onSubmit={handleGenerateOTP} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="user@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number * (with country code)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+919876543210"
                />
              </div>

              {/* Course Selection */}
              <div>
                <label
                  htmlFor="course"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course *
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

              {/* Reason */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for OTP Generation
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

              {/* Success/Error Messages */}
              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Generating OTP..." : "Generate & Send OTP"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-bold text-blue-900 mb-2">ℹ️ Important Notes:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>OTPs are valid for 10 minutes</li>
                <li>OTPs are sent via both email and SMS</li>
                <li>Each OTP is course-specific</li>
                <li>OTPs can be generated for free or paid courses</li>
              </ul>
            </div>
          </div>

          {/* Recent OTPs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recently Generated OTPs
            </h2>

            {generatedOTPs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No OTPs generated yet in this session
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {generatedOTPs.map((otp, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-lg font-bold text-green-600">
                        ✓ OTP Sent
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(otp.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Email:</span>
                        <span className="text-gray-700">{otp.email}</span>
                        {otp.emailSent && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Sent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Phone:</span>
                        <span className="text-gray-700">{otp.phone}</span>
                        {otp.smsSent && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Sent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Course:</span>
                        <span className="text-blue-600 font-medium">
                          {courses.find((c) => c.id === otp.course)?.name || otp.course}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Reason:</span>
                        <span className="text-gray-600">
                          {reasons.find((r) => r.value === otp.reason)?.label || otp.reason}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 italic">
                      OTP was sent to user's email and phone. Check delivery status above.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
