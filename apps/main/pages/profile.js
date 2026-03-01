import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Profile Page — /profile
 *
 * Visible ONLY to authenticated AND paid users.
 * Client-side auth check (consistent with this app's localStorage-based Supabase sessions):
 *   - Unauthenticated users → /sign-in?next=/profile
 *   - Authenticated but unpaid users → /payments/iiskills
 *
 * The actual data is fetched from /api/profile which enforces server-side auth.
 *
 * Displays all profile fields from public.profiles plus a "Paid User" badge.
 */
export default function ProfilePage() {
  const router = useRouter();
  const [status, setStatus] = useState("loading"); // loading | ready | no-profile
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Get current user via the shared supabase client (localStorage-based session)
        const { getCurrentUser } = await import("../lib/supabaseClient");
        const user = await getCurrentUser();

        if (!mounted) return;

        if (!user) {
          router.replace("/sign-in?next=/profile");
          return;
        }

        // Fetch profile from API (server-side checks auth + paid status)
        const { supabase } = await import("../lib/supabaseClient");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          router.replace("/sign-in?next=/profile");
          return;
        }

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (res.status === 401) {
          router.replace("/sign-in?next=/profile");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          // Check paid status separately — user may be authenticated but unpaid
          const now = new Date().toISOString();
          const { supabase: sb } = await import("../lib/supabaseClient");
          const { data: entitlement } = await sb
            .from("entitlements")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "active")
            .or(`expires_at.is.null,expires_at.gt.${now}`)
            .limit(1)
            .maybeSingle();

          if (!entitlement) {
            router.replace("/payments/iiskills");
            return;
          }

          // Has entitlement but no profile row
          if (mounted) {
            setEmail(user.email || "");
            setProfile({ is_paid_user: true, paid_at: null });
            setStatus("no-profile");
          }
          return;
        }

        if (!data.profile?.is_paid_user) {
          router.replace("/payments/iiskills");
          return;
        }

        if (mounted) {
          setProfile(data.profile);
          setEmail(data.email || user.email || "");
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

  const formatDate = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return value;
    }
  };

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

  if (status === "no-profile") {
    return (
      <>
        <Head>
          <title>My Profile — iiskills.cloud</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md mb-4">
              ⭐ Paid User
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Paid Learner!</h1>
            <p className="text-gray-600 text-sm mb-6">
              Your profile details are not set up yet. Complete your registration to see your full
              profile.
            </p>
            <Link
              href="/register"
              className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition mb-3"
            >
              Complete Registration
            </Link>
            <Link href="/" className="block text-sm text-gray-500 hover:text-gray-700">
              Back to Home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const displayName =
    profile.full_name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    email;

  const fields = [
    { label: "Full Name", value: displayName },
    { label: "Email", value: email },
    { label: "First Name", value: profile.first_name },
    { label: "Last Name", value: profile.last_name },
    { label: "Gender", value: profile.gender },
    { label: "Date of Birth", value: formatDate(profile.date_of_birth) },
    { label: "Age", value: profile.age },
    { label: "Education", value: profile.education },
    { label: "Qualification", value: profile.qualification },
    { label: "Location", value: profile.location },
    { label: "District", value: profile.district },
    { label: "State", value: profile.state },
    { label: "Country", value: profile.country },
    { label: "Member Since", value: formatDate(profile.created_at) },
    { label: "Paid Since", value: profile.paid_at ? formatDate(profile.paid_at) : null },
  ];

  return (
    <>
      <Head>
        <title>My Profile — iiskills.cloud</title>
        <meta name="description" content="Your iiskills.cloud profile and account details" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayName}</h1>
                <p className="text-gray-500 text-sm">{email}</p>
              </div>
              {profile.is_paid_user && (
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md">
                  ⭐ Paid User
                </span>
              )}
            </div>

            {/* Profile fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map(({ label, value }) =>
                value !== null && value !== undefined && value !== "" ? (
                  <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                      {label}
                    </p>
                    <p className="text-gray-900 font-medium text-sm break-words">
                      {String(value)}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/"
              className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              ← Back to Home
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
