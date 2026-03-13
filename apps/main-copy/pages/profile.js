import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Profile Page — /profile
 *
 * Accessible to any authenticated user (paid or unpaid).
 * Allows editing profile details and returns to dashboard on save.
 *
 * Client-side auth check:
 *   - Unauthenticated users → /sign-in?next=/profile
 *   - Authenticated users (paid or unpaid) → shown this editable profile page
 *
 * The actual data is fetched from /api/profile which enforces server-side auth.
 */
export default function ProfilePage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | ready | saving
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    full_name: "",
    gender: "",
    date_of_birth: "",
    education: "",
    qualification: "",
    location: "",
    district: "",
    state: "",
    country: "",
    phone: "",
  });
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const { getCurrentUser, supabase } = await import("../lib/supabaseClient");
        const user = await getCurrentUser();

        if (!mounted) return;

        if (!user) {
          router.replace("/sign-in?next=/profile");
          return;
        }

        const {
          data: { session: sess },
        } = await supabase.auth.getSession();

        if (!sess?.access_token) {
          router.replace("/sign-in?next=/profile");
          return;
        }

        if (mounted) setSession(sess);

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${sess.access_token}` },
        });

        if (res.status === 401) {
          router.replace("/sign-in?next=/profile");
          return;
        }

        const data = await res.json();
        const p = res.ok && data.profile ? data.profile : {};

        if (mounted) {
          setProfile(p);
          setEmail(data.email || user.email || "");
          setForm({
            first_name: p.first_name || "",
            last_name: p.last_name || "",
            full_name: p.full_name || "",
            gender: p.gender || "",
            date_of_birth: p.date_of_birth || "",
            education: p.education || "",
            qualification: p.qualification || "",
            location: p.location || "",
            district: p.district || "",
            state: p.state || "",
            country: p.country || "",
            phone: p.phone || "",
          });
          setStatus("ready");
        }
      } catch (err) {
        console.error("[profile] load error:", err);
        if (mounted) router.replace("/sign-in?next=/profile");
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!session) return;

    setStatus("saving");
    setSaveError("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error || "Failed to save profile. Please try again.");
        setStatus("ready");
        return;
      }

      setSaveSuccess(true);
      setStatus("ready");
      // Redirect to dashboard after a brief moment
      setTimeout(() => router.push("/apps-dashboard"), 1000);
    } catch (err) {
      console.error("[profile] save error:", err);
      setSaveError("Network error. Please check your connection and try again.");
      setStatus("ready");
    }
  }

  if (status === "loading") {
    return (
      <>
        <Head>
          <title>My Profile — iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600 text-sm">Loading your profile…</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile — iiskills.cloud</title>
        <meta name="description" content="Edit your iiskills.cloud profile details" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 text-sm mt-1">{email}</p>
              </div>
              {profile?.is_paid_user && (
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                  ⭐ Paid User
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    First Name
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Last Name
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Full Name
                  </label>
                  <input
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Full name (as on certificate)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXXXXXXX"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Date of Birth
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Education
                  </label>
                  <input
                    name="education"
                    type="text"
                    value={form.education}
                    onChange={handleChange}
                    placeholder="Highest education"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Qualification
                  </label>
                  <input
                    name="qualification"
                    type="text"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="Professional qualification"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Location / City
                  </label>
                  <input
                    name="location"
                    type="text"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City or town"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    District
                  </label>
                  <input
                    name="district"
                    type="text"
                    value={form.district}
                    onChange={handleChange}
                    placeholder="District"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    State
                  </label>
                  <input
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Country
                  </label>
                  <input
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  ✅ Profile saved! Returning to dashboard…
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "saving" || saveSuccess}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "saving" ? "Saving…" : "Save Profile"}
                </button>
                <Link
                  href="/apps-dashboard"
                  className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </form>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/tickets"
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition text-sm font-bold"
            >
              🎫 Support Tickets
            </Link>
            <Link
              href="/apps-dashboard"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-bold"
            >
              My Apps →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
