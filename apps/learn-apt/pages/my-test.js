"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * /my-test — Smart redirect page for "Take me to my test".
 *
 * Redirects the user to:
 *   1. Their last visited test (stored in localStorage under "apt_last_test")
 *   2. Or the default test landing page (/tests/numerical) if no history exists.
 */
export default function MyTest() {
  const router = useRouter();

  useEffect(() => {
    let destination = "/tests/numerical";
    try {
      const lastTest = localStorage.getItem("apt_last_test");
      if (lastTest) {
        destination = lastTest;
      }
    } catch {
      // localStorage unavailable — use default
    }
    router.replace(destination);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900">
      <div className="text-white text-center">
        <div className="text-4xl mb-4 animate-pulse">🧠</div>
        <p className="text-lg">Loading your test…</p>
      </div>
    </div>
  );
}
