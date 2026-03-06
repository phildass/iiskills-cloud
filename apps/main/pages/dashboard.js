import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getCurrentUser } from "../lib/supabaseClient";

/**
 * Dashboard Page — Protected entry page for authenticated users.
 *
 * Features:
 * - Redirects unauthenticated users to /sign-in
 * - Displays username and user info from the profile API
 * - "Edit your profile" CTA linking to /profile
 * - Onboarding banner for paid users who have not yet completed registration
 * - Quick links to courses and certification
 */
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      // Fetch profile for username and registration status
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
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

  const displayName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user?.email;

  return (
    <>
      <Head>
        <title>Dashboard - iiskills.cloud</title>
        <meta name="description" content="Your personal dashboard" />
      </Head>

      <div className="min-h-screen bg-neutral py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">My Dashboard</h1>

          {isLoading ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">Loading your dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Onboarding banner — shown only to paid users who haven't set a password yet */}
              {profile?.is_paid_user && !profile?.registration_completed && (
                <div className="bg-amber-50 border border-amber-300 rounded-lg p-5 mb-6 flex items-start gap-4">
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

              {/* Welcome / profile card */}
              <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-charcoal mb-1">
                      Welcome back{displayName ? `, ${displayName.split(" ")[0]}` : ""}! 👋
                    </h2>
                    {profile?.username && (
                      <p className="text-blue-600 font-medium mb-2">@{profile.username}</p>
                    )}
                    {profile?.is_paid_user && (
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        ⭐ Paid User
                      </span>
                    )}
                  </div>

                  {/* Edit profile CTA */}
                  <a
                    href="/profile"
                    className="inline-flex items-center gap-2 border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l6.5-6.5a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H8v-2.414a2 2 0 01.586-1.414z"
                      />
                    </svg>
                    Edit your details
                  </a>
                </div>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Account created:{" "}
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Quick Links</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="/apps-dashboard"
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-primary mb-2">📚 My Courses</h3>
                    <p className="text-sm text-gray-600">View and manage your enrolled courses</p>
                  </a>
                  <a
                    href="/certification"
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-primary mb-2">✅ Get Certified</h3>
                    <p className="text-sm text-gray-600">Browse available certifications</p>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
