"use client"; // This page uses React hooks and router queries - must run on client side

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function UnsubscribePage() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const processUnsubscribe = async () => {
      try {
        const response = await fetch("/api/newsletter/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setStatus("error");
          setErrorMessage(data.error || "Failed to process unsubscribe request");
          return;
        }

        setStatus("success");
        setEmail(data.email);
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    };

    processUnsubscribe();
  }, [token]);

  return (
    <>
      <Head>
        <title>Unsubscribe - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-neutral to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {status === "loading" && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing...</h2>
              <p className="text-gray-600">Please wait while we process your request.</p>
            </div>
          )}

          {status === "success" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Successfully Unsubscribed
                </h2>
                {email && (
                  <p className="text-gray-600 mb-4">
                    We've removed <strong className="text-primary">{email}</strong> from The
                    Skilling Newsletter.
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  💙 We're sorry to see you go!
                </p>
                <p className="text-sm text-blue-800">
                  You will no longer receive emails from The Skilling Newsletter. If this was a
                  mistake, you can always resubscribe by visiting our newsletter page.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700 text-sm">
                  <strong>What this means:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>You won't receive new course announcements via email</li>
                  <li>You won't receive important platform updates via email</li>
                  <li>You can still access all courses by logging into your account</li>
                  <li>You can resubscribe anytime from your account settings or the newsletter page</li>
                </ul>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/newsletter")}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  Resubscribe
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Unsubscribe Failed
                </h2>
                <p className="text-gray-600 mb-4">
                  We encountered an issue processing your unsubscribe request.
                </p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
                <p className="text-sm text-red-900 font-semibold mb-2">Error Details:</p>
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700 text-sm">
                  <strong>Common reasons:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>The unsubscribe link has expired (valid for 90 days)</li>
                  <li>The link has already been used</li>
                  <li>The link may be incomplete or corrupted</li>
                </ul>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-gray-700 text-sm">
                  <strong>What you can do:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-2">
                  <li>Contact support at support@iiskills.cloud for assistance</li>
                  <li>Log into your account and manage newsletter preferences in settings</li>
                  <li>Reply to any newsletter email with "unsubscribe" in the subject</li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
